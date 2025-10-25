
export interface Bean<T> {
    set(o: T): void;
    get(): T;
}
