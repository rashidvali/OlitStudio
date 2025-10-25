import * as vscode from 'vscode';

export class OlitDefinitionProvider implements vscode.DefinitionProvider {
    
    public provideDefinition(
        document: vscode.TextDocument, 
        position: vscode.Position, 
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.DefinitionLink[]> {
        
        const text = document.getText();
        const offset = document.offsetAt(position);
        
        // Check if we're inside a d`` template
        const dTemplateMatch = this.findContainingDTemplate(text, offset);
        if (!dTemplateMatch) {
            return null;
        }
        
        // Get the word at the current position
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return null;
        }
        
        const word = document.getText(wordRange);
        
        // Look for TypeScript object definitions
        return this.findTypeScriptDefinition(document, word, wordRange);
    }
    
    private findContainingDTemplate(text: string, offset: number): RegExpMatchArray | null {
        const dTemplateRegex = /d\s*`([\s\S]*?)`/g;
        let match: RegExpExecArray | null;
        
        while ((match = dTemplateRegex.exec(text)) !== null) {
            const start = match.index + match[0].indexOf('`') + 1;
            const end = start + match[1].length;
            
            if (offset >= start && offset <= end) {
                return match;
            }
        }
        
        return null;
    }
    
    private async findTypeScriptDefinition(
        document: vscode.TextDocument, 
        word: string, 
        wordRange: vscode.Range
    ): Promise<vscode.Definition | null> {
        
        // Common TypeScript patterns to search for
        const patterns = [
            // Class definitions
            new RegExp(`^\\s*(?:export\\s+)?(?:abstract\\s+)?class\\s+${word}\\b`, 'gm'),
            // Interface definitions  
            new RegExp(`^\\s*(?:export\\s+)?interface\\s+${word}\\b`, 'gm'),
            // Type definitions
            new RegExp(`^\\s*(?:export\\s+)?type\\s+${word}\\b`, 'gm'),
            // Enum definitions
            new RegExp(`^\\s*(?:export\\s+)?enum\\s+${word}\\b`, 'gm'),
            // Variable/const definitions
            new RegExp(`^\\s*(?:export\\s+)?(?:const|let|var)\\s+${word}\\b`, 'gm'),
        ];
        
        // Search in current document first
        const currentText = document.getText();
        for (const pattern of patterns) {
            const match = pattern.exec(currentText);
            if (match) {
                const position = document.positionAt(match.index);
                return new vscode.Location(document.uri, position);
            }
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
                    
                    for (const pattern of patterns) {
                        pattern.lastIndex = 0; // Reset regex state
                        const match = pattern.exec(fileText);
                        if (match) {
                            const position = fileDocument.positionAt(match.index);
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
}