import { IComplexNumber } from "./complex";

export class Filter {

    static valueOrZero(value: number, eps: number = 1e-6) {
        return Math.abs(value) < eps ? 0 : value;
    }

    static level(s: IComplexNumber, level: number): IComplexNumber {
        return {
            r: Filter.valueOrZero(s.r, level),
            i: Filter.valueOrZero(s.i, level)
        }
    }
}