import { DataType } from "../Lib/Util/DataType";
import { HtmlBinBase } from "./HtmlelementBase/HtmlBinBase";

export class HtmlSpanBin extends HtmlBinBase
{
    constructor(htmlSpanElement: HTMLSpanElement) {
        super(htmlSpanElement);
    }

    public core() {
        return <HTMLSpanElement> super.core();
    }

    public setValue(value: any): void 
    {
        this.core().innerHTML = value;
    }

    public getValue()
    {
        return this.core().innerHTML;
    }

    public getType(): DataType
    {
        return DataType.string;
    }

    public hasChangeEvent(): boolean 
    {
        return false;
    }
}