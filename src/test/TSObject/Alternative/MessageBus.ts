import { Side } from "../Conn/Network/Side";
import { MessageWirePlug } from "./MessageWirePlug";
import { Parcel } from "./Parcel";
import { Executor } from "../Lib/Util/Executor";

export class MessageBus
{
    private static idGen = 1;

    private static generateId():number{
        return this.idGen++;    
    }

    public readonly id: number;
    private bus: Map<number, MessageWirePlug>;

    constructor()
    {
        this.id = MessageBus.generateId();
        this.bus = new Map<number, MessageWirePlug>();
    }

    public charge(source: MessageWirePlug, parcel: Parcel)
    {
        for(let plg of this.bus.values())
        {
            if(plg.messageWire.id != source.messageWire.id && (!plg.messageWire.directed || plg.side == Side.INIT))
            {
                plg.charge(parcel.clone());
            }
        }
    }

    public addPlug(plug: MessageWirePlug): boolean
    {
        let conId = plug.messageWire.id;
        if(!this.bus.has(conId))
        {
            this.bus.set(conId, plug);


            if(!plug.messageWire.directed || plug.side == Side.TERM)
            {
                plug.setFire((parcel: Parcel) => {
                    Executor.run(() => {
                        this.charge(plug, parcel);
                    });
                });
            }

            return true;
        }

        return false;
    }
}