import { Side } from "../Conn/Network/Side";
import { Num } from "../Lib/TSExt/Num";
import { Obj } from "../Lib/TSExt/Obj";
import { Str } from "../Lib/TSExt/Str";
import { ComputingUnit } from "./ComputingUnit";
import { Parcel } from "./Parcel";
import { TriggerType } from "./TriggerType";
import { Flow } from "../Syne/Flow";
import { MessageWirePlug } from "./MessageWirePlug";
import { Executor } from "../Lib/Util/Executor";
import { Trigger } from "./Trigger";

export class MessageWireJunction
{
    private initHub: Map<number, MessageWirePlug>;
    private termHub: Map<number, MessageWirePlug>;

    private beforeTriggerInti: Trigger = null;
    private afterTriggerInit: Trigger = null;

    private beforeTriggerTerm: Trigger = null;
    private afterTriggerTerm: Trigger = null;

    constructor(public readonly flow: Flow = null, public readonly dataType: any = null, public readonly manyAllowed = true)
    {
        this.initHub = new Map<number, MessageWirePlug>();
        this.termHub = new Map<number, MessageWirePlug>();
    }

    private triggerHub(hub: Map<number, MessageWirePlug>, parcel: Parcel)
    {
        for(let p of hub.values())
        {
            let prc = parcel.clone();
            p.charge(prc);
        }
    }   

    private triggerLane(hub: Map<number, MessageWirePlug>, parcel: Parcel)
    {
        if(Obj.isEmpty(parcel) || !Num.isInt(parcel.Index) || this.flow !== Flow.DUAL){
            return;
        }

        // let prc = parcel;
        let prc = parcel.clone();

        let id = prc.ConnectPath[prc.Index];

        if(!hub.has(id)){
            return;
        }

        prc.Index--;
        hub.get(id).charge(prc);        
    }

    public setBeforeTerm(trg: Trigger){
        this.beforeTriggerTerm = trg;
    }

    public setAfterTerm(trg: Trigger){
        this.afterTriggerTerm = trg;
    }

    public setBeforeInit(trg: Trigger){
        this.beforeTriggerInti = trg;
    }

    public setAfterInit(trg: Trigger){
        this.afterTriggerInit = trg;
    }

    public triggerTerm(parcel: Parcel)
    {
        if(this.beforeTriggerTerm != null) {
            this.beforeTriggerTerm(parcel);
        }

        if(parcel.TriggerType == TriggerType.Response && parcel.Index >= 0) {      
            this.triggerLane(this.termHub, parcel);
        }
        else {
            this.triggerHub(this.termHub, parcel);
        }

        if(this.afterTriggerTerm != null){
            this.afterTriggerTerm(parcel);
        }
    }

    public triggerInit(parcel: Parcel)
    {
        if(this.beforeTriggerInti != null){
            this.beforeTriggerInti(parcel);
        }

        if(parcel.TriggerType == TriggerType.Response && parcel.Index >= 0) {       
            this.triggerLane(this.initHub, parcel);
        }
        else if(this.flow == Flow.DUAL) {
            this.triggerHub(this.initHub, parcel);
        }

        if(this.afterTriggerInit != null){
            this.afterTriggerInit(parcel);
        }
    }

    public fits(plug: MessageWirePlug): boolean
    {
        if(Obj.isEmpty(plug)){
            return false;
        }

        if(!this.manyAllowed && this.initHub.size > 0){
            return false;
        }

        if(this.dataType != null && this.dataType != plug.messageWire.type){
            return false;
        }

        if(this.flow == null){
            return true;
        }

        if(this.flow == Flow.DUAL || !plug.messageWire.directed){
            return true;
        }

        switch(this.flow)
        {
            case Flow.INPUT:
                if(plug.side == Side.TERM){
                    return true;
                }

                return false;

            case Flow.OUTPUT:
                if(plug.side == Side.INIT){
                    return true;
                }

                return false;

            default:
                return true;
        }
    }


    public setInitPlug(plug: MessageWirePlug, pu: ComputingUnit = null): boolean 
    {
        let res = this.setPlug(plug, Side.INIT)

        if(res == true)
        {
            plug.setFire((parcel: Parcel) => {
                Executor.run(() => {
                    let p = parcel;
                    // p = p. clone();
                    this.triggerTerm(p);
                });
            });
        }

        return res;
    }

    public getInitPlug(id: number): MessageWirePlug {
        return this.getPlug(id, this.initHub);
    }

    public setTermPlug(plug: MessageWirePlug, pu: ComputingUnit = null): boolean 
    {
        let res = this.setPlug(plug, Side.TERM);

        if(this.flow == Flow.DUAL)
        {
            if(res == true)
            {
                plug.setFire((parcel: Parcel) => {
                    Executor.run(() => {
                        this.triggerInit(parcel);
                    });
                });
            }
        }

        return res;
    }

    public getTermPlug(id: number): MessageWirePlug {
        return this.getPlug(id, this.termHub);
    }

    private sideHub(side: Side): Map<number, MessageWirePlug>
    {
        switch(side)
        {
            case Side.INIT: return this.initHub;
            case Side.TERM: return this.termHub;
        }
    }

    private setPlug(plug: MessageWirePlug, side: Side): boolean
    {
        let hub: Map<number, MessageWirePlug> = this.sideHub(side);

        if(Obj.isEmpty(plug)){
            return false;
        }

        let conId = plug.messageWire.id;

        if(hub.has(conId)){
            return false;
        }

        if(this.fits(plug))
        {
            hub.set(conId, plug);
            return true;
        }

        return false;
    }

    private getPlug(id: number, hub: Map<number, MessageWirePlug>): MessageWirePlug
    {
        if(Str.isStringEmpty(id)){
            return null;
        }

        return hub.get(id);
    }

    private forEach(trigger: Trigger, side: Side)
    {
        let hub = side == Side.INIT ? this.initHub : this.termHub;

        
    }
}