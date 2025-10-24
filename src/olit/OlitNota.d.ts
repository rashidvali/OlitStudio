export type ElementValue = string | number | boolean | Date | OlitObject | any;
export type ArrayValue = ElementValue[];
export type ObjectLiteral = ElementValue | ArrayValue | string | null;
export interface OlitObject {
    [key: string]: ElementValue | null;
}
export declare enum StringValue {
    Unquoted = 0,
    DoubleQuoted = 1
}
export declare class OlitNota {
    private stringOption;
    olitToJson(olit: string): ObjectLiteral;
    private parseOlit;
    private eliminateOlitIntent;
    private eliminateOlitLead;
    jsonToOlit(obj: ObjectLiteral): string;
    parseJson(input: ObjectLiteral, intent?: number): string;
    parseJsonString(value: string, intent?: number | null): string;
    private setIntentationOffset;
}
