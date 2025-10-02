import { OlitNota } from "./olit/OlitNota";
import { ObjectLiteral } from "./olit/OlitNota";

const olitNota = new OlitNota();

export function parseOlitQl(olitql: string): ObjectLiteral {
  return olitNota.olitToJson(olitql); // still uses core parser for now
}

export const q = (strings: TemplateStringsArray, ...values: any[]): ObjectLiteral => {
  const raw = strings.reduce((acc, str, i) => acc + str + (values[i] ?? ""), "");
  return parseOlitQl(raw);
};
