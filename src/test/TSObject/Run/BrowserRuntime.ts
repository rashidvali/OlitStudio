import { Obj } from "../Lib/TSExt/Obj";

export class BrowserRuntime
{
    public static updateDocumentBodyOnload(dlg: () => void)
    {
        let prev = document.body.onload;

        document.body.onload = () => {
            if(!Obj.isEmpty(prev)){
                (<any> prev)();
            }

            dlg();
        };
    }
}