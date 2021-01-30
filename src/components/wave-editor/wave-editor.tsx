import React, { Component } from "react";
import { Assign, Convert, IMinMax, Wave } from "../../lib";
import { TrCheckbox } from "../rows/tr-checkbox";
import { TrNumberSlider } from "../rows/tr-number-slider";
import "./wave-editor.scss";

export interface IWaveEditorConfig {
    amplitude: IMinMax;
    freqHz: IMinMax;
    phaseRad: IMinMax;
}

interface IProps {
    wave: Wave;
    editorConfig: IWaveEditorConfig;
    onChange: (wave: Wave) => void;
}

export class WaveEditor extends Component<IProps> {
    render() {
        const { wave, editorConfig, onChange } = this.props;
        const amplitudeChange = (value: number) => {
            const newWave = Assign.recursive(wave, { Amplitude: value });
            onChange(newWave);
        }
        const frequencyChange = (value: number) => {
            const newWave = Assign.recursive(wave, { FrequencyHz: value });
            onChange(newWave);
        }
        const phaseChange = (value: number) => {
            const newWave = Assign.recursive(wave, { PhaseRad: Convert.deg2rad(value) });
            onChange(newWave);
        }
        const complexChange = (value: boolean) => {
            const newWave = Assign.recursive(wave, { Complex: value });
            onChange(newWave);
        }
        const phaseDeg: IMinMax = {
            min: Convert.rad2deg(editorConfig.phaseRad.min),
            max: Convert.rad2deg(editorConfig.phaseRad.max)
        }
        return (
            <div className="wave-editor">
                <table>
                    <tbody>
                        <TrNumberSlider title="Amplitude" value={wave.Amplitude} minMax={editorConfig.amplitude} onChange={amplitudeChange} />
                        <TrNumberSlider title="Frequency" value={wave.FrequencyHz} minMax={editorConfig.freqHz} onChange={frequencyChange} />
                        <TrNumberSlider title="Phase" value={Convert.rad2deg(wave.PhaseRad)} minMax={phaseDeg} onChange={phaseChange} />
                        <TrCheckbox title="Complex" value={wave.Complex} onChange={complexChange} />
                    </tbody>
                </table>
            </div>
        )
    }
}