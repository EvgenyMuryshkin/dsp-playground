import { Convert } from "./convert";
import { Wave } from "./wave";

export class Generate {
    static inclusive(from: number, to: number) {
        return from > to
            ? Generate.range(from, to - from - 1)
            : Generate.range(from, to - from + 1)
    }

    static range(from: number, length: number) {
        const result: number[] = [];
        if (length == 0) return [];
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                result.push(i + from);
            }
        }
        else {
            for (let i = 0; i > length; i--) {
                result.push(i + from);
            }
        }
        return result;
    }

    static complexSignal(ampl: number, freqHz: number, phaseRad: number | null = null) {
        return new Wave(ampl, freqHz, phaseRad == null ? Convert.deg2rad(0) : phaseRad);
    }

    static realSignal(ampl: number, freqHz: number, phaseRad: number | null = null) {
        return new Wave(ampl, freqHz, phaseRad == null ? Convert.deg2rad(0) : phaseRad, false);
    }
}