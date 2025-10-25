import { Side } from "../Conn/Network/Side";
import { Executor } from "../Lib/Util/Executor";
import { Parcel } from "./Parcel";
import { MessageWirePlug } from "./MessageWirePlug";
import { Obj } from "../Lib/TSExt/Obj";

export class MessageWire
{
    private static idGen = 1;

    private static generateId():number{
        return this.idGen++;    
    }

    public readonly id: number;
    public readonly init: MessageWirePlug;
    public readonly term: MessageWirePlug;

    public Name: string;

    constructor(public readonly type: any, public readonly directed = false, private name: string = null)
    {
        this.id = MessageWire.generateId();
        this.init = new MessageWirePlug(this, Side.INIT);
        this.term = new MessageWirePlug(this, Side.TERM);
    }

    public getName(){
        return this.name;
    }

    public getPlug(side: Side): MessageWirePlug
    {
        if(Obj.isEmpty(side)){
            return null;
        }
        
        switch(side)
        {
            case Side.INIT: return this.init;
            case Side.TERM: return this.term;
        }
    }

    public getOtherSide(side: Side): MessageWirePlug
    {
        if(Obj.isEmpty(side)){
            return null;
        }
        
        switch(side)
        {
            case Side.INIT: return this.term;
            case Side.TERM: return this.init;
        }
    }

    public getOtherPlug(plug: MessageWirePlug): MessageWirePlug
    {
        if (Obj.isEmpty(plug) || plug !== this.getPlug(plug.side)) {
            return null;
        }

        return this.getOtherSide(plug.side);
    }
}