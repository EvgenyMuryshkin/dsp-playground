import React, { Component } from "react";
import { TrNumberSlider } from "../components/rows/tr-number-slider";
import { Assign } from "../lib";
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

        return (
            <div className="lesson-parameters">
                <table>
                    <tbody>
                        <TrNumberSlider title="Sampling Rate" value={parameters.samplingRate} min={1} max={2048} onChange={v => modifed({ samplingRate: v })} />
                        <TrNumberSlider title="Duration" value={parameters.duration} min={1} max={20} onChange={v => modifed({ duration: v })} />
                        <TrNumberSlider title="Stretch" value={parameters.stretch} min={1} max={20} onChange={v => modifed({ stretch: v })} />
                    </tbody>
                </table>
            </div>
        )
    }
}