import * as vscode from 'vscode';

async function main() {
    const doc = await vscode.workspace.openTextDocument({ language: 'typescript', content: `const t = n` + "`\nName1: _ LIKE 'J%'\n`" });
    const editor = await vscode.window.showTextDocument(doc);

    // Wait a tick for providers to register
    await new Promise(resolve => setTimeout(resolve, 500));

    // Get semantic tokens for the whole document
    const legend = (vscode as any).languages.getLegend ? (vscode.languages as any).getLegend('') : undefined;
    const tokens = await vscode.commands.executeCommand('vscode.provideDocumentSemanticTokens', doc.uri) as any;
    console.log('semantic tokens result:', tokens);

    // Inspect scopes via command
    await vscode.commands.executeCommand('editor.action.inspectTokens');
}

main().catch(err => console.error(err));
