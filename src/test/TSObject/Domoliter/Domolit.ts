import { TemplateResult } from "../../node_modules/lit-html/lit-html";
import { AppPartType } from "./AppPartType";
import { LabelTextService } from "../Services/LabelText.Service";
import { AppRoute } from "../ArchtectInfra/Navigation/AppRoute";
import { AppRouting } from "../ArchtectInfra/Navigation/AppRouting";
import { MessageWireSignature } from "../Alternative/MessageWireSignature";
import { PortHubConnectSignature } from "../Alternative/PortHubConnectSignature";

// DOM object literal
export interface Domolit
{
    type?: AppPartType;
    class?: any; // ComponentClass;
    attributes?: { name: string, value: string }[];
    ns_attributes?: { namespace: string, name: string, value: string}[];
    inner_html?: TemplateResult<1>;
    methods?: { name: string, values: any[] }[];
    children?: Domolit[];
    element?: string;
    key?: string;
    parent?: boolean;
    id?: string;
    name?: string;
    collected?: AppRouting;    
    name_data_prefix?: string;
    options_data_service?: typeof LabelTextService;
    routes?: AppRoute[];
    authentication?: boolean;
    messageWires?: MessageWireSignature[];
    services?: Domolit[];
    portConnectSignature?: PortHubConnectSignature,
}