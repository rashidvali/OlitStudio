/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(__webpack_require__(1));
const olitcore_1 = __webpack_require__(2);
const olitql_1 = __webpack_require__(7);
const olitdom_1 = __webpack_require__(8);
const olitSemantic_1 = __webpack_require__(9);
function activate(context) {
    console.log('OLIT extension activated!');
    // Register the Olit semantic tokens provider for TypeScript documents.
    // The provider only emits tokens for content inside tagged templates (n`...`, q`...`, d`...`),
    // so it won't override TypeScript semantic tokens outside those ranges.
    const provider = new olitSemantic_1.OlitSemanticProvider();
    const selector = [
        { language: 'typescript', scheme: 'file' },
        { language: 'typescriptreact', scheme: 'file' }
    ];
    const disposable = vscode.languages.registerDocumentSemanticTokensProvider(selector, provider, olitSemantic_1.legend);
    context.subscriptions.push(disposable);
    return { n: olitcore_1.n, q: olitql_1.q, d: olitdom_1.d };
}
function deactivate() { }


/***/ }),
/* 1 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.n = exports.olitNota = void 0;
exports.parseOlit = parseOlit;
exports.stringifyOlit = stringifyOlit;
const OlitNota_1 = __webpack_require__(3);
exports.olitNota = new OlitNota_1.OlitNota();
function parseOlit(olitText) {
    return exports.olitNota.olitToJson(olitText);
}
function stringifyOlit(json) {
    return exports.olitNota.jsonToOlit(json);
}
// Tagged template function for `n```
const n = (strings, ...values) => {
    const raw = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
    return parseOlit(raw);
};
exports.n = n;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OlitNota = exports.StringValue = void 0;
const Utils_1 = __webpack_require__(4);
const StringHolder_1 = __webpack_require__(6);
var StringValue;
(function (StringValue) {
    StringValue[StringValue["Unquoted"] = 0] = "Unquoted";
    StringValue[StringValue["DoubleQuoted"] = 1] = "DoubleQuoted";
})(StringValue || (exports.StringValue = StringValue = {}));
// export enum EntryType {
// 	Value,	// a value part of key-value pair
// 	Element	// an element of array
// }
class OlitNota {
    stringOption = StringValue.Unquoted; // StringValue.DoubleQuoted; // 
    olitToJson(olit) {
        if ((0, Utils_1.stringEmpty)(olit)) {
            return {};
        }
        olit = (0, Utils_1.normalizeNewlines)(olit);
        // trim leading spaces only, not \n or \t
        olit = olit.replace(/^[ ]+/, "");
        const leadMatch = olit.indexOf("\n") == 0 ? olit.substring(1) : olit;
        const leadingTabsMatch = leadMatch.match(/^(\t+)/);
        const tabCount = leadingTabsMatch ? leadingTabsMatch[1].length : 0;
        const obj = this.parseOlit(olit, tabCount);
        return obj;
    }
    parseOlit(input, intent) {
        if (input == null) {
            return '';
        }
        let value = input.trim();
        if ((0, Utils_1.isNumeric)(value)) {
            return Number(value);
        }
        if ((0, Utils_1.isBool)(value)) {
            return (0, Utils_1.Bool)(value);
        }
        if ((0, Utils_1.isDateLike)(value)) {
            let dt = value;
            return new Date(dt);
        }
        let text = input;
        // if it does not have colons : and semicolons ; then it's a text
        if (!(0, Utils_1.hasUnescapedColon)(text) && !(0, Utils_1.hasUnescapedSemicolon)(text)) {
            if ((0, Utils_1.strEnclosedWith)(value, '"') && value.length > 2) {
                value = value.replace(/::/g, ":").replace(/;;/g, ";");
                value = value.slice(1, value.length - 1);
                value = this.eliminateOlitIntent(value, intent);
                return value;
            }
            text = text.replace(/::/g, ":").replace(/;;/g, ";");
            text = text.trimEnd();
            text = this.eliminateOlitIntent(text, intent);
            // Unescaping colons and semicolons (removing dublicates)
            if ((0, Utils_1.isSingleRowString)(text)) {
                return text.trim();
            }
            return text;
        }
        // trim leading spaces only, not \n or \t
        text = text.replace(/^[ ]+/, "");
        const tabPrefix = '\t'.repeat(intent);
        const splitter = "\n" + tabPrefix;
        const arrDlm = splitter + ";";
        // Check for an array delimiter presence
        if ((0, Utils_1.isOlitList)(text)) // ARRAY
         { //It's an array
            // Split
            if (text.endsWith(splitter + ";")) {
                text += "\n";
            }
            const parts = text.split(arrDlm + "\n");
            const arr = new Array();
            for (let p of parts) {
                if ((0, Utils_1.stringNotEmpty)(p)) {
                    let tabCount;
                    if ((0, Utils_1.isOlitList)(p)) { // if an element is an array
                        tabCount = intent + 1;
                    }
                    else {
                        tabCount = intent;
                    }
                    const val = this.parseOlit(p, tabCount);
                    arr.push(val);
                }
            }
            return arr;
        }
        else // OBJECT
         { // It's a JSON object
            const spoiler = "\n" + tabPrefix + "\t";
            const replacer = "\n<*10>" + tabPrefix + "\t";
            // Protect any literal <*10> tokens
            text = text.replace(/<\*10>/g, '<<*10*10>>');
            const marked = (0, Utils_1.replaceAll)(text, spoiler, replacer);
            const parts = marked.trim().split(splitter);
            const obj = {};
            for (let e of parts) {
                let trimmed = (0, Utils_1.replaceAll)(e, replacer, spoiler).trim();
                // Restore literal <*10> tokens
                trimmed = trimmed.replace(/<<\*10\*10>>/g, '<*10>');
                while (trimmed.indexOf(" \n") > -1) {
                    trimmed = (0, Utils_1.replaceAll)(trimmed, " \n", "\n");
                }
                const p = (0, Utils_1.splitByFirstColon)(trimmed);
                let val = p[1];
                const isArray = (0, Utils_1.isOlitList)(val, intent + 1);
                if (isArray) { // Normilize an array element's starting
                    val = '\t'.repeat(intent + 1) + val.trimStart();
                }
                const value = this.parseOlit(val, intent + 1);
                obj[p[0]] = value;
            }
            return obj;
        }
    }
    eliminateOlitIntent(value, intent) {
        if (intent != null) {
            // because the value is indetivied as text (multiline) string
            // and has a key, the intent is related to the key - an intent 
            // for a key is "key intent + 1"
            if ((0, Utils_1.isSingleRowString)(value)) {
                value = value.trimStart();
            }
            else {
                const nl = value.indexOf("\n");
                if (nl > 0) {
                    const lead = value.substring(0, nl);
                    if (lead.trim() == "") {
                        value = value.substring(nl);
                    }
                    else {
                        if (value.startsWith(" ")) {
                            value = value.substring(1);
                        }
                    }
                }
            }
            const tabs = "\t".repeat(intent);
            const offset = "\n" + tabs;
            value = (0, Utils_1.replaceAll)(value, offset, "\n");
        }
        return value;
    }
    eliminateOlitLead(value, intent) {
        if (intent != null) {
            // because the value is indetivied as text (multiline) string
            // and has a key, the intent is related to the key - an intent 
            // for a key is "key intent + 1"
            const offset = "\n" + "\t".repeat(intent);
            value = (0, Utils_1.replaceAll)(value, offset, "");
            return value;
        }
        else {
            return value;
        }
    }
    jsonToOlit(obj) {
        return this.parseJson(obj);
    }
    parseJson(input, intent = 0) {
        if (input == null) {
            return "";
        }
        if ((0, Utils_1.isString)(input)) {
            let value = input;
            value = (0, Utils_1.replaceAll)(value, ":", "::");
            value = (0, Utils_1.replaceAll)(value, ";", ";;");
            const resStr = this.parseJsonString(value, intent);
            return resStr;
        }
        if ((0, Utils_1.isPrimitive)(input)) {
            return input;
        }
        if ((0, Utils_1.isJsonObject)(input)) {
            const strBldr = new StringHolder_1.StringHolder();
            let nL = "";
            for (const [key, val] of Object.entries(input)) {
                strBldr.append(nL);
                if (nL == "") {
                    nL = "\n";
                }
                strBldr.append("\t".repeat(intent));
                strBldr.append(key);
                strBldr.append(":");
                let value;
                if ((0, Utils_1.isString)(val)) {
                    const str = this.parseJsonString(val, intent);
                    if ((0, Utils_1.isSingleRowString)(val)) {
                        value = " " + str.trim();
                    }
                    else {
                        value = str;
                    }
                    // value = replaceAll(value, ":", "::");
                    // value = replaceAll(value, ";", ";;");
                }
                else if ((0, Utils_1.isPrimitive)(val)) {
                    const str = "" + val;
                    value = " " + str.trim();
                }
                else if ((0, Utils_1.isJsonObject)(val)) {
                    value = "\n" + this.parseJson(val, intent + 1);
                }
                else if ((0, Utils_1.isArray)(val)) {
                    value = "\n" + this.parseJson(val, intent + 1);
                }
                strBldr.append(value);
            }
            return strBldr.toString();
        }
        if ((0, Utils_1.isArray)(input)) {
            const strBldr = new StringHolder_1.StringHolder();
            const arr = input;
            let nL = "";
            for (const elm of arr) {
                strBldr.append(nL);
                if ((0, Utils_1.isPrimitive)(elm)) {
                    strBldr.append("\t".repeat(intent) + elm);
                }
                else if ((0, Utils_1.isSingleRowString)(elm)) {
                    let value = (0, Utils_1.replaceAll)(elm, ":", "::");
                    value = (0, Utils_1.replaceAll)(value, ";", ";;");
                    strBldr.append("\t".repeat(intent) + value);
                }
                else if ((0, Utils_1.isString)(elm)) {
                    let value = (0, Utils_1.replaceAll)(elm, ":", "::");
                    value = (0, Utils_1.replaceAll)(value, ";", ";;");
                    const val = value.indexOf("\n") > -1
                        ? (0, Utils_1.replaceAll)(value, "\n", "\n" + "\t".repeat(intent))
                        : " " + value;
                    strBldr.append(val);
                }
                else {
                    const tabCount = (0, Utils_1.isArray)(elm) ? intent + 1 : intent;
                    const entry = this.parseJson(elm, tabCount);
                    strBldr.append(entry);
                }
                strBldr.append("\n").append("\t".repeat(intent));
                strBldr.append(";");
                if (nL == "") {
                    nL = "\n";
                }
            }
            return strBldr.toString();
        }
        return "";
    }
    parseJsonString(value, intent = null) {
        if (value.trim() == "") {
            return "";
        }
        value = (0, Utils_1.normalizeNewlines)(value);
        let resStr;
        if (this.stringOption == StringValue.Unquoted) {
            resStr = (0, Utils_1.escapeColonSemicolon)(value);
            resStr = " " + this.setIntentationOffset(resStr, intent);
            return resStr;
        }
        if (this.stringOption == StringValue.DoubleQuoted) {
            resStr = (0, Utils_1.escapeDoubleQuotes)(value);
            resStr = this.setIntentationOffset(resStr, intent);
            resStr = '"' + resStr + '"';
            return resStr;
        }
        return "";
    }
    setIntentationOffset(text, intent) {
        let resStr;
        if (intent != null) {
            resStr = (0, Utils_1.replaceAll)(text, "\n", "\n" + "\t".repeat(intent + 1));
        }
        else {
            resStr = text;
        }
        return resStr;
    }
}
exports.OlitNota = OlitNota;


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isNumeric = isNumeric;
exports.isNumber = isNumber;
exports.isDate = isDate;
exports.isDateLike = isDateLike;
exports.isBoolean = isBoolean;
exports.isBool = isBool;
exports.Bool = Bool;
exports.isBigInt = isBigInt;
exports.isString = isString;
exports.stringNotEmpty = stringNotEmpty;
exports.stringEmpty = stringEmpty;
exports.strStartsWith = strStartsWith;
exports.strEndsWith = strEndsWith;
exports.strEnclosedWith = strEnclosedWith;
exports.leadingTabs = leadingTabs;
exports.repeatStr = repeatStr;
exports.hasUnescapedDoubleQuote = hasUnescapedDoubleQuote;
exports.hasUnescapedColon = hasUnescapedColon;
exports.hasUnescapedSemicolon = hasUnescapedSemicolon;
exports.isSingleRowString = isSingleRowString;
exports.hasLeadingEmptyRow = hasLeadingEmptyRow;
exports.removeLeadingEmptyRows = removeLeadingEmptyRows;
exports.replaceAll = replaceAll;
exports.normalizeNewlines = normalizeNewlines;
exports.escapeDoubleQuotes = escapeDoubleQuotes;
exports.escapeColonSemicolon = escapeColonSemicolon;
exports.isArray = isArray;
exports.isJsonObject = isJsonObject;
exports.isPrimitive = isPrimitive;
exports.restoreEscapedNewlinesTabs = restoreEscapedNewlinesTabs;
exports.splitByFirstColon = splitByFirstColon;
exports.findFirstColon = findFirstColon;
exports.isOlitList = isOlitList;
const DateTime_1 = __webpack_require__(5);
const StringHolder_1 = __webpack_require__(6);
// export function isNumber(value: any): boolean {
//   return !isNaN(value);
// }
function isNumeric(value) {
    if (value == null) {
        return false;
    }
    if (value == "0" || value == 0 || value == "-1" || value == -1 || isNumber(value)) {
        return true;
    }
    if (isString(value)) {
        return /^[+-]?\d+(\.\d+)?$/.test(value.trim());
    }
    return false;
}
function isNumber(num) {
    if (num == null) {
        return false;
    }
    if (num === 0 || num === -1) {
        return true;
    }
    if (!num) {
        return false;
    }
    try {
        if (isNaN(num)) {
            return false;
        }
    }
    catch (e) {
        return false;
    }
    // return true;
    return typeof num === 'number';
}
function isDate(value) {
    return value instanceof Date;
}
function isValidDate(value) {
    return value instanceof Date && !isNaN(value.getTime());
}
function isParsableDate(value) {
    return typeof value === "string" && (0, DateTime_1.isCrossPlatformDate)(value);
}
function isDateLike(value) {
    return isValidDate(value) || isParsableDate(value);
}
function isBoolean(value) {
    return typeof value === "boolean";
}
function isBool(value) {
    return (value === "true" || value === "false" || value === true || value === false);
}
function Bool(value) {
    return (value === "true" || value === true);
}
function isBigInt(value) {
    return typeof value === "bigint";
}
function isString(value) {
    return typeof value === "string";
}
function stringNotEmpty(value) {
    return typeof value === "string" && value.trim().length > 0;
}
function stringEmpty(text) {
    return text.trim() == "";
}
function strStartsWith(str, prefix) {
    return (
    // stringNotEmpty(str) &&
    str.length >= prefix.length &&
        str.slice(0, prefix.length) === prefix);
}
function strEndsWith(str, suffix) {
    return (stringNotEmpty(str) &&
        stringNotEmpty(suffix) &&
        str.length >= suffix.length &&
        str.slice(-suffix.length) === suffix);
}
function strEnclosedWith(str, trm) {
    return strStartsWith(str, trm) && strEndsWith(str, trm);
}
function leadingTabs(input) {
    const match = input.match(/^\t+/);
    return match ? match[0].length : 0;
}
function repeatStr(text, times) {
    let acc = new StringHolder_1.StringHolder();
    for (let i = 0; i < times; i++) {
        acc.append(text);
    }
    return acc.toString();
}
function hasUnescapedDoubleQuote(input) {
    return /(?<!\\)(?:\\\\)*"/.test(input);
}
function hasUnescapedColon(input) {
    let str = input.replace(/::/g, "");
    return str.indexOf(":") > -1;
}
function hasUnescapedSemicolon(input) {
    let str = input.replace(/;;/g, "");
    return str.indexOf(";") > -1;
}
function isSingleRowString(input) {
    if (!isString(input)) {
        return false;
    }
    const str = input;
    // Check for actual newline characters (\n) in the string
    const unescapedNewlineRegex = /\n/;
    return !unescapedNewlineRegex.test(str);
}
function hasLeadingEmptyRow(input) {
    return /^\s*\r?\n/.test(input);
}
function removeLeadingEmptyRows(input) {
    return input.replace(/^(\s*\r?\n)+/, "");
}
function replaceAll(str, search, replacement) {
    return str.split(search).join(replacement);
}
function normalizeNewlines(input, newline = "\n") {
    return input
        .replace(/\r\n|\n\r|\r|\n/g, "\n") // Normalize all to \n
        .replace(/\n/g, newline); // Convert to desired format
}
function escapeDoubleQuotes(str) {
    return str.replace(/"/g, '\\"');
}
function escapeColonSemicolon(str) {
    return str.replace(/[:;]/g, match => {
        const escapeMap = {
            ':': '::',
            ';': ';;',
        };
        return escapeMap[match];
    });
}
function isArray(value) {
    return Array.isArray(value);
}
function isJsonObject(value) {
    return typeof value === "object" &&
        value !== null &&
        !Array.isArray(value);
}
function isPrimitive(input) {
    // // return isNumber(input) || isDate(input) || isBoolean(input);
    // const tmp1 = isNaN(input);
    // const tmp2 = isNumber(input);
    // // const tmp3 = isNum(input);
    // const tmp4 = isNumber(input) || isDate(input) || isBoolean(input);
    return isNumber(input) || isDate(input) || isBoolean(input);
}
function restoreEscapedNewlinesTabs(input) {
    // Step 1: Protect any literal <*> tokens
    input = input.replace(/<\*0>/g, '<<*0*0>>');
    // Step 2: Replace all backslash sequences with <*>
    input = input.replace(/\\\\/g, '<*0>');
    // Step 3: Decode real escape characters
    input = input.replace(/\\n/g, '\n').replace(/\\t/g, '\t');
    // Step 4: Restore backslashes
    input = input.replace(/<\*0>/g, '\\');
    // Step 5: Restore literal <*> tokens
    return input.replace(/<<\*0\*0>>/g, '<*0>');
}
function splitByFirstColon(input) {
    const index = findFirstColon(input);
    if (index === -1) {
        // No colon found — return the whole string as first part, second part empty
        return [input, ''];
    }
    const key = input.slice(0, index).trim();
    const value = input.slice(index + 1);
    return [key, value];
}
function findFirstColon(input) {
    if (input.length == 0) {
        return -1;
    }
    let index = -1;
    let from = 0;
    while (from < input.length) {
        index = input.indexOf(':', from);
        if (index == -1) {
            return -1;
        }
        if (index == input.length - 1) {
            return index;
        }
        from = index + 1;
        if (input.charAt(from) == ":") {
            while (input.charAt(from) == ":") {
                if (from + 1 == input.length) {
                    return -1;
                }
                if (input.charAt(from + 1) == ":") {
                    from += 2;
                }
                else {
                    from++;
                    break;
                }
            }
        }
        else {
            return index;
        }
    }
    return -1;
}
function isOlitList(entry, intent = null) {
    if (entry.length == 0) {
        return false;
    }
    let tabCount;
    if (intent == null) {
        const leadMatch = entry.indexOf("\n") == 0 ? entry.substring(1) : entry;
        const leadingTabsMatch = leadMatch.match(/^(\t+)/);
        tabCount = leadingTabsMatch ? leadingTabsMatch[1].length : 0;
    }
    else {
        tabCount = intent;
    }
    const splitter = "\n" + '\t'.repeat(tabCount) + ";";
    const index = entry.indexOf(splitter);
    if (index == -1) {
        return false;
    }
    let pos = index + splitter.length;
    if (entry.length == pos) {
        return true;
    }
    while (pos < entry.length) {
        let char = entry.charAt(pos);
        if (char == " ") {
            continue;
        }
        else if (char == "\n") {
            return true;
        }
        else {
            return false;
        }
    }
    return true;
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, exports) => {


/*
Supports the following formats

Date/Time formats
    
ISO 8601–style formats
^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[\+\-]\d{2}:\d{2})?)?$
    
    Date/Time
    YYYY-MM-DD
    YYYY-MM-DDTHH:MM
    YYYY-MM-DDTHH:MM:SS
    YYYY-MM-DDTHH:MM:SS.sss
    
SQL–style formats
^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d{3})?)?$
    
    YYYY-MM-DD HH:MM
    YYYY-MM-DD HH:MM:SS
    YYYY-MM-DD HH:MM:SS.sss
    

*/
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isCrossPlatformDate = isCrossPlatformDate;
/*
The following is not working properly:

    With timezone:
    YYYY-MM-DDTHH:MMZ
    YYYY-MM-DDTHH:MM±HH:MM
    YYYY-MM-DDTHH:MM:SSZ
    YYYY-MM-DDTHH:MM:SS±HH:MM
    YYYY-MM-DDTHH:MM:SS.sssZ
    YYYY-MM-DDTHH:MM:SS.sss±HH:MM
    
Examples:
    2025-08-11T14:30Z
    2025-08-11T14:30+02:00
    2025-08-11T14:30:45.123-05:00
*/
function isCrossPlatformDate(str) {
    const isoRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}(:\d{2}(\.\d{3})?)?(Z|[\+\-]\d{2}:\d{2})?)?$/;
    const sqlRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2}(\.\d{3})?)?$/;
    if (!isoRegex.test(str) && !sqlRegex.test(str))
        return false;
    const jsDate = new Date(str.replace(" ", "T")); // Normalize SQL format to ISO
    return !isNaN(jsDate.getTime());
}


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StringHolder = void 0;
const Utils_1 = __webpack_require__(4);
class StringHolder {
    buff = new Array();
    constructor(text = "") {
        if ((0, Utils_1.stringNotEmpty)(text)) {
            this.append(text);
        }
    }
    reset() {
        this.buff = new Array();
    }
    append(value) {
        this.buff.push(String(value));
        return this;
    }
    toString() {
        return this.buff.join("");
    }
    flush() {
        let res = this.toString();
        this.reset();
        return res;
    }
    last() {
        return !!this.buff && this.buff.length > 0 ? this.buff[this.buff.length - 1] : "";
    }
    indexOf(text, fromIndex = 0) {
        return this.buff.indexOf(text, fromIndex);
    }
    size() {
        return this.buff.length;
    }
}
exports.StringHolder = StringHolder;


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.q = void 0;
exports.parseOlitQl = parseOlitQl;
const OlitNota_1 = __webpack_require__(3);
const olitNota = new OlitNota_1.OlitNota();
function parseOlitQl(olitql) {
    return olitNota.olitToJson(olitql); // still uses core parser for now
}
const q = (strings, ...values) => {
    const raw = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
    return parseOlitQl(raw);
};
exports.q = q;


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.d = void 0;
// Placeholder for OlitDOM
const d = (strings, ...values) => {
    console.warn("OlitDOM 'd' function is not yet implemented.");
    return {};
};
exports.d = d;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OlitSemanticProvider = exports.legend = void 0;
const vscode = __importStar(__webpack_require__(1));
const Utils_1 = __webpack_require__(4);
const tokenTypes = ['property', 'string', 'number', 'keyword', 'type', 'operator'];
const tokenModifiers = [];
exports.legend = new vscode.SemanticTokensLegend(tokenTypes, tokenModifiers);
function makeRange(document, offset, length) {
    const startPos = document.positionAt(offset);
    return { line: startPos.line, startChar: startPos.character, length };
}
function classifyValue(val) {
    if (val == null)
        return 'string';
    const v = val.trim();
    if (v === '')
        return 'string';
    if ((0, Utils_1.strEnclosedWith)(v, '"'))
        return 'string';
    if ((0, Utils_1.isNumeric)(v))
        return 'number';
    if ((0, Utils_1.isBool)(v))
        return 'keyword';
    if ((0, Utils_1.isDateLike)(v))
        return 'number';
    return 'string';
}
class OlitSemanticProvider {
    provideDocumentSemanticTokens(document, token) {
        const builder = new vscode.SemanticTokensBuilder(exports.legend);
        const text = document.getText();
        // Find tagged templates n`...`, q`...`, d`...`
        const re = /(n|q|d)\s*`([\s\S]*?)`/g;
        let m;
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
                        const typeIndex = tokenTypes.indexOf(kind);
                        if (typeIndex >= 0)
                            builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
                    }
                }
                else {
                    // Check for array element lines (may end with ; or be single value)
                    const arr = line.match(/^([\t ]*)([^;\n\r]+)\s*;?\s*$/);
                    if (arr) {
                        const leading = arr[1];
                        const txt = arr[2];
                        const txtIndex = line.indexOf(txt, leading.length);
                        const txtOffset = absoluteOffset + txtIndex;
                        const kind = classifyValue(txt.trim());
                        const valRange = makeRange(document, txtOffset, txt.trim().length);
                        const typeIndex = tokenTypes.indexOf(kind);
                        if (typeIndex >= 0)
                            builder.push(valRange.line, valRange.startChar, valRange.length, typeIndex, 0);
                    }
                }
                // advance offsetInContent by line length plus actual newline length (if any)
                const afterIdx = idxInContent + line.length;
                let nlLen = 0;
                if (content.charAt(afterIdx) === '\r') {
                    nlLen = content.charAt(afterIdx + 1) === '\n' ? 2 : 1;
                }
                else if (content.charAt(afterIdx) === '\n') {
                    nlLen = 1;
                }
                offsetInContent = idxInContent + line.length + nlLen;
            }
        }
        return builder.build();
    }
}
exports.OlitSemanticProvider = OlitSemanticProvider;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(0);
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map