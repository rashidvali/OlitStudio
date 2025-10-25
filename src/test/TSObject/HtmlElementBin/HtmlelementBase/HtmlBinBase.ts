import { Parcel } from "../../Alternative/Parcel";
import { ParcelValueBean } from "../../Alternative/ParcelValueBean";
import { Obj } from "../../Lib/TSExt/Obj";
import { Str } from "../../Lib/TSExt/Str";
import { DataType } from "../../Lib/Util/DataType";

export class HtmlBinBase implements ParcelValueBean
{
    constructor(private htmlPart: any){
    }

    public setValue(value: any): void 
    {
       // abstract
    }

    public getValue(): any
    {
        // abstract
        return null;
    }

    public getType(): DataType
    {
        return DataType.string;
    }

    public setOnchange(eventHandler: () => void): void  {
        
    }

    public setOninput(eventHandler: () => void): void {

    }

    public hasChangeEvent(): boolean 
    {
        return true;
    }

    public core(): any 
    {
        return this.htmlPart;
    }

    public set(o: Parcel): void 
    {
        if(Obj.isEmpty(o)) { throw new Error("Value parcel cannot be empty."); }

        let value = Str.getStringOf(o.Value);

        this.setValue(value);
    }

    public get(): Parcel 
    {
        let parcel = new Parcel(this.getValue());
        parcel.Type = this.getType();
        return parcel; 
    }

}