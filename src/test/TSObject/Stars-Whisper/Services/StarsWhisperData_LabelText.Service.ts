import { DateData_LabelTextService } from "../../Services/DateData_LabelText.Service";
import { LabelTextService } from "../../Services/LabelText.Service";
import { LabelTextSet } from "../../Settings/LabelText";

export class StarsWhisperData_LabelTextService extends LabelTextService
{
    public static readonly prefix: string = "Star-Wisper.Common.Navbar";

    private static _labels = this.loadLabels();

    public static labels(): any{
        return this._labels;
    }

    public static loadLabels():any
    {
        return {
            "Star-Wisper.Common.Navbar.updates": {
                "English": "updates",
                "Russian": "обновления"
            },
            "Star-Wisper.Common.Navbar.chart": {
                "English": "chart",
                "Russian": "карта"    
            },
            "Star-Wisper.Common.Navbar.friends": {
                "English": "friends",
                "Russian": "друзья"
            },
            "Star-Wisper.Common.Navbar.settings": {
                "English": "settings",
                "Russian": "настройки"
            },
            "Star-Wisper.Common.Navbar.matrix": {
                "English": "matrix",
                "Russian": "матрица"
            }
        };
    }
}