import { OlitNota } from "./olit/OlitNota";
import type { ObjectLiteral } from "./olit/OlitNota";

export const olitNota = new OlitNota();

export function parseOlit(olitText: string): ObjectLiteral {
  return olitNota.olitToJson(olitText);
}

export function stringifyOlit(json: ObjectLiteral): string {
  return olitNota.jsonToOlit(json);
}

// Tagged template function for `n```
export const n = (strings: TemplateStringsArray, ...values: any[]): ObjectLiteral => {
  const raw = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
  return parseOlit(raw);
};
