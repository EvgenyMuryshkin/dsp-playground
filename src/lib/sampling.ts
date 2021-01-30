import { IComplexNumber } from "./complex";
import { Generate } from "./generate";
import { Signal } from "./signal";
import { Wave } from "./wave";

export class Sampling {
    static waveValue(s: Wave, t: number): IComplexNumber {
        const wt = 2 * Math.PI * s.FrequencyHz * t;
        return {
            r: s.Amplitude * Math.cos(s.PhaseRad + wt),
            i: s.Complex ? s.Amplitude * Math.sin(s.PhaseRad + wt) : 0
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

    static sample(signal: Signal, samplingRate: number, duration: number = 1) {
        const dt = 1 / samplingRate;
        const samples = Generate
            .range(0, duration * samplingRate)
            .map(t => Sampling.signalValue(signal, t * dt));
        return samples;
    }
}