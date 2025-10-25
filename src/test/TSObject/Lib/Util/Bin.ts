import { Bean } from "./Bean";

export class Bin<T> implements Bean<T>
{
    private value: T;

    public set(value: T): void {
        this.value = value;
    }

    public get(): T {
        return this.value;
    }
}