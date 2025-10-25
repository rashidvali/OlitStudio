import { Str } from "../Lib/TSExt/Str";
import { StringHolder } from "../Lib/Util/StringHolder";

export class Querier
{
    public static parse(olitql: string): any
    {
        if(Str.isStringEmpty(olitql)){
            return null;
        }

        let json: any = {};

        let entMap: any = {};
        let entStr = Str.getInner(olitql, "let entity;", "let end;");

        if(Str.isStringValid(entStr))
        {
            entStr = Str.replace(entStr, "\n", "");
            entStr = entStr.trim();
            entStr = Str.trimTail(";", entStr);
            let arr = entStr.split(";");

            for(let elm of arr)
            {
                elm = elm.trim();
                let alias = Str.getInner(elm, "let ", "= new").trim();
                let table = Str.getInner(elm, "new ", "();").trim();
                entMap[alias] = table;
            }
        }

        json["Entity"] = entMap;


        return json;
    }
}