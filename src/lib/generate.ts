import { Convert } from "./convert";
import { Wave } from "./wave";

export class Generate {
    static range(from: number, length: number) {
        const result: number[] = [];
        for (let i = 0; i < length; i++) {
            result.push(i + from);
        }
        return result;
    }

    static realSignal(ampl: number, freqHz: number, phaseRad: number | null = null) {
        return new Wave(ampl, freqHz, phaseRad == null ? Convert.deg2rad(270) : phaseRad);
    }
}