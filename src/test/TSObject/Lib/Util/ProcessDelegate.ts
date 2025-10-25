export interface ProcessDelegate<E> {
    (entity: E): void;
}
