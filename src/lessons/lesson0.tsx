import React, { Component } from "react";
import { SignalEditor, TimeDomainCanvas, ComplexCanvas, IWaveEditorConfig, FreqDomainCanvas } from "../components";
import { Generate, Sampling, Signal } from "../lib";
import { LessonParameters } from "./lesson";
import { LessonBase } from "./lesson-base";
import { LessonParametersControl } from "./lesson-parameters-control";

interface IState {
    signal: Signal;
    lessonParameters: LessonParameters;
}

export class Lesson0 extends LessonBase<{}, IState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            lessonParameters: new LessonParameters(),
            signal: new Signal([
                Generate.complexSignal(5, 1),
                Generate.complexSignal(2, 3)
            ])
        }
    }

    renderControls() {
        const { signal, lessonParameters } = this.state;

        const lessonConfig: IWaveEditorConfig = {
            amplitude: { min: 0, max: 10 },
            freqHz: { min: -20, max: 20 },
            phaseRad: { min: 0, max: 2 * Math.PI }
        };

        return (
            <div>
                <LessonParametersControl parameters={lessonParameters} onChange={(p) => this.setState({ lessonParameters: p })} />
                <SignalEditor signal={signal} editorConfig={lessonConfig} onChange={s => this.setState({ signal: s })} />
            </div>
        )
    }

    renderContent() {
        const { signal, lessonParameters } = this.state;
        const { samplingRate, duration, stretch, showWaves } = lessonParameters;
        const samples = Sampling.sample(signal, samplingRate);

        return (
            <div>
                <TimeDomainCanvas signal={signal} samplingRate={samplingRate} duration={duration} />
                <ComplexCanvas signal={signal} samplingRate={samplingRate} duration={duration} stretch={stretch} showWaves={showWaves} />
                <FreqDomainCanvas samples={samples} type={lessonParameters.type} absValues={lessonParameters.absValues} />
            </div>
        );
    }
}