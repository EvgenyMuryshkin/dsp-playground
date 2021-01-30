import { IComplexNumber } from "../complex";
import { Filter } from "../filter";
import { Generate } from "../generate";

export enum ftDirection {
    Forward = 1,
    Backward = -1
}

export class FT {
    static CosArray(arrayLength: number, direction: ftDirection) {
        return Generate
            .range(0, arrayLength)
            .map(v => Math.cos(-direction * 2.0 * Math.PI * v / arrayLength));
    }

    static reverse(source: number, bits: number) {
        let result = 0;
        while (bits--) {
            const bit = source & 1;
            result = (result << 1) | bit;
            source = source >> 1;
        }
        return result;
    }

    static mask(bits: number) {
        return ((1 << bits) - 1);
    }

    static normalize(
        source: IComplexNumber[],
        direction: ftDirection) {
        for (let i = 0; i < source.length; i++) {
            if (direction === ftDirection.Forward) {
                source[i] = {
                    r: Filter.valueOrZero(source[i].r / source.length),
                    i: Filter.valueOrZero(source[i].i / source.length)
                }
            }
            else {
                source[i] = {
                    r: Filter.valueOrZero(source[i].r),
                    i: Filter.valueOrZero(source[i].i)
                }
            }
        }
    }


    static valueOrZero(value: number) {
        return Math.abs(value) < 1e-6 ? 0 : value;
    }
}