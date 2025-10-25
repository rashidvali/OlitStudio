import { Num } from "../Lib/TSExt/Num";
import { DataType } from "../Lib/Util/DataType";
import { HtmlInputFieldtBin } from "./HtmlelementBase/HtmlInputFieldBin";

export class HtmlInputNumbertBin extends HtmlInputFieldtBin
{
    constructor(htmlInputElement: HTMLInputElement){
        super(htmlInputElement);
    }

    public getValue(): number
    {
        let res = Num.toNum(this.core().value);
        return res;
    }

    public getType(): DataType
    {
        return DataType.number;
    }
}