import * as vscode from 'vscode';
import { isNumeric, isBool, isDateLike, isString, strEnclosedWith } from '../olit/Lib/Utils';

const tokenTypes = ['property', 'string', 'number', 'keyword', 'type', 'operator'];
const tokenModifiers: string[] = [];

export const legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);

function makeRange(document: vscode.TextDocument, offset: number, length: number) {
  const startPos = document.positionAt(offset);
  return { line: startPos.line, startChar: startPos.character, length };
}

function classifyValue(val: string) {
  if (val == null) return 'string';
  const v = val.trim();
  if (v === '') return 'string';
  if (strEnclosedWith(v, '"')) return 'string';
  if (isNumeric(v)) return 'number';
  if (isBool(v)) return 'keyword';
  if (isDateLike(v)) return 'number';
  return 'string';
}

export class OlitSemanticProvider implements vscode.DocumentSemanticTokensProvider {
  public provideDocumentSemanticTokens(
    document: vscode.TextDocument,
    token: vscode.CancellationToken
  ): vscode.ProviderResult<vscode.SemanticTokens> {
    const builder = new vscode.SemanticTokensBuilder(legend);
    const text = document.getText();

    // Find tagged templates n`...`, q`...`, d`...`
    const re = /(n|q|d)\s*`([\s\S]*?)`/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const fullMatch = m[0];
      const tag = m[1];
      const content = m[2];
      const matchStart = m.index;
      // find the start of the content within the document
      const contentOffset = matchStart + fullMatch.indexOf('`') + 1;

      // process content line by line, using indexOf to preserve exact offsets (handles CRLF vs LF)
      const lines = content.split(/\r\n|\n|\r/);
      let offsetInContent = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        // find the actual position of this line within content starting at offsetInContent
        const idxInContent = content.indexOf(line, offsetInContent);
        if (idxInContent === -1) {
          // fallback to previous approach
          offsetInContent += line.length + 1;
          continue;
        }
        const absoluteOffset = contentOffset + idxInContent;

        // Key-value pair on same line: key: val
        // Use \s for any whitespace and be permissive for key chars (anything except newline or colon)
        const kv = line.match(/^(\s*)([^:\n\r]+?)\s*:\s*(.*)$/);
        if (kv) {
          const leading = kv[1];
          const key = kv[2];
          const val = kv[3];

          // key position
          const keyIndexInLine = line.indexOf(key, leading.length);
          const keyOffset = absoluteOffset + keyIndexInLine;
          const keyRange = makeRange(document, keyOffset, key.length);
          builder.push(keyRange.line, keyRange.startChar, keyRange.length, tokenTypes.indexOf('property'), 0);

          // value position (if present)
          if (val && val.trim().length > 0) {
            const valStart = line.indexOf(val, keyIndexInLine + key.length + 1);
            const valOffset = absoluteOffset + valStart;
            const valLen = val.trim().length;
            const kind = classifyValue(val.trim());
            const valRange = makeRange(document, valOffset, valLen);
            const typeIndex = tokenTypes.indexOf(kind as any);
            if (typeIndex >= 0) builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
          }
        } else {
          // Check for array element lines (may end with ; or be single value)
          const arr = line.match(/^([\t ]*)([^;\n\r]+)\s*;?\s*$/);
          if (arr) {
            const leading = arr[1];
            const txt = arr[2];
            const txtIndex = line.indexOf(txt, leading.length);
            const txtOffset = absoluteOffset + txtIndex;
            const kind = classifyValue(txt.trim());
            const valRange = makeRange(document, txtOffset, txt.trim().length);
            const typeIndex = tokenTypes.indexOf(kind as any);
            if (typeIndex >= 0) builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
          }
        }

        // advance offsetInContent by line length plus actual newline length (if any)
        const afterIdx = idxInContent + line.length;
        let nlLen = 0;
        if (content.charAt(afterIdx) === '\r') {
          nlLen = content.charAt(afterIdx + 1) === '\n' ? 2 : 1;
        } else if (content.charAt(afterIdx) === '\n') {
          nlLen = 1;
        }
        offsetInContent = idxInContent + line.length + nlLen;
      }
    }

    return builder.build();
  }
}
