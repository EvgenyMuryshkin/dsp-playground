import React, { Component } from "react";
import { SignalEditor, TimeDomainCanvas, ComplexCanvas, IWaveEditorConfig, FreqDomainCanvas, SamplingCanvas, DrawingCanvas } from "../components";
import { DFT, FFT, ftDirection, Generate, IPoint2D, Sampling, Signal } from "../lib";
import { IComplexNumber } from "../lib/complex";
import { Filter } from "../lib/filter";
import { LessonParameters } from "./lesson";
import { LessonParametersControl } from "./lesson-parameters-control";


interface IState {
    lessonParameters: LessonParameters;
    samples: IComplexNumber[];
}

export class Lesson3 extends Component<{}, IState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            lessonParameters: new LessonParameters({
                samplingRate: 1024,
                duration: 1,
                stretch: 20
            }),
            samples: Generate.range(0, 1024).map(s => ({ r: 0, i: 0 }))
        }
    }

    render() {
        const { samples, lessonParameters } = this.state;
        const { samplingRate, duration, stretch, showWaves } = lessonParameters;

        const lessonConfig: IWaveEditorConfig = {
            amplitude: { min: 0, max: 10 },
            freqHz: { min: 0, max: 1024 },
            phaseRad: { min: 0, max: 2 * Math.PI }
        };

        const rawSpectre = FFT
            .transform(samples, ftDirection.Forward);
        const reconstructed = FFT.transform(rawSpectre, ftDirection.Backward);

        return (
            <div className="lesson-layout">
                <div>
                    <LessonParametersControl parameters={lessonParameters} onChange={(p) => this.setState({ lessonParameters: p })} />
                </div>
                <div className="lesson-layout-visual">
                    <DrawingCanvas onChange={(p) => {
                        this.setState({
                            samples: p.map((s): IComplexNumber => ({ r: s.y, i: 0 }))
                        })
                    }} />
                    <SamplingCanvas samples={reconstructed} hideMarkers />
                    <FreqDomainCanvas samples={samples} type={lessonParameters.type} absValues={lessonParameters.absValues} />
                </div>
            </div>
        )
    }
}