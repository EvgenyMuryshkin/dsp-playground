import React, { Component } from "react";
import { TrCheckbox } from "../components";
import { TrNumberSlider } from "../components/rows/tr-number-slider";
import { Assign, ftType } from "../lib";
import { LessonParameters } from "./lesson";
import "./lesson-parameters-control.scss";

interface IProps {
    parameters: LessonParameters;
    onDiff?: (diff: Partial<LessonParameters>) => void;
    onChange?: (parameters: LessonParameters) => void;
}

export class LessonParametersControl extends Component<IProps> {
    render() {
        const { parameters, onDiff, onChange } = this.props;
        const modifed = (diff: Partial<LessonParameters>) => {
            onDiff?.(diff);
            onChange?.(Assign.recursive(parameters, diff));
        };

        var bitsValue = Math.log2(parameters.samplingRate);
        const bits = <TrNumberSlider title="Sampling Bits 2 ^ " value={bitsValue} minMax={({ min: 1, max: 11 })} onChange={v => modifed({ samplingRate: Math.pow(2, v) })} />
        const samples = <TrNumberSlider title="Sampling Rate" value={parameters.samplingRate} minMax={({ min: 1, max: 2048 })} onChange={v => modifed({ samplingRate: v })} />

        return (
            <div className="lesson-parameters">
                <table>
                    <tbody>
                        {parameters.type == ftType.FFT && bits}
                        {parameters.type == ftType.DFT && samples}
                        <TrNumberSlider title="Duration" value={parameters.duration} minMax={({ min: 1, max: 20 })} onChange={v => modifed({ duration: v })} />
                        <TrNumberSlider title="Stretch" value={parameters.stretch} minMax={({ min: 1, max: 20 })} onChange={v => modifed({ stretch: v })} />
                        <TrCheckbox title="Show Waves" value={parameters.showWaves} onChange={v => modifed({ showWaves: v })} />
                        <TrCheckbox title="Abs Values" value={parameters.absValues} onChange={v => modifed({ absValues: v })} />
                    </tbody>
                </table>
            </div>
        )
    }
}