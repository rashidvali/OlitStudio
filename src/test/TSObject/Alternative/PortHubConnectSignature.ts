import { Side } from "../Conn/Network/Side";

// [PortName: string, WireName: string, Side: Side]

export interface PortConnectSignature
{
    PortName: string; 
    WireName: string; 
    Side: Side;
}

export interface PortHubConnectSignature
{
    Inputs?: PortConnectSignature[];
    Outputs?: PortConnectSignature[];
    Duals?: PortConnectSignature[];
}