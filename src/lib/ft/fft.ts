import { IComplexNumber } from "../complex";
import { Generate } from "../generate";
import { FT, ftDirection } from "./ft";

export class FFT {
    static rotate(
        cosMap: number[],
        bits: number,
        source: IComplexNumber,
        arg: number): IComplexNumber {
        const mask = FT.mask(bits);
        if (bits === 0) {
            return {
                r: source.r,
                i: source.i,
            }
        }
        else {
            let cos = 0, sin = 0;

            const cosIdx = arg & mask;
            const sinIdx = (cosIdx + (cosMap.length >> 2)) & mask;

            cos = cosMap[cosIdx];

            if (bits > 1) {
                sin = cosMap[sinIdx];
            }

            return {
                r: source.r * cos - source.i * sin,
                i: source.r * sin + source.i * cos
            }
        }
    }

    static transform(source: IComplexNumber[], direction: ftDirection): IComplexNumber[] {
        const bits = Math.log2(source.length);
        if (source.length !== 1 << bits) throw new Error(`source length (${source.length}) should be power of 2`);

        const result: IComplexNumber[] = [];
        const length = source.length;
        const cosMap = FT.CosArray(length, direction);

        Generate.range(0, length).forEach(i => {
            result[FT.reverse(i, bits)] = source[i];
        });

        let m = 1;
        let groupSize = length;

        for (let i = 0; i < bits; i++) {
            groupSize = groupSize >> 1;

            for (let group = 0; group < m; group++) {
                const arg = direction * groupSize * group;

                for (let idx = group; idx < length; idx += m * 2) {
                    const eK = result[idx];
                    const oK = result[idx + m];

                    const rotated = FFT.rotate(cosMap, bits, oK, arg);

                    result[idx] = {
                        r: eK.r + rotated.r,
                        i: eK.i + rotated.i
                    };

                    result[idx + m] = {
                        r: eK.r - rotated.r,
                        i: eK.i - rotated.i
                    }
                }
            }
            m = m << 1;
        }

        FT.normalize(result, direction);
        return result;
    }
}