import * as vscode from 'vscode';
export declare const legend: vscode.SemanticTokensLegend;
export declare class OlitSemanticProvider implements vscode.DocumentSemanticTokensProvider {
    provideDocumentSemanticTokens(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.SemanticTokens>;
}
