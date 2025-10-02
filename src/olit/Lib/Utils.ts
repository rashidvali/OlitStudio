import { isCrossPlatformDate } from "./DateTime";
import { StringHolder } from "./StringHolder";

// export function isNumber(value: any): boolean {
//   return !isNaN(value);
// }

export function isNumeric(value: any): boolean 
{
	if(value == null){
		return false;
	}

	if(value == "0" || value == 0 || value == "-1" || value == -1 || isNumber(value)){
		return true;
	}

	if(isString(value)){
		return /^[+-]?\d+(\.\d+)?$/.test(value.trim());
	}

	return false;
}

export function isNumber(num: any): boolean 
{
	if(num == null){
		return false;
	}

	if (num === 0 || num === -1) {
		return true;
	}

	if (!num) {
		return false;
	}

	try{
		if (isNaN(num)) {
			return false;
		}
	}
	catch(e){
		return false;
	}

	// return true;
	return typeof num === 'number';
}

export function isDate(value: any): boolean {
  return value instanceof Date;
}

function isValidDate(value: any): boolean {
  return value instanceof Date && !isNaN(value.getTime());
}

function isParsableDate(value: any): boolean {
  return typeof value === "string" && isCrossPlatformDate(<string> value);
}


export function isDateLike(value: any): value is Date | string {
  return isValidDate(value) || isParsableDate(value);
}

export function isBoolean(value: any): value is boolean {
  return typeof value === "boolean";
}

export function isBool(value: any): value is boolean {
  return (
    value === "true" || value === "false" || value === true || value === false
  );
}

export function Bool(value: any): value is boolean {
  return (
    value === "true" || value === true 
  );
}

export function isBigInt(value: any): value is bigint {
  return typeof value === "bigint";
}

export function isString(value: any): boolean {
  return typeof value === "string";
}

export function stringNotEmpty(value: any): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

export function stringEmpty(text: string): boolean{
	return text.trim() == "";
}

export function strStartsWith(str: string, prefix: string): boolean {
  return (
    // stringNotEmpty(str) &&
    str.length >= prefix.length &&
    str.slice(0, prefix.length) === prefix
  );
}

export function strEndsWith(str: string, suffix: string): boolean {
  return (
    stringNotEmpty(str) &&
    stringNotEmpty(suffix) &&
    str.length >= suffix.length &&
    str.slice(-suffix.length) === suffix
  );
}

export function strEnclosedWith(str: string, trm: string): boolean {
  return strStartsWith(str, trm) && strEndsWith(str, trm);
}

export function leadingTabs(input: string): number {
  const match = input.match(/^\t+/);
  return match ? match[0].length : 0;
}

export function repeatStr(text: string, times: number): string {
  let acc = new StringHolder();
  for (let i = 0; i < times; i++) {
    acc.append(text);
  }

  return acc.toString();
}

export function hasUnescapedDoubleQuote(input: string): boolean {
  return /(?<!\\)(?:\\\\)*"/.test(input);
}

export function hasUnescapedColon(input: string): boolean 
{
	let str = input.replace(/::/g, "");
	return str.indexOf(":") > -1;
}

export function hasUnescapedSemicolon(input: string): boolean {
	let str = input.replace(/;;/g, "");
	return str.indexOf(";") > -1;
}


export function isSingleRowString(input: any): boolean {
	if(!isString(input)){
		return false;
	}

	const str = <string> input;
    // Check for actual newline characters (\n) in the string
    const unescapedNewlineRegex = /\n/;
    return !unescapedNewlineRegex.test(str);
}

export function hasLeadingEmptyRow(input: string): boolean {
  return /^\s*\r?\n/.test(input);
}

export function removeLeadingEmptyRows(input: string): string {
  return input.replace(/^(\s*\r?\n)+/, "");
}

export function replaceAll(str: string, search: string, replacement: string): string {
  return str.split(search).join(replacement);
}

export function normalizeNewlines(input: string, newline: "\n" | "\r\n" = "\n"): string {
  return input
    .replace(/\r\n|\n\r|\r|\n/g, "\n") // Normalize all to \n
    .replace(/\n/g, newline);          // Convert to desired format
}

export function escapeDoubleQuotes(str: string): string {
  return str.replace(/"/g, '\\"');
}

export function escapeColonSemicolon(str: string): string {
  return str.replace(/[:;]/g, match => {
    const escapeMap: Record<string, string> = {
      ':': '::',
      ';': ';;',
    };
    return escapeMap[match];
  });
}

export function isArray(value: unknown): boolean {
  return Array.isArray(value);
}

export function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" &&
         value !== null &&
         !Array.isArray(value);
}

export function isPrimitive(input: any): boolean{
	// // return isNumber(input) || isDate(input) || isBoolean(input);
	// const tmp1 = isNaN(input);
	// const tmp2 = isNumber(input);
	// // const tmp3 = isNum(input);
	// const tmp4 = isNumber(input) || isDate(input) || isBoolean(input);
	return isNumber(input) || isDate(input) || isBoolean(input);
}

export function restoreEscapedNewlinesTabs(input: string): string {
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

export function splitByFirstColon(input: string): [key:string, value:string] 
{
	const index = findFirstColon(input);

	if (index === -1) {
		// No colon found — return the whole string as first part, second part empty
		return [input, ''];
	}

	const key = input.slice(0, index).trim();
	const value = input.slice(index + 1);
	return [key, value];
}

export function findFirstColon(input: string): number
{
	if(input.length == 0){
		return -1;
	}

	let index = -1;
	let from = 0;

	while(from < input.length)
	{
		index = input.indexOf(':', from);

		if(index == -1){
			return -1;
		}

		if(index == input.length - 1){
			return index;
		}

		from = index + 1;
		if(input.charAt(from) == ":"){
			while(input.charAt(from) == ":"){
				if(from + 1 == input.length){
					return -1;
				}

				if(input.charAt(from + 1) == ":"){
					from += 2;
				}
				else{
					from++;
					break;
				}
			}
		}
		else{
			return index;
		}
	}

	return -1;
}

export function isOlitList(entry: string, intent: number|null = null): boolean
{
	if(entry.length== 0){
		return false;
	}

	let tabCount: number;

	if(intent == null){
		const leadMatch = entry.indexOf("\n") == 0 ? entry.substring(1) : entry;
		const leadingTabsMatch = leadMatch.match(/^(\t+)/);
        tabCount = leadingTabsMatch ? leadingTabsMatch[1].length : 0;
	}
	else{
		tabCount = intent;
	}

	const splitter = "\n" + '\t'.repeat(tabCount) + ";";
	const index = entry.indexOf(splitter);

	if(index == -1){
		return false;
	}

	let pos = index + splitter.length;

	if(entry.length == pos){
		return true;
	}

	while(pos < entry.length){
		let char = entry.charAt(pos);

		if(char == " "){
			continue;
		}
		else if(char == "\n"){
			return true;
		}
		else{
			return false;
		}
	}

	return true;
}