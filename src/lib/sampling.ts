import { IComplexNumber } from "./complex";
import { Signal } from "./signal";
import { Wave } from "./wave";

export class Sampling {
    static waveValue(s: Wave, t: number): IComplexNumber {
        const wt = 2 * Math.PI * s.FrequencyHz * t;
        return {
            r: s.Amplitude * Math.cos(s.PhaseRad + wt),
            i: s.Amplitude * Math.sin(s.PhaseRad + wt)
        } 
    }

    static signalValue(s: Signal, t: number): IComplexNumber {
        return s.Waves.reduce((sum, s) => {
            const w = Sampling.waveValue(s, t);
            return {
                r: sum.r + w.r,
                i: sum.i + w.i
            }
        }, { r: 0, i: 0 });
    }
}