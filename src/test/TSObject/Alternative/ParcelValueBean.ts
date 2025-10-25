import { Parcel } from "./Parcel";
import { VarBean } from "../Lib/Util/VarBean";

export interface ParcelValueBean extends VarBean<Parcel>
{
    setValue(value: any): void;
    getValue(): any;
    getType(): any;

    setOnchange(eventHandler: () => void): void;
    setOninput(eventHandler: () => void): void;
    hasChangeEvent(): boolean;
    set(o: Parcel): void;
    get(): Parcel;
}