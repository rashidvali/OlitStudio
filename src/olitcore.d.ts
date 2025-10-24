import { OlitNota } from "./olit/OlitNota";
import type { ObjectLiteral } from "./olit/OlitNota";
export declare const olitNota: OlitNota;
export declare function parseOlit(olitText: string): ObjectLiteral;
export declare function stringifyOlit(json: ObjectLiteral): string;
export declare const n: (strings: TemplateStringsArray, ...values: any[]) => ObjectLiteral;
