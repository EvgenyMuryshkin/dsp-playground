import deepmerge from "deepmerge";

// https://stackoverflow.com/questions/41980195/recursive-partialt-in-typescript-2-1
export type RecursivePartial<T> = {
    [P in keyof T]?:
    T[P] extends (infer U)[] ? RecursivePartial<U>[] :
    T[P] extends object ? RecursivePartial<T[P]> :
    T[P];
};

export class Assign {
    // https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
    public static recursive<T>(source: T, change: RecursivePartial<T>): T {
        return deepmerge(source, change as unknown as Partial<T>);
    }
}