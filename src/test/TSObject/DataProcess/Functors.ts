import { Num } from "../Lib/TSExt/Num";
import { Str } from "../Lib/TSExt/Str";
import { StringHolder } from "../Lib/Util/StringHolder";

export const _ = "_"

export function LIKE(pattern: string): string{
    return " LIKE '" + pattern + "' ";
}
export function LEN(field: string, pattern: string): string{
    return " LIKE '" + pattern + "' ";
}

export function NOT_NULL(): string{
    return " IS NOT NULL ";
}

export function NOT_EMPTY(): string{
    return " <> '' ";
}

export function EQUALS(value: number|string): string{
    if(Num.isNum(value)){
        return " = " + value + " ";
    } else {
        return " = '" + value + "' ";
    }
}

export function N_EQLS(value: number|string): string{
    if(Num.isNum(value)){
        return " <> " + value + " ";
    } else {
        return " <> '" + value + "' ";
    }
}

export function GREATER(value: number|string): string{
    if(Num.isNum(value)){
        return " > " + value + " ";
    } else {
        return " > '" + value + "' ";
    }
}

/**
 * Greater or equals than 'value'
 * @param value
 * @returns 
 */
export function GRT_EQ(value: number|string): string{
    if(Num.isNum(value)){
        return " >= " + value + " ";
    } else {
        return " >= '" + value + "' ";
    }
}

export function LESS(value: number|string): string{
    if(Num.isNum(value)){
        return " < " + value + " ";
    } else {
        return " < '" + value + "' ";
    }
}

/**
 * Less or equals than 'value'
 * @param value
 * @returns 
 */
export function LSS_EQ(value: number|string): string{
    if(Num.isNum(value)){
        return " <= " + value + " ";
    } else {
        return " <= '" + value + "' ";
    }
}

export function IN(...values: string[]|number[]): string
{
    if(!values || values.length == 0){
        return "";
    }

    let acc = new StringHolder();
    let cma = "";

    acc.append(" ").append("IN").append(" (");
    if(Str.isString(values[0])){
        for(let elm of values){
            acc.append(cma);
            acc.append('"').append(elm).append('"');
            if(cma == ""){
                cma = ", ";
            }
        }
    }
    else{
        for(let elm of values){
            acc.append(cma);
            acc.append(elm);
            if(cma == ""){
                cma = ", ";
            }
        }
    }    
    acc.append(") ");   

    return acc.toString();
}

export function AND(...values: string[]): string
{
    let res = values.join(" AND ");
    return res;
}

export function OR(...values: string[]): string
{
    let res = values.join(" OR ");
    return res;
}


//---------------------------------------------------------------------------------------

export function select(...fields: any[]): any[]{
    let res = new Array<any>();

    
    if(!!arguments){
        for(let e of arguments){
            res.push(e);
        }
    }
    return res;
}

export function where(...fields: any[]): any[]{
    return null;
}

export function query(selection: any[], condition: any[] = null, inclusion: any[] = null)
{

}

export const $AND = "$_@#_AND";
export const $OR = "$_@#_OR"
export const $s = "$_@#_SELECTED";