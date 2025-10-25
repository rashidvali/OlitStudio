import { Obj } from "../Lib/TSExt/Obj";
import { ComputingUnit } from "./ComputingUnit";
import { Flow } from "../Syne/Flow";
import { CU_Signature } from "./CU_Signature";
import { MessageWirePlug } from "./MessageWirePlug";
import { MessageWireJunction } from "./MessageWireJunction";
import { Parcel } from "./Parcel";
import { MessageWire } from "./MessageWire";

export class CU implements ComputingUnit
{
    private static idGen = 1;

    private static generateId():number{
        return this.idGen++;    
    }

    public readonly id: number;
    private input = new Map<string, MessageWireJunction>();
    private output = new Map<string, MessageWireJunction>();
    private dual = new Map<string, MessageWireJunction>();

    private inVal = new Map<string, Parcel>();
    private dlVal = new Map<string, Parcel>();

    public key: string;
    public name: string;
    public isSingleton = false;
    
    public readonly dMsgWr = new Map<string, MessageWire>(); // directed app message wires
    public readonly uMsgWr = new Map<string, MessageWire>(); // undirected app message wires

    constructor()
    {
        this.id = CU.generateId();

        let afs = this.cuSignature();

        let inp = afs.InputPorts;
        if(!Obj.isEmpty(inp))
        {
            for(let p of inp)
            {
                let cj = new MessageWireJunction(Flow.INPUT, p.DataType);

                cj.setBeforeTerm((parcel) => {
                    this.inVal.set(p.PortName, parcel);
                    this.computeBefore();
                });

                this.input.set(p.PortName, cj);                

                cj.setAfterTerm((parcel) =>{
                    this.process();
                });
            }
        }

        let out = afs.OutputPorts;
        if(!Obj.isEmpty(out))
        {
            for(let p of out)
            {
                let cj = new MessageWireJunction(Flow.OUTPUT, p.DataType);
                this.output.set(p.PortName, cj);
            }
        }

        let dul = afs.DualPorts;
        if(!Obj.isEmpty(dul))
        {
            for(let p of dul)
            {
                let cj = new MessageWireJunction(Flow.DUAL, p.DataType);

                cj.setBeforeTerm((parcel) => {
                    this.dlVal.set(p.PortName, parcel);
                    this.computeBefore();
                });

                this.dual.set(p.PortName, cj);

                cj.setAfterTerm(() =>{
                    this.process();
                });
            }
        }
    
    }

    public computeBefore(): void{
        // abstract
    }

    public process(): void{
        // abstract
    }

    public cuSignature(): CU_Signature
    {
        let afs: CU_Signature = {

        };

        return afs;
    }

    public plugIn(portName: string, plug: MessageWirePlug): boolean
    {
        if(!this.input.has(portName)){
            return false;
        }

        let res = this.input.get(portName).setInitPlug(plug, this);

        return res;
    }

    public plugInFromInside(portName: string, plug: MessageWirePlug): boolean
    {
        if(!this.input.has(portName)){
            return false;
        }

        let res = this.input.get(portName).setTermPlug(plug, this);

        return res;
    }

    public plugOut(portName: string, plug: MessageWirePlug): boolean
    {
        if(!this.output.has(portName)){
            return false;
        }

        let res = this.output.get(portName).setTermPlug(plug);

        return res;
    }

    public plugOutFromInside(portName: string, plug: MessageWirePlug): boolean
    {
        if(!this.output.has(portName)){
            return false;
        }

        let res = this.output.get(portName).setInitPlug(plug);

        return res;
    }

    public plugDual(portName: string, plug: MessageWirePlug): boolean
    {
        if(!this.dual.has(portName)){
            return false;
        }

        let res = this.dual.get(portName).setInitPlug(plug, this);

        return res;
    }

    public plugDualFromInside(portName: string, plug: MessageWirePlug): boolean
    {
        if(!this.dual.has(portName)){
            return false;
        }

        let res = this.dual.get(portName).setTermPlug(plug, this);

        return res;
    }

    public dualGet(name: string){
        return this.dlVal.get(name);
    }

    public dualSet(name: string, parcel: Parcel){
        this.dlVal.set(name, parcel);
    }

    public inputGet(name: string){
        return this.inVal.get(name);
    }

    // public fireInput(name: string, parcel: Parcel): void{
    //     this.input.get(name)?.triggerTerm(parcel);
    // }

    public fireOutput(name: string, parcel: Parcel): void{
        this.output.get(name)?.triggerTerm(parcel);
    }

    public fireDualExternally(name: string, parcel: Parcel): void{
        this.dual.get(name)?.triggerInit(parcel);
    }

    public fireDualInternally(name: string, parcel: Parcel): void{
        this.dual.get(name)?.triggerTerm(parcel);
    }
}