import * as vscode from 'vscode';

export class OlitRenameProvider implements vscode.RenameProvider {

    prepareRename(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<{ range: vscode.Range; placeholder: string; } | vscode.Range> {
        console.log('OlitRename: prepareRename called at position:', position);
        
        // Get the word at the position
        const wordRange = document.getWordRangeAtPosition(position, /\b[A-Za-z_$][A-Za-z0-9_$]*\b/);
        if (!wordRange) {
            console.log('OlitRename: no word range at position, rejecting');
            throw new Error('No symbol found at this position');
        }
        
        const word = document.getText(wordRange);
        console.log('OlitRename: preparing to rename word:', word);
        
        // Check if this is a TypeScript symbol that can be renamed (either defined locally or used in templates)
        if (!this.isTypeScriptSymbol(document, word) && !this.isUsedInTemplates(document, word)) {
            console.log('OlitRename: not a TypeScript symbol or used in templates, rejecting');
            throw new Error('This symbol cannot be renamed');
        }
        
        return {
            range: wordRange,
            placeholder: word
        };
    }

    provideRenameEdits(document: vscode.TextDocument, position: vscode.Position, newName: string, token: vscode.CancellationToken): vscode.ProviderResult<vscode.WorkspaceEdit> {
        console.log('OlitRename: provideRenameEdits called:', newName);
        
        // Validate the new name
        if (!this.isValidIdentifier(newName)) {
            throw new Error('Invalid identifier name');
        }
        
        const wordRange = document.getWordRangeAtPosition(position, /\b[A-Za-z_$][A-Za-z0-9_$]*\b/);
        if (!wordRange) {
            return null;
        }
        
        const word = document.getText(wordRange);
        console.log('OlitRename: renaming', word, 'to', newName);
        
        const workspaceEdit = new vscode.WorkspaceEdit();
        
        // Find all occurrences in the current document
        this.findOccurrencesInDocument(document, word, workspaceEdit, newName);
        
        // Find all occurrences in workspace files
        return this.findOccurrencesInWorkspace(word, workspaceEdit, newName).then(() => {
            console.log('OlitRename: returning workspace edit with changes');
            return workspaceEdit;
        });
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

    private isTypeScriptSymbol(document: vscode.TextDocument, word: string): boolean {
        // Check if the word is a TypeScript symbol (class, interface, type, enum, function, variable)
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
        
        return patterns.some(regex => regex.test(text)) || importRegex.test(text) || defaultImportRegex.test(text);
    }

    private isUsedInTemplates(document: vscode.TextDocument, word: string): boolean {
        // Check if the word is used inside any d`` templates
        const text = document.getText();
        const dTemplateRegex = /d\s*`([\s\S]*?)`/g;
        let match: RegExpExecArray | null;
        
        while ((match = dTemplateRegex.exec(text)) !== null) {
            const templateContent = match[1];
            const wordRegex = new RegExp(`\\b${word}\\b`, 'g');
            if (wordRegex.test(templateContent)) {
                return true;
            }
        }
        
        return false;
    }

    private isValidIdentifier(name: string): boolean {
        // TypeScript/JavaScript identifier rules
        return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name);
    }

    private findOccurrencesInDocument(document: vscode.TextDocument, oldName: string, workspaceEdit: vscode.WorkspaceEdit, newName: string): void {
        const text = document.getText();
        
        // Find occurrences in regular TypeScript code
        const patterns = [
            // Class definitions
            new RegExp(`(^\\s*(?:export\\s+)?(?:abstract\\s+)?class\\s+)(${oldName})(\\b)`, 'gm'),
            // Interface definitions
            new RegExp(`(^\\s*(?:export\\s+)?interface\\s+)(${oldName})(\\b)`, 'gm'),
            // Type definitions
            new RegExp(`(^\\s*(?:export\\s+)?type\\s+)(${oldName})(\\b)`, 'gm'),
            // Enum definitions
            new RegExp(`(^\\s*(?:export\\s+)?enum\\s+)(${oldName})(\\b)`, 'gm'),
            // Function definitions
            new RegExp(`(^\\s*(?:export\\s+)?(?:async\\s+)?function\\s+)(${oldName})(\\b)`, 'gm'),
            // Variable/const definitions
            new RegExp(`(^\\s*(?:export\\s+)?(?:const|let|var)\\s+)(${oldName})(\\b)`, 'gm'),
            // Import statements
            new RegExp(`(import\\s*\\{[^}]*\\b)(${oldName})(\\b[^}]*\\}\\s*from)`, 'g'),
            new RegExp(`(import\\s+)(${oldName})(\\s+from)`, 'g'),
        ];
        
        // Find occurrences in d`` templates
        const dTemplateRegex = /d\s*`([\s\S]*?)`/g;
        let templateMatch: RegExpExecArray | null;
        
        while ((templateMatch = dTemplateRegex.exec(text)) !== null) {
            const templateStart = templateMatch.index + templateMatch[0].indexOf('`') + 1;
            const templateContent = templateMatch[1];
            
            // Find word occurrences in template content
            const wordRegex = new RegExp(`\\b${oldName}\\b`, 'g');
            let wordMatch: RegExpExecArray | null;
            
            while ((wordMatch = wordRegex.exec(templateContent)) !== null) {
                const absoluteStart = templateStart + wordMatch.index;
                const absoluteEnd = absoluteStart + oldName.length;
                
                const startPos = document.positionAt(absoluteStart);
                const endPos = document.positionAt(absoluteEnd);
                const range = new vscode.Range(startPos, endPos);
                
                workspaceEdit.replace(document.uri, range, newName);
                console.log(`OlitRename: adding template replacement at ${startPos.line}:${startPos.character}`);
            }
        }
        
        // Find occurrences in regular code
        for (const pattern of patterns) {
            let match: RegExpExecArray | null;
            
            while ((match = pattern.exec(text)) !== null) {
                const wordStart = match.index + match[1].length;
                const wordEnd = wordStart + oldName.length;
                
                const startPos = document.positionAt(wordStart);
                const endPos = document.positionAt(wordEnd);
                const range = new vscode.Range(startPos, endPos);
                
                workspaceEdit.replace(document.uri, range, newName);
                console.log(`OlitRename: adding code replacement at ${startPos.line}:${startPos.character}`);
            }
        }
    }

    private async findOccurrencesInWorkspace(oldName: string, workspaceEdit: vscode.WorkspaceEdit, newName: string): Promise<void> {
        // Search for TypeScript files in workspace
        const files = await vscode.workspace.findFiles('**/*.ts', '**/node_modules/**');
        
        for (const fileUri of files) {
            try {
                const document = await vscode.workspace.openTextDocument(fileUri);
                
                // Skip the current document (already processed)
                if (document === vscode.window.activeTextEditor?.document) {
                    continue;
                }
                
                // Find occurrences in this file
                this.findOccurrencesInDocument(document, oldName, workspaceEdit, newName);
                
            } catch (error) {
                // Skip files that can't be opened
                console.log('OlitRename: failed to open file:', fileUri.toString());
                continue;
            }
        }
    }
}