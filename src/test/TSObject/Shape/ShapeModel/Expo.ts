import { VisualDomElement } from "./Visual";

export interface ExpoDomElement extends ExpoElement, VisualDomElement
{
}

export interface ExpoElement //extends VisualDomElement 
{
	putInto(figure: any): void;
	removeFrom(figure: any): void;
}
