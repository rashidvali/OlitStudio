import * as vscode from 'vscode';
import { n } from './olitcore';
import { q } from './olitql';
import { d } from './olitdom';
import { OlitSemanticProvider, legend } from './semantic/olitSemantic';
import { OlitDefinitionProvider } from './semantic/olitDefinition';

export function activate(context: vscode.ExtensionContext) {
    console.log('OLIT extension activated!');

    // Register the Olit semantic tokens provider for TypeScript documents.
    // The provider only emits tokens for content inside tagged templates (n`...`, q`...`, d`...`),
    // so it won't override TypeScript semantic tokens outside those ranges.
    const semanticProvider = new OlitSemanticProvider();
    const selector: vscode.DocumentSelector = [
        { language: 'typescript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' }
    ];

    const semanticDisposable = vscode.languages.registerDocumentSemanticTokensProvider(selector, semanticProvider, legend);
    context.subscriptions.push(semanticDisposable);

    // Register the Definition Provider for Go to Definition functionality
    const definitionProvider = new OlitDefinitionProvider();
    const definitionDisposable = vscode.languages.registerDefinitionProvider(selector, definitionProvider);
    context.subscriptions.push(definitionDisposable);

    return { n, q, d };
}

export function deactivate() {}
