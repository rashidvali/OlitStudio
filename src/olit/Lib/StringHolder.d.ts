export declare class StringHolder {
    private buff;
    constructor(text?: string);
    reset(): void;
    append(value: any): StringHolder;
    toString(): string;
    flush(): string;
    last(): string;
    indexOf(text: string, fromIndex?: number): number;
    size(): number;
}
