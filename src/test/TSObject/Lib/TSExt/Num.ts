import { Str } from "./Str";

export class Num
{
    public static isNum(num: any): boolean 
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

    // TODO: check use of isInteger 2022-04-02
    public static isInt(num: number): boolean
    {
        if(!this.isNum(num)){
            return false;
        }

        num = num * 1;

        return num == Math.floor(num);
    }

    public static isEven(num: number): boolean
    {
        return num % 2 == 0;
    }

    public static n2z(num: number): number{ // null -> 0
        return this.isNum(num) ? num : (!num ? 0 : null);
    }

    public static n2Z(num: number): number{ // null -> 0
        return this.isNum(num) ? num : 0;
    }

    /**
     * Returns a reversed list of digits
     * @param intNum - integer
     */
    public static i2rl(intNum: number, d = 10): number[]
    {
        let res = [];

        if(intNum != Math.floor(intNum)){
            return null;
        }

        intNum = Math.abs(intNum);
        
        if(intNum >= 0 && intNum < d){
            return [intNum];
        }


        let rm = intNum % d;
        let num = intNum;

        while(num > 0)
        {
            res.push(rm);
            num -= rm;
            num /= d;
            rm = num %d;
        }

        return res;
    }

    public static toNum(obj: any): number{
        return Num.isNum(obj) ? (<number> obj) * 1 : 0;
    }

    public static toInt(obj: any): number{
        return Num.isNum(obj) ? Math.round( (<number> obj) * 1 ) : 0;
    }

    public static intDString(num: number, digits: number = 8): string 
    {
        num = this.toInt(num);
        digits = this.toInt(digits);

        let asStr = "" + num;
        if(asStr.length >= digits){
            return asStr;
        }

        return Str.repeat("0", digits - asStr.length) + asStr;
    }
} 