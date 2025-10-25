import { Str } from "../Lib/TSExt/Str";
import { HtmlInputFieldtBin } from "./HtmlelementBase/HtmlInputFieldBin";

export class HtmlInputTextBin extends HtmlInputFieldtBin
{
    constructor(htmlInputElement: HTMLInputElement){
        super(htmlInputElement);
    }

    public getValue(): string
    {
        let res = Str.getStringOf(this.core().value);
        return res;
    }
}