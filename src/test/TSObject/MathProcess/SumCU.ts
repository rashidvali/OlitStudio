import { CU } from "../Alternative/CU";
import { CU_Signature } from "../Alternative/CU_Signature";
import { Num } from "../Lib/TSExt/Num";
import { DataType } from "../Lib/Util/DataType";
import { Parcel } from "../Alternative/Parcel";

export class SumCU extends CU
{
    public cuSignature(): CU_Signature 
    {
        let cul: CU_Signature = {
            InputPorts: [
                {PortName: "term1", DataType: DataType.number},
                {PortName: "term2", DataType: DataType.number}
            ],
            OutputPorts: [
                { PortName: "sum", DataType: DataType.number }
            ]
        };
    
        return cul;
    }

    private term1: number;
    private term2: number;

    public process(): void 
    {
        let term1 = Num.toNum(this.inputGet("term1")?.Value);
        let term2 = Num.toNum(this.inputGet("term2")?.Value);

        let sum = term1 + term2;
        let termSum = new Parcel(sum);
        termSum.Type = DataType.number;

        this.fireOutput("sum", termSum);
    }
}