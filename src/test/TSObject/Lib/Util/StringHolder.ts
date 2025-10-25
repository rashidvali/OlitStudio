import { Str } from "../TSExt/Str";


export class StringHolder {
    private buff = new Array();

    constructor(text: string = null){
        if(Str.isStringValid(text)){
            this.append(text);
        }
    }

    public reset(): void 
    {
        this.buff = new Array();
    }

    public append(value: any): StringHolder {
        this.buff.push(Str.getStringOf(value));
        return this;
    }

    public toString(): string {
        return this.buff.join("");
    }

    public flush(): string 
    {
        let res = this.toString();
        this.reset();
        return res;
    }

    public last(): string{
        return !!this.buff && this.buff.length > 0 ? this.buff[this.buff.length - 1] : null;
    }

    public indexOf(text: string, fromIndex: number = null): number {
        return this.buff.indexOf(text, fromIndex);
    }
}
