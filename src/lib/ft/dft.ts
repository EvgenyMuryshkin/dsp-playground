import { IComplexNumber } from "../complex";
import { FT, ftDirection } from "./ft";

export class DFT {
    static rotateAndAdd(
        source: IComplexNumber,
        target: IComplexNumber,
        arg: number) {

        const sin = Math.sin(arg), cos = Math.cos(arg);
        target.r += source.r * cos - source.i * sin;
        target.i += source.r * sin + source.i * cos;
    }

    static transform(source: IComplexNumber[], direction: ftDirection) {
        const transformed: IComplexNumber[] = [];
        const n = source.length;
        const dt = -direction * Math.PI * 2 / n;

        // for each destination element
        for (let i = 0; i < n; i++) {
            const tmp: IComplexNumber = { r: 0, i: 0 };

            // sum source elements
            for (let j = 0; j < n; j++) {
                DFT.rotateAndAdd(source[j], tmp, i * j * dt);
            }

            transformed[i] = tmp;
        }

        FT.normalize(transformed, direction);

        return transformed;
    }
}