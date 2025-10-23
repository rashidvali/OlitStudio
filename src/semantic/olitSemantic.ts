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

        // Emit semicolon tokens anywhere in the line (global semicolon highlighting)
        const globalSemicolonRegex = /;/g;
        let globalSemiMatch: RegExpExecArray | null;
        while ((globalSemiMatch = globalSemicolonRegex.exec(line)) !== null) {
          const semiIndexInLine = globalSemiMatch.index;
          const semiOffset = absoluteOffset + semiIndexInLine;
          const semiRange = makeRange(document, semiOffset, 1);
          const keywordIndex = tokenTypes.indexOf('keyword');
          if (keywordIndex >= 0) {
            console.log(`Emitting global semicolon at line:${semiRange.line} char:${semiRange.startChar}`);
            builder.push(semiRange.line, semiRange.startChar, semiRange.length, keywordIndex, 0);
          }
        }

        // Try a robust same-line key:value match first
        const kvMatch = line.match(/^\s*([^:\n\r]+)\s*:\s*([^;\n\r]+)/);
        if (kvMatch) {
          const key = kvMatch[1];
          const val = kvMatch[2];

          const keyIndexInLine = line.indexOf(key);
          const keyOffset = absoluteOffset + keyIndexInLine;
          const keyRange = makeRange(document, keyOffset, key.length);
          builder.push(keyRange.line, keyRange.startChar, keyRange.length, tokenTypes.indexOf('property'), 0);

          // Emit colon separator token
          const colonMatch = line.match(/:/);
          if (colonMatch) {
            const colonIndex = line.indexOf(':', keyIndexInLine + key.length);
            if (colonIndex >= 0) {
              const colonOffset = absoluteOffset + colonIndex;
              const colonRange = makeRange(document, colonOffset, 1);
              const keywordIndex = tokenTypes.indexOf('keyword');
              if (keywordIndex >= 0) {
                builder.push(colonRange.line, colonRange.startChar, colonRange.length, keywordIndex, 0);
              }
            }
          }

          // Emit semantic token for inner value (exclude surrounding quotes)
          const valIndexInLine = line.indexOf(val, keyIndexInLine + key.length);
          const valOffset = absoluteOffset + valIndexInLine;
          const trimmed = val.trim();
          let innerStart = 0;
          let innerLen = trimmed.length;
          if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
            innerStart = 1;
            innerLen = trimmed.length - 2;
          }
          if (innerLen > 0) {
            const content = trimmed.substring(innerStart, innerStart + innerLen);
            
            // Track if we emit specific tokens (operators/underscores)
            let hasSpecificTokens = false;

            // emit operator tokens inside the value
            // Handle word operators (LIKE, IN, etc.) with word boundaries
            const wordOpRegex = /\b(LIKE|IN|BETWEEN|IS|NULL|AND|OR|NOT)\b/gi;
            let wordOpMatch: RegExpExecArray | null;
            while ((wordOpMatch = wordOpRegex.exec(content)) !== null) {
              const op = wordOpMatch[1] || wordOpMatch[0];
              const opIndexInVal = wordOpMatch.index;
              const opOffset = valOffset + val.indexOf(trimmed) + innerStart + opIndexInVal;
              const opRange = makeRange(document, opOffset, op.length);
              const opIndex = tokenTypes.indexOf('operator');
              if (opIndex >= 0) {
                builder.push(opRange.line, opRange.startChar, opRange.length, opIndex, 0);
                hasSpecificTokens = true;
              }
            }

            // Handle symbol operators (=, !=, <>, etc.) without word boundaries
            const symbolOpRegex = /(!=|<>|<=|>=|=|<|>|\+|-)/g;
            let symbolOpMatch: RegExpExecArray | null;
            while ((symbolOpMatch = symbolOpRegex.exec(content)) !== null) {
              const op = symbolOpMatch[1] || symbolOpMatch[0];
              const opIndexInVal = symbolOpMatch.index;
              const opOffset = valOffset + val.indexOf(trimmed) + innerStart + opIndexInVal;
              const opRange = makeRange(document, opOffset, op.length);
              const opIndex = tokenTypes.indexOf('operator');
              if (opIndex >= 0) {
                builder.push(opRange.line, opRange.startChar, opRange.length, opIndex, 0);
                hasSpecificTokens = true;
              }
            }

            // emit underscore tokens inside the value
            const underscoreRegex = /(^|[^A-Za-z0-9_])_(?![A-Za-z0-9_])/g;
            let uMatch: RegExpExecArray | null;
            while ((uMatch = underscoreRegex.exec(content)) !== null) {
              const leftLen = uMatch[1] ? uMatch[1].length : 0;
              const underscoreIndexInVal = uMatch.index + leftLen;
              const underscoreOffset = valOffset + val.indexOf(trimmed) + innerStart + underscoreIndexInVal;
              const underscoreRange = makeRange(document, underscoreOffset, 1);
              const varIndex = tokenTypes.indexOf('variable');
              if (varIndex >= 0) {
                builder.push(underscoreRange.line, underscoreRange.startChar, underscoreRange.length, varIndex, 0);
                hasSpecificTokens = true;
              }
            }

            // emit single quote tokens (always part of string content, not delimiters)
            const singleQuoteRegex = /'/g;
            let sqMatch: RegExpExecArray | null;
            while ((sqMatch = singleQuoteRegex.exec(content)) !== null) {
              const quoteIndexInVal = sqMatch.index;
              const quoteOffset = valOffset + val.indexOf(trimmed) + innerStart + quoteIndexInVal;
              const quoteRange = makeRange(document, quoteOffset, 1);
              const operatorIndex = tokenTypes.indexOf('operator');
              if (operatorIndex >= 0) {
                builder.push(quoteRange.line, quoteRange.startChar, quoteRange.length, operatorIndex, 0);
                hasSpecificTokens = true;
              }
            }

            // emit semicolon and colon tokens in values
            const punctuationRegex = /[;:]/g;
            let punctMatch: RegExpExecArray | null;
            while ((punctMatch = punctuationRegex.exec(content)) !== null) {
              const punctChar = punctMatch[0];
              const punctIndexInVal = punctMatch.index;
              const punctOffset = valOffset + val.indexOf(trimmed) + innerStart + punctIndexInVal;
              const punctRange = makeRange(document, punctOffset, 1);
              const keywordIndex = tokenTypes.indexOf('keyword');
              if (keywordIndex >= 0) {
                console.log(`Emitting punctuation '${punctChar}' at line:${punctRange.line} char:${punctRange.startChar}`);
                builder.push(punctRange.line, punctRange.startChar, punctRange.length, keywordIndex, 0);
                hasSpecificTokens = true;
              }
            }

            // emit double quote tokens only for delimiter quotes (full enclosure)
            if (trimmed.startsWith('"') && trimmed.endsWith('"') && trimmed.length > 1) {
              const quoteOffset = valOffset + val.indexOf(trimmed);
              // Opening quote
              const openQuoteRange = makeRange(document, quoteOffset, 1);
              const keywordIndex = tokenTypes.indexOf('keyword');
              if (keywordIndex >= 0) {
                builder.push(openQuoteRange.line, openQuoteRange.startChar, openQuoteRange.length, keywordIndex, 0);
                hasSpecificTokens = true;
              }
              // Closing quote
              const closeQuoteRange = makeRange(document, quoteOffset + trimmed.length - 1, 1);
              if (keywordIndex >= 0) {
                builder.push(closeQuoteRange.line, closeQuoteRange.startChar, closeQuoteRange.length, keywordIndex, 0);
                hasSpecificTokens = true;
              }
            }

            // Only emit the broad value token if we didn't emit specific tokens
            if (!hasSpecificTokens) {
              const kind = classifyValue(content);
              const valRange = makeRange(document, valOffset + val.indexOf(trimmed) + innerStart, innerLen);
              const typeIndex = tokenTypes.indexOf(kind as any);
              if (typeIndex >= 0) builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
            }
          }
        } else {
          // Check for key-only lines (key: with nothing after colon)
          const keyOnlyMatch = line.match(/^\s*([^:\n\r]+):\s*$/);
          if (keyOnlyMatch) {
            const key = keyOnlyMatch[1];
            const keyIndexInLine = line.indexOf(key);
            const keyOffset = absoluteOffset + keyIndexInLine;
            const keyRange = makeRange(document, keyOffset, key.length);
            builder.push(keyRange.line, keyRange.startChar, keyRange.length, tokenTypes.indexOf('property'), 0);
            
            // Emit colon token for key-only lines
            const colonIndex = line.indexOf(':', keyIndexInLine + key.length);
            if (colonIndex >= 0) {
              const colonOffset = absoluteOffset + colonIndex;
              const colonRange = makeRange(document, colonOffset, 1);
              const keywordIndex = tokenTypes.indexOf('keyword');
              if (keywordIndex >= 0) {
                builder.push(colonRange.line, colonRange.startChar, colonRange.length, keywordIndex, 0);
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

            // Emit operator tokens in array/multiline values
            // Handle word operators (LIKE, IN, etc.) with word boundaries
            const wordOpRegex2 = /\b(LIKE|IN|BETWEEN|IS|NULL|AND|OR|NOT)\b/gi;
            let wordOpMatch2: RegExpExecArray | null;
            while ((wordOpMatch2 = wordOpRegex2.exec(txt)) !== null) {
              const op = wordOpMatch2[1] || wordOpMatch2[0];
              const opIndexInVal = wordOpMatch2.index;
              const opOffset = txtOffset + opIndexInVal;
              const opRange = makeRange(document, opOffset, op.length);
              const opIndex = tokenTypes.indexOf('operator');
              if (opIndex >= 0) builder.push(opRange.line, opRange.startChar, opRange.length, opIndex, 0);
            }

            // Handle symbol operators (=, !=, <>, etc.) without word boundaries
            const symbolOpRegex2 = /(!=|<>|<=|>=|=|<|>|\+|-)/g;
            let symbolOpMatch2: RegExpExecArray | null;
            while ((symbolOpMatch2 = symbolOpRegex2.exec(txt)) !== null) {
              const op = symbolOpMatch2[1] || symbolOpMatch2[0];
              const opIndexInVal = symbolOpMatch2.index;
              const opOffset = txtOffset + opIndexInVal;
              const opRange = makeRange(document, opOffset, op.length);
              const opIndex = tokenTypes.indexOf('operator');
              if (opIndex >= 0) builder.push(opRange.line, opRange.startChar, opRange.length, opIndex, 0);
            }

            // emit single quote tokens (always part of string content, not delimiters)
            const singleQuoteRegex2 = /'/g;
            let sqMatch2: RegExpExecArray | null;
            while ((sqMatch2 = singleQuoteRegex2.exec(txt)) !== null) {
              const quoteIndexInVal = sqMatch2.index;
              const quoteOffset = txtOffset + quoteIndexInVal;
              const quoteRange = makeRange(document, quoteOffset, 1);
              const operatorIndex = tokenTypes.indexOf('operator');
              if (operatorIndex >= 0) builder.push(quoteRange.line, quoteRange.startChar, quoteRange.length, operatorIndex, 0);
            }

            // emit semicolon and colon tokens in array/multiline values
            const punctuationRegex2 = /[;:]/g;
            let punctMatch2: RegExpExecArray | null;
            while ((punctMatch2 = punctuationRegex2.exec(txt)) !== null) {
              const punctChar2 = punctMatch2[0];
              const punctIndexInVal = punctMatch2.index;
              const punctOffset = txtOffset + punctIndexInVal;
              const punctRange = makeRange(document, punctOffset, 1);
              const keywordIndex = tokenTypes.indexOf('keyword');
              if (keywordIndex >= 0) {
                console.log(`Emitting punctuation2 '${punctChar2}' at line:${punctRange.line} char:${punctRange.startChar}`);
                builder.push(punctRange.line, punctRange.startChar, punctRange.length, keywordIndex, 0);
              }
            }

            // Fallback: emit semantic tokens for the content runs (numbers/strings/bools)
            const trimmed = txt.trim();
            const kind = classifyValue(trimmed);
            const valRange = makeRange(document, txtOffset + txt.indexOf(trimmed), trimmed.length);
            const typeIndex = tokenTypes.indexOf(kind as any);
            if (typeIndex >= 0) builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
            }
          }
        }

        offsetInContent += lines[i].length + 1;
      }
    }

    return builder.build();
  }
}
