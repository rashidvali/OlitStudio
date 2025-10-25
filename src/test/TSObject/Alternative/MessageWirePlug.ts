import { Side } from "../Conn/Network/Side";
import { MessageWire } from "./MessageWire";
import { Parcel } from "./Parcel";
import { Trigger } from "./Trigger";
import { Obj } from "../Lib/TSExt/Obj";
import { TriggerType } from "./TriggerType";
import { Executor } from "../Lib/Util/Executor";

export class MessageWirePlug
{   
    public isActioner = false;
    public Name: string;

    private static idGen = 1;

    private static generateId():number{
        return this.idGen++;    
    }

    public readonly id: number;

    private triggerFire: Trigger;

    constructor(public readonly messageWire: MessageWire, public readonly side: Side){
        this.id = MessageWirePlug.generateId();
    }

    public getOtherPlug(): MessageWirePlug
    {
        if (Obj.isEmpty(this.messageWire)) {
            return null;
        }

        let other = this.messageWire.getOtherPlug(this);

        return other;
    }

    public charge(parcel: Parcel)
    {
        if (Obj.isEmpty(this.messageWire)) {
            return;
        }

        if (this.messageWire.directed && this.side == Side.TERM) {
            return;
        }

        let other = this.getOtherPlug();

        if (Obj.isEmpty(other) || Obj.isEmpty(other.triggerFire)) {
            return;
        }

        Executor.run(() => { 
            // parcel = parcel.clone();
            other.fire(parcel);
        });
    }

    public setFire(charge: Trigger){
        this.triggerFire = charge;
    }

    public fire(parcel: Parcel): Parcel
    {
        if(!Obj.isEmpty(this.messageWire) && !Obj.isEmpty(this.triggerFire) && !Obj.isEmpty(parcel))
        {
            if(!this.messageWire.directed && parcel.TriggerType == TriggerType.Request)
            {
                if(Obj.isEmpty(parcel.ConnectPath)){
                    parcel.ConnectPath = new Array<number>();
                }
    
                parcel.ConnectPath.push(this.messageWire.id);
            }

            this.triggerFire(parcel);
        }

        return null;
    }
}