import React, { Component } from "react";
import { SignalEditor, TimeDomainCanvas, ComplexCanvas, IWaveEditorConfig, FreqDomainCanvas, SamplingCanvas } from "../components";
import { DFT, FFT, ftDirection, Generate, Sampling, Signal } from "../lib";
import { LessonParameters } from "./lesson";
import { LessonParametersControl } from "./lesson-parameters-control";

interface IState {
    signal: Signal;
    lessonParameters: LessonParameters;
}

export class Lesson2 extends Component<{}, IState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            lessonParameters: new LessonParameters({
                samplingRate: 1024,
                duration: 1,
                stretch: 20
            }),
            signal: new Signal([
                Generate.realSignal(5, 10)
            ])
        }
    }

    render() {
        const { signal, lessonParameters } = this.state;
        const { samplingRate, duration, stretch, showWaves } = lessonParameters;

        const lessonConfig: IWaveEditorConfig = {
            amplitude: { min: 0, max: 10 },
            freqHz: { min: -1024, max: 1024 },
            phaseRad: { min: 0, max: 2 * Math.PI }
        };

        const samples = Sampling.sample(signal, samplingRate);

        const rawSpectre = FFT.transform(samples, ftDirection.Forward);
        const reconstructed = FFT.transform(rawSpectre, ftDirection.Backward);

        console.log("Samples:", samples);
        console.log("Reconstructed:", reconstructed);
        return (
            <div className="lesson-layout">
                <div>
                    <LessonParametersControl parameters={lessonParameters} onChange={(p) => this.setState({ lessonParameters: p })} />
                    <SignalEditor signal={signal} editorConfig={lessonConfig} onChange={s => this.setState({ signal: s })} />
                </div>
                <div className="lesson-layout-visual">
                    <TimeDomainCanvas signal={signal} samplingRate={samplingRate} duration={duration} />
                    {/*
                    <ComplexCanvas signal={signal} samplingRate={samplingRate} duration={duration} stretch={stretch} showWaves={showWaves} />
                    <FreqDomainCanvas samples={samples} />
                    */}
                    <SamplingCanvas samples={reconstructed} />
                </div>
            </div>
        )
    }
}