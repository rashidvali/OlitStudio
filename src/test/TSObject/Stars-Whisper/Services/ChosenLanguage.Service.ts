import { CU } from "../../Alternative/CU";
import { CU_Signature } from "../../Alternative/CU_Signature";
import { Parcel } from "../../Alternative/Parcel";
import { TriggerType } from "../../Alternative/TriggerType";
import { LanguageOption } from "../../Settings/LabelText";


export class ChosenLanguageService extends CU
{
    public static readonly SERVICE_CHOSEN_LANG = "Service.ChosenLang";
    private CHOSEN_LANGUAGE = LanguageOption.Russian;

    public cuSignature(): CU_Signature
    {
        let cus: CU_Signature = {
            DualPorts: [
                {PortName: ChosenLanguageService.SERVICE_CHOSEN_LANG, DataType: LanguageOption},
            ]
        };
    
        return cus;
    }

    public process(): void
    {
        let rqstPrsl = this.dualGet(ChosenLanguageService.SERVICE_CHOSEN_LANG);
        let respPrsl: Parcel;

        switch (rqstPrsl.TriggerType)
        {
            case TriggerType.Push:
                this.CHOSEN_LANGUAGE = rqstPrsl.Value;
                respPrsl = new Parcel(rqstPrsl.Value);
                respPrsl.Type = LanguageOption;
                respPrsl.TriggerType = TriggerType.Push;
                break;
            
            case TriggerType.Request:
                respPrsl = new Parcel(this.CHOSEN_LANGUAGE);
                respPrsl.Type = LanguageOption;
                respPrsl.Index = rqstPrsl.ConnectPath.length - 1;
                respPrsl.TriggerType = TriggerType.Response;
                respPrsl.readinPath(rqstPrsl);
                break;
            default:
                return;
        }

        this.fireDualExternally(ChosenLanguageService.SERVICE_CHOSEN_LANG, respPrsl);
    }
}