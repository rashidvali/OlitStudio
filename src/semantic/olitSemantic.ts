import * as vscode from 'vscode';
import { isNumeric, isBool, isDateLike, strEnclosedWith } from '../olit/Lib/Utils';

const tokenTypes = ['property', 'string', 'number', 'keyword', 'type', 'operator', 'variable'];
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
  if (strEnclosedWith(v, '"') || strEnclosedWith(v, "'")) return 'string';
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
      const content = m[2];
      const matchStart = m.index;
      const contentOffset = matchStart + fullMatch.indexOf('`') + 1;

      const lines = content.split(/\n/);
      let offsetInContent = 0;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const absoluteOffset = contentOffset + offsetInContent;

        // key: value
        const kv = line.match(/^([\t ]*)([^:\t\n][^:]*?)\s*:\s*(.*)$/);
        if (kv) {
          const leading = kv[1];
          const key = kv[2];
          const val = kv[3];

          const keyIndexInLine = line.indexOf(key, leading.length);
          const keyOffset = absoluteOffset + keyIndexInLine;
          const keyRange = makeRange(document, keyOffset, key.length);
          builder.push(keyRange.line, keyRange.startChar, keyRange.length, tokenTypes.indexOf('property'), 0);

          // For same-line key:value pairs we emit a semantic token for the value
          // (string/number/keyword) so it colors correctly even if the TextMate
          // injection isn't applied in the editor. This is limited to content
          // inside tagged templates so it doesn't override TypeScript tokens.
          if (val && val.trim().length > 0) {
            const valStart = line.indexOf(val, keyIndexInLine + key.length + 1);
            const valOffset = absoluteOffset + valStart;
            const trimmed = val.trim();

            // Do not include surrounding quotes in the emitted range so punctuation
            // remains colored by TextMate where possible.
            let innerStart = 0;
            let innerLen = trimmed.length;
            if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
              innerStart = 1;
              innerLen = trimmed.length - 2;
            }

            if (innerLen > 0) {
              const kind = classifyValue(trimmed.substring(innerStart, innerStart + innerLen));
              const valRange = makeRange(document, valOffset + val.indexOf(trimmed) + innerStart, innerLen);
              const typeIndex = tokenTypes.indexOf(kind as any);
              if (typeIndex >= 0) builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
            }
          }
        } else {
          // array-like or standalone values
          const arr = line.match(/^([\t ]*)([^;\n\r]+)\s*;?\s*$/);
          if (arr) {
            const leading = arr[1];
            const txt = arr[2];
            const txtIndex = line.indexOf(txt, leading.length);
            const txtOffset = absoluteOffset + txtIndex;

            // Emit variable tokens for standalone underscores
            const underscoreRegex = /(^|[^A-Za-z0-9_])_(?![A-Za-z0-9_])/g;
            let uMatch: RegExpExecArray | null;
            while ((uMatch = underscoreRegex.exec(txt)) !== null) {
              const leftLen = uMatch[1] ? uMatch[1].length : 0;
              const underscoreIndexInVal = uMatch.index + leftLen;
              const underscoreOffset = txtOffset + underscoreIndexInVal;
              const underscoreRange = makeRange(document, underscoreOffset, 1);
              const varIndex = tokenTypes.indexOf('variable');
              if (varIndex >= 0) builder.push(underscoreRange.line, underscoreRange.startChar, underscoreRange.length, varIndex, 0);
            }

            // Emit operator tokens (LIKE, IN, =, etc.)
            const opRegex = /\b(LIKE|IN|=|!=|<>|<=|>=|<|>|BETWEEN|IS|NULL|AND|OR|NOT)\b/gi;
            let opMatch: RegExpExecArray | null;
            while ((opMatch = opRegex.exec(txt)) !== null) {
              const op = opMatch[1] || opMatch[0];
              const opIndexInVal = opMatch.index;
              const opOffset = txtOffset + opIndexInVal;
              const opRange = makeRange(document, opOffset, op.length);
              const opIndex = tokenTypes.indexOf('operator');
              if (opIndex >= 0) builder.push(opRange.line, opRange.startChar, opRange.length, opIndex, 0);
            }

            // Fallback: emit semantic tokens for the content runs (numbers/strings/bools)
            const trimmed = txt.trim();
            const kind = classifyValue(trimmed);
            const valRange = makeRange(document, txtOffset + txt.indexOf(trimmed), trimmed.length);
            const typeIndex = tokenTypes.indexOf(kind as any);
            if (typeIndex >= 0) builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
          }
        }

        offsetInContent += lines[i].length + 1;
      }
    }

    return builder.build();
  }
}
