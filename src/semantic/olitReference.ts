import * as vscode from 'vscode';

export class OlitReferenceProvider implements vscode.ReferenceProvider {
    
    async provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): Promise<vscode.Location[]> {
        
        const references: vscode.Location[] = [];
        
        // Get the word at the current position
        const wordRange = document.getWordRangeAtPosition(position);
        if (!wordRange) {
            return references;
        }
        
        const word = document.getText(wordRange);
        console.log('OlitReference: searching for references to:', word);
        
        // Only provide references for TypeScript symbols that we care about
        if (!this.isRelevantSymbol(document, word)) {
            console.log('OlitReference: not a relevant symbol, returning empty');
            return references;
        }
        
        // If context.includeDeclaration is true, include the definition itself
        if (context.includeDeclaration) {
            // Find the definition in current document
            const definition = this.findDefinitionInDocument(document, word);
            if (definition) {
                references.push(definition);
            }
        }
        
        // Search for references in OlitDOM templates in current document
        const currentDocReferences = this.findTemplateReferences(document, word);
        references.push(...currentDocReferences);
        
        // Search for references in other TypeScript files in workspace
        const workspaceReferences = await this.findWorkspaceReferences(word);
        references.push(...workspaceReferences);
        
        console.log(`OlitReference: found ${references.length} references to '${word}'`);
        return references;
    }
    
    private findDefinitionInDocument(document: vscode.TextDocument, word: string): vscode.Location | null {
        const text = document.getText();
        
        // Patterns to find definitions (same as definition provider)
        const patterns = [
            new RegExp(`^(\\s*(?:export\\s+)?(?:abstract\\s+)?class\\s+)(${word})\\b`, 'gm'),
            new RegExp(`^(\\s*(?:export\\s+)?interface\\s+)(${word})\\b`, 'gm'),
            new RegExp(`^(\\s*(?:export\\s+)?type\\s+)(${word})\\b`, 'gm'),
            new RegExp(`^(\\s*(?:export\\s+)?enum\\s+)(${word})\\b`, 'gm'),
            new RegExp(`^(\\s*(?:export\\s+)?(?:async\\s+)?function\\s+)(${word})\\b`, 'gm'),
            new RegExp(`^(\\s*(?:export\\s+)?(?:const|let|var)\\s+)(${word})\\b`, 'gm'),
        ];
        
        for (const pattern of patterns) {
            const match = pattern.exec(text);
            if (match) {
                const wordStartOffset = match.index + match[1].length;
                const position = document.positionAt(wordStartOffset);
                return new vscode.Location(document.uri, position);
            }
        }
        
        return null;
    }
    
    private findTemplateReferences(document: vscode.TextDocument, word: string): vscode.Location[] {
        const references: vscode.Location[] = [];
        const text = document.getText();
        
        // Find all d`` templates
        const dTemplateRegex = /d\s*`([\s\S]*?)`/g;
        let templateMatch: RegExpExecArray | null;
        
        while ((templateMatch = dTemplateRegex.exec(text)) !== null) {
            const templateContent = templateMatch[1];
            const templateStart = templateMatch.index + templateMatch[0].indexOf('`') + 1;
            
            // Find word references within this template
            const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
            let wordMatch: RegExpExecArray | null;
            
            while ((wordMatch = wordRegex.exec(templateContent)) !== null) {
                const wordOffset = templateStart + wordMatch.index;
                const position = document.positionAt(wordOffset);
                const wordRange = new vscode.Range(position, document.positionAt(wordOffset + word.length));
                references.push(new vscode.Location(document.uri, wordRange));
            }
        }
        
        return references;
    }
    
    private async findWorkspaceReferences(word: string): Promise<vscode.Location[]> {
        const references: vscode.Location[] = [];
        
        try {
            // Find all TypeScript files in workspace
            const files = await vscode.workspace.findFiles('**/*.ts', '**/node_modules/**', 100);
            
            for (const file of files) {
                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    
                    // Find references in OlitDOM templates in this file
                    const fileReferences = this.findTemplateReferences(document, word);
                    references.push(...fileReferences);
                    
                } catch (error) {
                    // Skip files that can't be opened
                    continue;
                }
            }
        } catch (error) {
            console.error('Error searching for references:', error);
        }
        
        return references;
    }
    
    private isRelevantSymbol(document: vscode.TextDocument, word: string): boolean {
        // Check if this is a TypeScript symbol that might be used in templates
        const text = document.getText();
        
        const patterns = [
            // Class definitions
            new RegExp(`^\\s*(?:export\\s+)?(?:abstract\\s+)?class\\s+${word}\\b`, 'gm'),
            // Interface definitions  
            new RegExp(`^\\s*(?:export\\s+)?interface\\s+${word}\\b`, 'gm'),
            // Type definitions
            new RegExp(`^\\s*(?:export\\s+)?type\\s+${word}\\b`, 'gm'),
            // Enum definitions
            new RegExp(`^\\s*(?:export\\s+)?enum\\s+${word}\\b`, 'gm'),
            // Function definitions
            new RegExp(`^\\s*(?:export\\s+)?(?:async\\s+)?function\\s+${word}\\b`, 'gm'),
            // Variable/const definitions
            new RegExp(`^\\s*(?:export\\s+)?(?:const|let|var)\\s+${word}\\b`, 'gm'),
        ];
        
        // Also check if it's imported
        const importRegex = new RegExp(`import\\s*\\{[^}]*\\b${word}\\b[^}]*\\}\\s*from`, 'g');
        const defaultImportRegex = new RegExp(`import\\s+${word}\\s+from`, 'g');
        
        // Check if it's used in templates
        const templateRegex = /d\s*`([\s\S]*?)`/g;
        let templateMatch: RegExpExecArray | null;
        let usedInTemplates = false;
        
        while ((templateMatch = templateRegex.exec(text)) !== null) {
            const templateContent = templateMatch[1];
            const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
            if (wordRegex.test(templateContent)) {
                usedInTemplates = true;
                break;
            }
        }
        
        return (patterns.some(regex => regex.test(text)) || 
                importRegex.test(text) || 
                defaultImportRegex.test(text)) && 
                usedInTemplates;
    }
}