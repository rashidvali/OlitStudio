import * as vscode from 'vscode';
import { n } from './olitcore';
import { q } from './olitql';
import { d } from './olitdom';
import { OlitSemanticProvider, legend } from './semantic/olitSemantic';

export function activate(context: vscode.ExtensionContext) {
    console.log('OLIT extension activated!');

    // Register the Olit semantic tokens provider for TypeScript documents.
    // The provider only emits tokens for content inside tagged templates (n`...`, q`...`, d`...`),
    // so it won't override TypeScript semantic tokens outside those ranges.
    const provider = new OlitSemanticProvider();
    const selector: vscode.DocumentSelector = [
        { language: 'typescript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' }
    ];

    const disposable = vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, legend);
    context.subscriptions.push(disposable);

    return { n, q, d };
}

export function deactivate() {}
