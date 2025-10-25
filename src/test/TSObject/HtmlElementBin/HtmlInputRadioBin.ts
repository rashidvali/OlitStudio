import { HtmlBinBase } from "./HtmlelementBase/HtmlBinBase";

export class HtmlInputRadioBin extends HtmlBinBase
{
    constructor(htmlRadio: RadioNodeList){
        super(htmlRadio);
    }

    public core(): RadioNodeList 
    {
        return <RadioNodeList> super.core();
    }

    public setValue(value: any): void 
    {
        if(this.core().value != value)
        {
            for(let e of this.core())
            {
                let r = <HTMLInputElement> e;
                if(r.value == value){
                    r.setAttribute("checked", "checked");
                }
                else{
                    r.removeAttribute("checked");
                }
            }

            this.core().value = value;
        }
    }

    public getValue(): any
    {
        return this.core().value;
    }

    public setOnchange(eventHandler: () => void): void 
    {
        for (let n of this.core()) {
            let r = <HTMLInputElement> n;
            r.onchange = eventHandler;
        }
    }

    public setOninput(eventHandler: () => void): void 
    {
        for (let n of this.core()) {
            let r = <HTMLInputElement> n;
            r.oninput = eventHandler;
        }
    }
}