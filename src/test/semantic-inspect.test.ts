import * as assert from 'assert';
import * as vscode from 'vscode';
import { legend } from '../semantic/olitSemantic';

suite('Semantic token inspection', () => {
  test('dump semantic tokens for sample template', async () => {
    const content = "const t = n`\nName1: _ LIKE 'J%'\n`";
    const doc = await vscode.workspace.openTextDocument({ language: 'typescript', content });
    await vscode.window.showTextDocument(doc);

    // allow providers to warm up
    await new Promise((r) => setTimeout(r, 300));

    const res = await vscode.commands.executeCommand('vscode.provideDocumentSemanticTokens', doc.uri) as any;
    console.log('raw semantic tokens:', res);

    if (!res || !res.data) {
      console.log('No semantic tokens returned');
      return;
    }

    const data: number[] = res.data;
    const tokenTypes = legend ? legend.tokenTypes : ['property','string','number','keyword','type','operator','variable'];

    // decode semantic tokens (per vscode spec: [deltaLine, deltaStart, length, tokenType, tokenModifiers])
    let line = 0;
    let char = 0;
    for (let i = 0; i < data.length; i += 5) {
      const deltaLine = data[i];
      const deltaStart = data[i + 1];
      const length = data[i + 2];
      const tokenTypeIndex = data[i + 3];
      const tokenModifiers = data[i + 4];

      if (deltaLine === 0) {
        char = char + deltaStart;
      } else {
        line = line + deltaLine;
        char = deltaStart;
      }

      const tokenType = tokenTypes[tokenTypeIndex] || String(tokenTypeIndex);
      console.log(`token -> line:${line} start:${char} len:${length} type:${tokenType} modifiers:${tokenModifiers}`);
    }
  }).timeout(5000);
});
