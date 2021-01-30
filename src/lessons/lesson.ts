export class LessonParameters {
    constructor(
        public samplingRate: number = 1024,
        public duration: number = 5,
        public stretch: number = 1,
        public showWaves: boolean = false) {

    }
}