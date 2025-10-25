import { HtmlBinBase } from "./HtmlBinBase";

export class HtmlInputFieldtBin extends HtmlBinBase
{
    constructor(htmlInputElement: HTMLInputElement) {
        super(htmlInputElement);
    }

    public setValue(value: any): void 
    {
        this.core().value = value;
    }

    public getValue(): any
    {
        return this.core().value;
    }

    public setOnchange(eventHandler: () => void): void  {
        this.core().onchange = eventHandler;
    }

    public setOninput(eventHandler: () => void): void  {
        this.core().oninput = eventHandler;
    }

    public core(): HTMLInputElement {
        return <HTMLInputElement> super.core();
    }
}