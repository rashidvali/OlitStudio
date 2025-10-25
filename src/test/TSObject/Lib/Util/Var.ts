import { Parcel } from "../../Alternative/Parcel";
import { ParcelValueBean } from "../../Alternative/ParcelValueBean";
import { Obj } from "../TSExt/Obj";
import { Bin } from "./Bin";
import { VarBean } from "./VarBean";

export class Var extends Bin<Parcel> implements ParcelValueBean
{
    constructor(defaultValue: Parcel = null, private type: any = null){
        super();

        if(defaultValue != null){
            super.set(defaultValue);
        }
    }

    public setValue(value: any): void 
    {
        if(Obj.isEmpty(this.get())){
            super.set(new Parcel);
        }

        this.get().Value = value;
    }

    public getValue() 
    {
        return this.get()?.Value;
    }

    public getType() {
        return this.type;
    }

    public onchange: () => void; //(this: GlobalEventHandlers, ev: Event) => any;
    public oninput: () => void;

    public setOnchange(eventHandler: () => void): void {
        this.onchange = eventHandler;
    }

    public setOninput(eventHandler: () => void): void  {
        this.oninput = eventHandler;
    }

    public  hasChangeEvent(): boolean {
        return !Obj.isEmpty(this.onchange);
    }
    
    public core(): any {
        return null;
    }

    public set(value: Parcel): void 
    {
        if(this.get() !== value)
        {
            super.set(value);
            this.onchange();
        }
    }
}