export class Clone {
    static clone<T>(source: T): T {
        return JSON.parse(JSON.stringify(source)) as T;
    }
}