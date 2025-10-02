import { Bool, escapeColonSemicolon, escapeDoubleQuotes, hasUnescapedColon, hasUnescapedSemicolon, isArray, isBool, isDateLike, isJsonObject, isNumeric, isOlitList, isPrimitive, isSingleRowString, isString, normalizeNewlines, replaceAll, splitByFirstColon, strEnclosedWith, stringEmpty, stringNotEmpty } from "./Lib/Utils";
import { StringHolder } from "./Lib/StringHolder";

export type ElementValue = string | number | boolean | Date | OlitObject | any
export type ArrayValue = ElementValue[];

export type ObjectLiteral = ElementValue | ArrayValue | string | null;
export interface OlitObject
{
  [key: string]: ElementValue | null;
}


export enum StringValue{
	Unquoted, DoubleQuoted
}

// export enum EntryType {
// 	Value,	// a value part of key-value pair
// 	Element	// an element of array
// }

export class OlitNota
{
	private stringOption: StringValue = StringValue.Unquoted; // StringValue.DoubleQuoted; // 

    public olitToJson(olit: string): ObjectLiteral
    {
		if(stringEmpty(olit)){
			return {};
		}

		olit = normalizeNewlines(olit);

        // trim leading spaces only, not \n or \t
		olit = olit.replace(/^[ ]+/, "");
		const leadMatch = olit.indexOf("\n") == 0 ? olit.substring(1) : olit;
		const leadingTabsMatch = leadMatch.match(/^(\t+)/);
        const tabCount = leadingTabsMatch ? leadingTabsMatch[1].length : 0;
        const obj = this.parseOlit(olit, tabCount) as ObjectLiteral;

        return obj;
    }

    private parseOlit(input: string, intent: number): ObjectLiteral
    {
        if(input == null){
            return '';
        }

        let value = input.trim();

        if(isNumeric(value)){
            return Number(value);
        }
        
        if(isBool(value)){
            return Bool(value);
        }
        
        if(isDateLike(value)){
            let dt = value;  
            return new Date(dt);
        }   

		let text = <string> input;

		// if it does not have colons : and semicolons ; then it's a text
		if(!hasUnescapedColon(text) && !hasUnescapedSemicolon(text))
		{
			if(strEnclosedWith(value, '"') && (<string>value).length > 2)
			{
				value = (<string>value).replace(/::/g, ":").replace(/;;/g, ";");
				value = value.slice(1, value.length - 1);
				value = this.eliminateOlitIntent(value, intent);
				return value;
			}

			text = text.replace(/::/g, ":").replace(/;;/g, ";");

			text = text.trimEnd();

			text = this.eliminateOlitIntent(text, intent);
			// Unescaping colons and semicolons (removing dublicates)
			if(isSingleRowString(text)){
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
        if (isOlitList(text))  // ARRAY
        {	//It's an array

            // Split
			if(text.endsWith(splitter + ";")){
				text += "\n";
			}

            const parts = text.split(arrDlm + "\n");
            const arr = new Array<ObjectLiteral>();

            for(let p of parts)
            {
                if(stringNotEmpty(p))
				{
					let tabCount: number;
					if(isOlitList(p)){ // if an element is an array
						tabCount = intent + 1;
					} else {
						tabCount = intent;
					}

					const val = this.parseOlit(p, tabCount);					
                    arr.push(val);
                }
            }

            return arr;
        } 
        else 							// OBJECT
        {	// It's a JSON object
			const spoiler = "\n" + tabPrefix + "\t";
			const replacer = "\n<*10>" + tabPrefix + "\t"; 

			// Protect any literal <*10> tokens
			text = text.replace(/<\*10>/g, '<<*10*10>>');

			const marked = replaceAll(text, spoiler, replacer);
			const parts = marked.trim().split(splitter);

			const obj: OlitObject = {};
			for(let e of parts)
			{
				let trimmed = replaceAll(e, replacer, spoiler).trim();
				// Restore literal <*10> tokens
				trimmed = trimmed.replace(/<<\*10\*10>>/g, '<*10>');

				while(trimmed.indexOf(" \n") > -1)
				{
					trimmed = replaceAll(trimmed, " \n", "\n");					
				}

				const p = splitByFirstColon(trimmed);

				let val = p[1];			
				const isArray = isOlitList(val, intent + 1);

				if(isArray){ // Normilize an array element's starting
					val = '\t'.repeat(intent + 1) + val.trimStart();
				}

				const value = this.parseOlit(val, intent + 1);
				obj[p[0]] = value;
			}

			return obj;
        }
    }

	private eliminateOlitIntent(value: string, intent: number|null): string
	{
		if(intent != null)
		{
			// because the value is indetivied as text (multiline) string
			// and has a key, the intent is related to the key - an intent 
			// for a key is "key intent + 1"

			if(isSingleRowString(value)){
				value = value.trimStart();
			} else {
				const nl = value.indexOf("\n");
				if(nl > 0){
					const lead = value.substring(0, nl);
					if(lead.trim() == ""){
						value = value.substring(nl);
					} else {
						if(value.startsWith(" ")){
							value = value.substring(1);
						}
					}
				}
			}

			const tabs = "\t".repeat(intent);
			const offset = "\n" + tabs;
			value = replaceAll(value, offset, "\n");

		}
		
		return value;
	}

	private eliminateOlitLead(value: string, intent: number|null): string
	{
		if(intent != null)
		{
			// because the value is indetivied as text (multiline) string
			// and has a key, the intent is related to the key - an intent 
			// for a key is "key intent + 1"
			const offset = "\n" + "\t".repeat(intent);
			value = replaceAll(value, offset, "");
			return value;
		}
		else
		{
			return value;
		}
	}

	public jsonToOlit(obj: ObjectLiteral)
	{
		return this.parseJson(obj);
	}

	public parseJson(input: ObjectLiteral, intent: number = 0): string
	{
		if(input == null){
			return "";
		}

		if(isString(input))
		{
			let value = <string> input;
			value = replaceAll(value, ":", "::");	
			value = replaceAll(value, ";", ";;");
			const resStr = this.parseJsonString(value, intent);
			return resStr;
		}

		if(isPrimitive(input)){
			return input;
		}

		if(isJsonObject(input))
		{
			const strBldr = new StringHolder();

			let nL = "";
			for(const [key, val] of Object.entries(input))
			{
				strBldr.append(nL);

				if(nL == ""){
					nL = "\n";
				}

				strBldr.append("\t".repeat(intent));
				strBldr.append(key);
				strBldr.append(":");

				let value: ObjectLiteral;
				if(isString(val))
				{
					const str = this.parseJsonString(<string> val, intent);

					if(isSingleRowString(val)){						
						value = " " + str.trim();
					}
					else{
						value = str;
					}

					// value = replaceAll(value, ":", "::");
					// value = replaceAll(value, ";", ";;");
				}
				else if(isPrimitive(val)) {
					const str = "" + val;
					value = " " + str.trim();
				}
				else if(isJsonObject(val)){
					value = "\n" + this.parseJson(val, intent + 1)
				}
				else if(isArray(val)){
					value = "\n" + this.parseJson(val, intent + 1);
				}

				strBldr.append(value);
			}

			return strBldr.toString();
		}

		if(isArray(input))
		{
			const strBldr = new StringHolder();
			const arr = <Array<ObjectLiteral>> input;

			let nL = "";
			for(const elm of arr)
			{
				strBldr.append(nL);

				if(isPrimitive(elm))
				{
					strBldr.append("\t".repeat(intent) + elm);
				}
				else if(isSingleRowString(elm))
				{
					let value = replaceAll(elm, ":", "::");
					value = replaceAll(value, ";", ";;");
					strBldr.append("\t".repeat(intent) + value);
				}
				else if(isString(elm)) 
				{
					let value = replaceAll(elm, ":", "::");
					value = replaceAll(value, ";", ";;");
					const val = value.indexOf("\n") > -1 
						? replaceAll(value, "\n", "\n" + "\t".repeat(intent))
						: " " + value;
					strBldr.append(val);
				}	
				else
				{
					const tabCount = isArray(elm) ? intent + 1 : intent;
					const entry = this.parseJson(elm, tabCount);
					strBldr.append(entry);
				}
				
				strBldr.append("\n").append("\t".repeat(intent));
				strBldr.append(";");

				if(nL == ""){
					nL = "\n";
				}
			}

			return strBldr.toString();
		}

		return "";
	}

	public parseJsonString(value: string, intent: number|null = null): string
	{
		if(value.                        trim() == ""){
			return "";
		}

		value = normalizeNewlines(value);
		let resStr: string;

		if(this.stringOption == StringValue.Unquoted){
			resStr = escapeColonSemicolon(value);
			resStr = " " + this.setIntentationOffset(resStr, intent);			
			return resStr;
		}

		if(this.stringOption == StringValue.DoubleQuoted){
			resStr = escapeDoubleQuotes(value);
			resStr = this.setIntentationOffset(resStr, intent);
			resStr = '"' + resStr + '"';
			return resStr;
		}

		return "";
	}

	private setIntentationOffset(text: string, intent: number|null): string
	{
		let resStr: string;

		if(intent != null){
			resStr = replaceAll(text, "\n", "\n" + "\t".repeat(intent + 1));
		}
		else{
			resStr = text;
		}

		return resStr;
	}
}