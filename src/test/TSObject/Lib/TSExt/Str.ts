import { StringHolder } from "../Util/StringHolder";
import { Num } from "./Num";
import { Obj } from "./Obj";

// String.prototype.replaceAll = function(arg0: string, arg1: string): string{
//     let res: string = null;
//     if(Str.isStringEmpty(arg0) || arg1 == null){
//         return <string> this;
//     }

//     let regExp = new RegExp(arg0, "g");
//     res = this.toString();
//     res = res.replace(regExp, arg1);

//     return res;
// }

// String.prototype.isEmpty = function(): boolean{
//     return this.length == 0;
// }

// String.prototype.equals = function(obj: any): boolean{
//     if(Obj.isEmpty(obj)){
//         return false;
//     }

//     return this.valueOf() == Str.getStringOf(obj);
// }

export class Str
{
    public static readonly DELIMITER = ",";
    public static readonly SEPARATOR = ";";

    public static isIncapsulated(str: string, startToken: string, endToken: string): boolean
    {
        if( str != null && startToken != null && endToken != null && str.startsWith(startToken) && str.endsWith(endToken) )
            return true;
        else
            return false;
    }   

    public static getInner(str: string, startToken: string, endToken: string): string
    {
        if( str != null && startToken != null && endToken != null )
        {
            let pos1 = str.indexOf(startToken); 
            
            if( pos1 > -1 )
            {
                pos1 += startToken.length;
                let pos2 = str.lastIndexOf(endToken);

                if( pos2 > -1 && pos1 < pos2 )
                    return str.substring(pos1, pos2);
            }
        }
        
        return null;
    }

    public static isString(entry: any): boolean {
        if (!entry) {
            return false;
        }
        return typeof entry === 'string';
    }


    public static isStringEmpty(entry: string | any): boolean 
    {
        if(entry === undefined || entry === null){
            return true;
        }

        if (!Str.isString(entry)) {
            return true;
        }

        return (<string>entry).trim().length == 0;
    }


    public static isStringValid(entry: string | any): boolean {
        return !Str.isStringEmpty(entry);
    }

    public static isStringer(obj: any): boolean {
        if (obj && obj.output)
            return true;
        return false;
    }
    public static getStringOf(value: any): string {
        let res = "";

        if(value === false){
            res += "false";
        }
        else if(value === true){
            res += "true";
        }
        else if(value === 0){
            res += "0";
        }
        // else if (!value)
        //     res += "";
        // // else if (Str.isString(value))
        //     res += value;
        else if (!!value?.toString)
            res += value.toString();
        else
            res += value;

        return res;
    }

    // public static replace(text: string, find: string, replace: string): string {
    //     var reg = new RegExp(find, 'g');
    //     text = text.replace(reg, replace);
    //     return text;
    // }
    public static replace(text: string, find: string, replace: string): string {
        if (text == null || find == null) {
            return text;
        }

        if (!Str.isString(text) || !Str.isString(find)) {
            return "";
        }

        if (!Str.isString(replace)) {
            replace = "";
        }

        let ind = text.indexOf(find);
        if (ind < 0) {
            return text;
        }

        return text.substring(0, ind) + replace + Str.replace(text.substring(ind + find.length), find, replace);
    }

    public static IsHead(pattern: string, entry: string): boolean {
        if (!Str.isString(pattern) || !Str.isString(entry)) {
            return false;
        }
        if (pattern.length > entry.length) {
            return false;
        }
        if (entry.indexOf(pattern) == 0) {
            return true;
        }
        return false;
    }
    public static IsIn(pattern: string, entry: string): boolean {
        if (!Str.isString(pattern) || !Str.isString(entry)) {
            return false;
        }
        if (pattern.length > entry.length) {
            return false;
        }
        if (entry.indexOf(pattern) > -1) {
            return true;
        }
        return false;
    }
    public static IsTail(pattern: string, entry: string): boolean {
        if (!Str.isString(pattern) || !Str.isString(entry)) {
            return false;
        }
        if (pattern.length > entry.length) {
            return false;
        }

        let tailpos = entry.length - pattern.length;
        let tail = entry.substring(tailpos);
        if (tail == pattern) {
            return true;
        }
        return false;
    }

    public static trimHead(pattern: string, entry: string): string
    {
        if(Str.isStringEmpty(pattern) || Str.isStringEmpty(entry)){
            return entry;
        }

        if(Str.IsHead(pattern, entry)){
            return entry.substring(pattern.length);
        }

        return entry;
    }

    public static trimTail(pattern: string, entry: string): string
    {
        if(Str.isStringEmpty(pattern) || Str.isStringEmpty(entry)){
            return entry;
        }

        if(Str.IsTail(pattern, entry)){
            return entry.substring(0, entry.length - pattern.length);
        }

        return entry;
    }

    // public static contains(text: string, regex: RegExp): boolean {
    //     return regex.test(text);
    // }

    public static repeat(text: string, times: number): string 
    {
        if(Str.isStringEmpty(text) && text != " "){
            return text;
        }

        times = Num.toInt(times);
        let acc = new StringHolder();
        for(let i = 0; i < times; i++){
            acc.append(text);
        }

        return acc.toString();
    }

    public static extendWithSpacesUpTo(entry: string, size: number): string
    {
        if(Str.isStringEmpty(entry) || size < 1){
            return entry;
        }

        if(size <= entry.length){
            return entry;
        }

        return entry + Str.repeat(" ", size - entry.length);
    }
}