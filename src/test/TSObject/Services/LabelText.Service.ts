import { LabelTextSet } from "../Settings/LabelText";

export class LabelTextService
{
    public static readonly prefix: string = "";

    public static labels(): any{
        return null;
    }

    public static loadLabels():any{
        return null;
    }

    public static optionLabel(key: string):LabelTextSet{
        return this.labels()[key];
    }
}