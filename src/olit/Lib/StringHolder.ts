import { stringNotEmpty } from "./Utils";

export class StringHolder {
    private buff = new Array();

    constructor(text: string = ""){
        if(stringNotEmpty(text)){
            this.append(text);
        }
    }

    public reset(): void 
    {
        this.buff = new Array();
    }

    public append(value: any): StringHolder {
        this.buff.push(String(value));
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
        return !!this.buff && this.buff.length > 0 ? this.buff[this.buff.length - 1] : "";
    }

    public indexOf(text: string, fromIndex: number = 0): number {
        return this.buff.indexOf(text, fromIndex);
    }

	public size(): number{
		return this.buff.length;
	}
}
