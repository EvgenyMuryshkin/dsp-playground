import { ftType } from "../lib";

export class LessonParameters {
    public samplingRate: number = 1024;
    public duration: number = 5;
    public stretch: number = 1;
    public showWaves: boolean = false;
    public type: ftType = ftType.FFT;
    public absValues: boolean = false;

    constructor(init?: Partial<LessonParameters>) {
        init && Object.assign(this, init);
    }
}