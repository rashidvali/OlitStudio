import { Obj } from "../Lib/TSExt/Obj";
import { Str } from "../Lib/TSExt/Str";
import { DataType } from "../Lib/Util/DataType";
import { Parcel } from "../Alternative/Parcel";
import { TriggerType } from "../Alternative/TriggerType";
import { LanguageOption } from "../Settings/LabelText";
import { CU } from "../Alternative/CU";
import { CU_Signature } from "../Alternative/CU_Signature";

const CHOSEN_LANG = LanguageOption.Russian;

export class AppSetServer extends CU
{
    public static readonly APP_SETTING_VALUE = "AppSetServer.SetValue";
    public static readonly APP_CHOSEN_LANG = "AppSetServer.ChosenLang";
    public static readonly APP_CHOSEN_DATE = "AppSetServer.ChosenDate";

    public cuSignature(): CU_Signature
    {
        let cus: CU_Signature = {
            DualPorts: [
                { PortName: AppSetServer.APP_SETTING_VALUE, DataType: DataType.string },
                { PortName: AppSetServer.APP_CHOSEN_LANG, DataType: LanguageOption },
                { PortName: AppSetServer.APP_CHOSEN_DATE, DataType: DataType.Date }
            ]
        };
    
        return cus;
    }

    public process(): void
    {
        let rqstPrsl = this.dualGet(AppSetServer.APP_SETTING_VALUE);

        if(Obj.isEmpty(rqstPrsl) || rqstPrsl.TriggerType != TriggerType.Request){
            return;
        }
        
        if(Obj.isEmpty(rqstPrsl.Value)){
            return;
        }

        let query = Str.getStringOf(rqstPrsl.Value);
        let respPrsl = new Parcel();
        
        respPrsl.Index = rqstPrsl.ConnectPath.length - 1;
        respPrsl.TriggerType = TriggerType.Response;
        respPrsl.readinPath(rqstPrsl);        

        if(query == "DEFAULT_LANG"){
            respPrsl.Value = CHOSEN_LANG;
        }    
        else if(query == "CHOSEN_LANG"){
            respPrsl.Value = LanguageOption.English;
        }

        else if(query == "r1"){
            respPrsl.Value = "ABC - responce for 'r1'"
        }
        else if(query == "r2"){
            respPrsl.Value = "XYZ - responce for 'r2'"
        }

        else{
            respPrsl.Value = "broken request";
        }

        this.fireDualExternally(AppSetServer.APP_SETTING_VALUE, respPrsl);
    }

}