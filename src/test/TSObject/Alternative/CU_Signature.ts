// const Port: [ port_name: string, data_type?: any, is_sigle_instance?: boolean ] = null;
// export type PortSignature = typeof Port;

import { PortSignature } from "./PortSignature"

export interface CU_Signature
{
    InputPorts?: PortSignature[]
    OutputPorts?: PortSignature[],
    DualPorts?: PortSignature[]
}