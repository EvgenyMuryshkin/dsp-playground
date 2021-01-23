import React, { Component } from "react";
import { SignalEditor, TimeDomainCanvas, ComplexCanvas } from "../components";
import { TrNumberSlider } from "../components/rows/tr-number-slider";
import { Generate, Signal } from "../lib";
import { LessonParameters } from "./lesson";
import { LessonParametersControl } from "./lesson-parameters-control";

interface IState {
    signal: Signal;
}

interface IState {
    lessonParameters: LessonParameters;
}

export class Lesson1 extends Component<{}, IState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            lessonParameters: new LessonParameters(),
            signal: new Signal([
                Generate.realSignal(5, 1),
                Generate.realSignal(2, 3)
            ])
        }
    }

    render() {
        const { signal, lessonParameters } = this.state;
        const { samplingRate, duration, stretch } = lessonParameters;

        return (
            <div className="lesson-layout">
                <div>
                    <TimeDomainCanvas signal={signal} samplingRate={samplingRate} duration={duration} />
                    <ComplexCanvas signal={signal} samplingRate={samplingRate} duration={duration} stretch={stretch} />
                </div>
                <div>
                    <LessonParametersControl parameters={lessonParameters} onChange={(p) => this.setState({ lessonParameters: p })} />
                    <SignalEditor signal={signal} onChange={s => this.setState({ signal: s })} />
                </div>
            </div>
        )
    }
}