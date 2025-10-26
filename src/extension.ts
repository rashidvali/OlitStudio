import * as vscode from 'vscode';
import { n } from './olitcore';
import { q } from './olitql';
import { d } from './olitdom';
import { OlitSemanticProvider, legend } from './semantic/olitSemantic';
import { OlitDefinitionProvider } from './semantic/olitDefinition';
import { OlitRenameProvider } from './semantic/olitRename';
import { OlitReferenceProvider } from './semantic/olitReference';

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

    // Register the Rename Provider for renaming symbols
    const renameProvider = new OlitRenameProvider();
    const renameDisposable = vscode.languages.registerRenameProvider(selector, renameProvider);
    context.subscriptions.push(renameDisposable);

    // Register the Reference Provider for finding all references
    const referenceProvider = new OlitReferenceProvider();
    const referenceDisposable = vscode.languages.registerReferenceProvider(selector, referenceProvider);
    context.subscriptions.push(referenceDisposable);

    return { n, q, d };
}

export function deactivate() {}
