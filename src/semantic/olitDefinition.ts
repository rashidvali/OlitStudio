import * as vscode from 'vscode';

export class OlitDefinitionProvider implements vscode.DefinitionProvider {
    
    public provideDefinition(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        
        console.log('OlitDefinition: provideDefinition called at position', position);
        
        const text = document.getText();
        const offset = document.offsetAt(position);
        
        console.log('OlitDefinition: checking offset', offset);
        
        // Check if we're inside a d`` template
        const dTemplateMatch = this.findContainingDTemplate(text, offset);
        if (!dTemplateMatch) {
            console.log('OlitDefinition: not inside d`` template');
            return null;
        }
        
        console.log('OlitDefinition: found d`` template match');
        
        // Get the word at the current position
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            console.log('OlitDefinition: no word range at position');
            return null;
        }
        
        const word = document.getText(wordRange);
        console.log('OlitDefinition: searching for word:', word);
        
        // Look for TypeScript object definitions
        return this.findTypeScriptDefinition(document, word, wordRange);
    }
    
    private findContainingDTemplate(text: string, offset: number): RegExpMatchArray | null {
        const dTemplateRegex = /d\s*`([\s\S]*?)`/g;
        let match: RegExpExecArray | null;
        
        console.log('OlitDefinition: searching for d`` templates in text...');
        
        while ((match = dTemplateRegex.exec(text)) !== null) {
            const start = match.index + match[0].indexOf('`') + 1;
            const end = start + match[1].length;
            
            console.log(`OlitDefinition: found template from ${start} to ${end}, checking offset ${offset}`);
            
            if (offset >= start && offset <= end) {
                console.log('OlitDefinition: offset is inside this template!');
                return match;
            }
        }
        
        console.log('OlitDefinition: no matching d`` template found');
        return null;
    }
    
    private async findTypeScriptDefinition(
        document: vscode.TextDocument, 
        word: string, 
        wordRange: vscode.Range
    ): Promise<vscode.Definition | null> {
        
        // Common TypeScript patterns to search for (with capture groups for precise positioning)
        const patterns = [
            // Class definitions
            { regex: new RegExp(`^(\\s*(?:export\\s+)?(?:abstract\\s+)?class\\s+)(${word})\\b`, 'gm'), type: 'class' },
            // Interface definitions  
            { regex: new RegExp(`^(\\s*(?:export\\s+)?interface\\s+)(${word})\\b`, 'gm'), type: 'interface' },
            // Type definitions
            { regex: new RegExp(`^(\\s*(?:export\\s+)?type\\s+)(${word})\\b`, 'gm'), type: 'type' },
            // Enum definitions
            { regex: new RegExp(`^(\\s*(?:export\\s+)?enum\\s+)(${word})\\b`, 'gm'), type: 'enum' },
            // Function definitions
            { regex: new RegExp(`^(\\s*(?:export\\s+)?(?:async\\s+)?function\\s+)(${word})\\b`, 'gm'), type: 'function' },
            // Variable/const definitions
            { regex: new RegExp(`^(\\s*(?:export\\s+)?(?:const|let|var)\\s+)(${word})\\b`, 'gm'), type: 'variable' },
        ];
        
        // Search in current document first
        const currentText = document.getText();
        
        // Check if word is imported or defined locally (basic validation)  
        const isLocallyDefined = this.isWordDefinedLocally(currentText, word);
        console.log(`Word '${word}' locally defined:`, isLocallyDefined);
        for (const patternObj of patterns) {
            const match = patternObj.regex.exec(currentText);
            if (match) {
                // Position at the actual word (group 2), not the start of the line
                const wordStartOffset = match.index + match[1].length;
                const position = document.positionAt(wordStartOffset);
                console.log(`Found ${patternObj.type} '${word}' at position:`, position);
                return new vscode.Location(document.uri, position);
            }
        }
        
        // If not found locally and not imported, don't search workspace
        if (!isLocallyDefined) {
            console.log(`Word '${word}' not imported/defined locally, skipping workspace search`);
            return null;
        }
        
        // Search in workspace for TypeScript files
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) {
            return null;
        }
        
        try {
            const files = await vscode.workspace.findFiles(
                new vscode.RelativePattern(workspaceFolder, '**/*.ts'),
                '**/node_modules/**',
                100 // Limit to 100 files for performance
            );
            
            for (const file of files) {
                if (file.toString() === document.uri.toString()) {
                    continue; // Skip current file (already searched)
                }
                
                try {
                    const fileDocument = await vscode.workspace.openTextDocument(file);
                    const fileText = fileDocument.getText();
                    
                    for (const patternObj of patterns) {
                        patternObj.regex.lastIndex = 0; // Reset regex state
                        const match = patternObj.regex.exec(fileText);
                        if (match) {
                            // Position at the actual word (group 2), not the start of the line
                            const wordStartOffset = match.index + match[1].length;
                            const position = fileDocument.positionAt(wordStartOffset);
                            console.log(`Found ${patternObj.type} '${word}' in ${file.fsPath} at position:`, position);
                            return new vscode.Location(file, position);
                        }
                    }
                } catch (error) {
                    // Skip files that can't be opened
                    continue;
                }
            }
        } catch (error) {
            console.error('Error searching for definitions:', error);
        }
        
        return null;
    }
    
    private isWordDefinedLocally(text: string, word: string): boolean {
        // Check if the word is imported
        const importRegex = new RegExp(`import\\s*\\{[^}]*\\b${word}\\b[^}]*\\}\\s*from`, 'g');
        const defaultImportRegex = new RegExp(`import\\s+${word}\\s+from`, 'g');
        
        if (importRegex.test(text) || defaultImportRegex.test(text)) {
            return true;
        }
        
        // Check if the word is defined in the current file
        const definitions = [
            new RegExp(`^\\s*(?:export\\s+)?(?:abstract\\s+)?class\\s+${word}\\b`, 'gm'),
            new RegExp(`^\\s*(?:export\\s+)?interface\\s+${word}\\b`, 'gm'),
            new RegExp(`^\\s*(?:export\\s+)?type\\s+${word}\\b`, 'gm'),
            new RegExp(`^\\s*(?:export\\s+)?enum\\s+${word}\\b`, 'gm'),
            new RegExp(`^\\s*(?:export\\s+)?(?:async\\s+)?function\\s+${word}\\b`, 'gm'),
            new RegExp(`^\\s*(?:export\\s+)?(?:const|let|var)\\s+${word}\\b`, 'gm'),
        ];
        
        return definitions.some(regex => regex.test(text));
    }
}