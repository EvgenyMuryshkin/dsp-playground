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
        const sign = Math.sign(wave.FrequencyHz) || 1;
        const freq = sign * Math.floor(Math.abs(wave.FrequencyHz));
        const fraction = Math.abs(wave.FrequencyHz % 1)

        const amplitudeChange = (value: number) => {
            const newWave = Assign.recursive(wave, { Amplitude: value });
            onChange(newWave);
        }

        const frequencyChange = (value: number) => {
            const newWave = Assign.recursive(wave, { FrequencyHz: value + sign * fraction });
            onChange(newWave);
        }
        const frequencyFractionChange = (value: number) => {
            const newWave = Assign.recursive(wave, { FrequencyHz: value * sign + freq });
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
                        <TrNumberSlider title="Frequency, Hz" value={freq} minMax={editorConfig.freqHz} onChange={frequencyChange} />
                        <TrNumberSlider title="Frequency Fraction" value={fraction} minMax={{ min: 0, max: 0.99 }} step={0.01} onChange={frequencyFractionChange} />
                        <TrNumberSlider title="Phase, Deg" value={Convert.rad2deg(wave.PhaseRad)} minMax={phaseDeg} onChange={phaseChange} />
                        <TrCheckbox title="Complex" value={wave.Complex} onChange={complexChange} />
                    </tbody>
                </table>
            </div>
        )
    }
}