import { Obj } from "../Lib/TSExt/Obj";
import { TriggerType } from "./TriggerType";

export class Parcel
{
    public constructor(value: any = null)
    {
        if(value != null){
            this.Value = value;
        }
    }

    public Value: any;
    public Type: any;
    public TriggerType: TriggerType;
    public Index: number;
    public Message: string;
    public ConnectPath: number[];
    public Mark: any;

    public getTriggerType(): TriggerType{
        return Obj.isEmpty(this.TriggerType) ? TriggerType.Push : this.TriggerType;
    }

    public readinPath(parcel: Parcel)
    {
        if(Obj.isEmpty(parcel) || Obj.isEmpty(parcel.ConnectPath)){
            return;
        }

        this.ConnectPath = new Array<number>();

        for(let n of parcel.ConnectPath){
            this.ConnectPath.push(n);
        }
    }

    public clone():Parcel
    {
        let that =  new Parcel(this.Value);
        that.readinPath(this);

        that.Type = this.Type;
        that.TriggerType = this.TriggerType;
        that.Index = this.Index;
        that.Message = this.Message;
        that.Mark = this.Mark;

        return that;
    }
}