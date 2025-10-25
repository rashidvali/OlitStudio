import { Bean } from "./Bean";

export interface VarBean<T> extends Bean<T>
{
    setOnchange(eventHandler: () => void): void;
    hasChangeEvent(): boolean;    core(): any;
    core(): any;
}