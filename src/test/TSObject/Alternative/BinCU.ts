import { DataType } from "../Lib/Util/DataType";
import { Parcel } from "./Parcel";
import { ParcelValueBean } from "./ParcelValueBean";
import { CU } from "./CU";
import { CU_Signature } from "./CU_Signature";

export class BinCU extends CU
{
    private onChangeAllowed: boolean;
    private onInputAllowed: boolean = false;

    constructor(public readonly bin: ParcelValueBean, public readonly type = DataType.string)
    {
        super();

        this.setBinOnChange();
        this.allowOnChange(true);

        this.setBinOnInput();
    }

    public cuSignature(): CU_Signature 
    {
        return {
            DualPorts: [
                { PortName: "value", DataType: this.type }
            ]
        };
    }

    public process(): void 
    {
        let parcel = this.dualGet("value");
        
        // this.fire = false;
        this.bin.set(parcel);
        // this.fire = true;
    }

    public allowOnChange(allowed: boolean = null):boolean
    {
        if(allowed != null){
            this.onChangeAllowed = allowed;
        }

        return this.onChangeAllowed;
    }

    public allowOnInput(allowed: boolean = null):boolean
    {
        if(allowed != null){
            this.onInputAllowed = allowed;
        }

        return this.onInputAllowed;
    }

    private setBinOnChange()
    {
        this.bin.setOnchange(() => {
            if(this.onChangeAllowed){
                this.action();        
            }
        });
    }

    private setBinOnInput()
    {
        this.bin.setOninput(() => {
            if(this.onInputAllowed){
                this.action();        
            }
        });
    }

    private action()
    {
        let value = this.bin.getValue();
        let parcel = new Parcel(value);

        this.fireDualExternally("value", parcel);        
    }
}