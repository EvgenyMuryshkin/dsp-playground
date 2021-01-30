export class Wave {
    constructor(
        public Amplitude: number,
        public FrequencyHz: number,
        public PhaseRad: number,
        public Complex: boolean = true) {

    }
}