import { HtmlVisual } from "../../Graphics/Rendering/Display.h";
import { ExpoDomElement } from "./Expo";

export interface VisualDomElement 
{
	surface(): HtmlVisual;
	update(): void;
	getParentView():VisualDomElement;
	setParentView(parent: VisualDomElement): void;
	hasParentDisplay(): boolean;
	getParentDisplay(): ExpoDomElement;
}
