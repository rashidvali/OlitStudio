import { Domolit } from "../../Domoliter/Domolit";
import { LabelTextService } from "../../Services/LabelText.Service";

export interface AppRoute
{
    key: string;
    path: string;
    appPart: Domolit;
    name?: string;
    isSingleton?: boolean;
    isDefault?: boolean;
    name_data_prefix?: string;
    options_data_service?: typeof LabelTextService;
}