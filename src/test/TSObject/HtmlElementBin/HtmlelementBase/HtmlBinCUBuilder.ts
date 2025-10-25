import { BinCU } from "../../Alternative/BinCU";
import { DataType } from "../../Lib/Util/DataType";
import { ParcelValueBean } from "../../Alternative/ParcelValueBean";
import { HtmlInputNumbertBin } from "../HtmlInputNumberBin";
import { HtmlInputRadioBin } from "../HtmlInputRadioBin";
import { HtmlInputTextBin } from "../HtmlInputTextBin";

/*
https://developer.mozilla.org/en-US/docs/Learn/Forms/HTML5_input_types
https://developer.mozilla.org/en-US/docs/Learn/Forms/Basic_native_form_controls
*/
export class HtmlBinCUBuilder
{
    public static build(element: HTMLElement): BinCU
    {
        if(!element){
            return null;
        }

        let bin: ParcelValueBean;
        let type: DataType = null;

        if (element instanceof RadioNodeList)
        {
            bin = new HtmlInputRadioBin(element);
        }
        else if(element instanceof HTMLInputElement)
        {
            switch(element.type)
            {
                case "text":
                    bin = new HtmlInputTextBin(element);
                    type = DataType.string;
                    break;
                case "number":
                    bin = new HtmlInputNumbertBin(element);
                    type = DataType.number
                    break;
                // case "email":
                //     break;
                // case "search":
                //     break;
                // case "tel":
                //     break;
                // case "url":
                //     break;
                // case "datatime-local":
                //     break;
                // case "month":
                //     break;
                // case "time":
                //     break;
                // case "week":
                //     break;
                // case "date":
                //     break;
                // case "color":
                //     break;
                // case "password":
                //     break;
                // case "hidden":
                //     break;
                // case "checkbox":
                //     break;
                // case "submit":
                //     break;
                // case "reset":
                //     break;
                // case "button":
                //     break;
                // case "image":
                //     break;
                // case "file":
                //     break;
            }
        }

        if(bin == null){
            return null;
        }

        let cu = new BinCU(bin, type);
        return cu;
    }
}