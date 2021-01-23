import { Component } from "react";
import { Assign, Convert, Wave } from "../../lib";
import { TrNumberSlider } from "../rows/tr-number-slider";
import "./wave-editor.scss";

interface IProps {
    wave: Wave;
    onChange: (wave: Wave) => void;
}

export class WaveEditor extends Component<IProps> {
    render() {
        const { wave, onChange } = this.props;
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
        return (
            <div className="wave-editor">
                <table>
                    <tbody>
                        <TrNumberSlider title="Amplitude" value={wave.Amplitude} min={0} max={100} onChange={amplitudeChange} />
                        <TrNumberSlider title="Frequency" value={wave.FrequencyHz} min={0} max={2047} onChange={frequencyChange} />
                        <TrNumberSlider title="Phase" value={Convert.rad2deg(wave.PhaseRad)} min={0} max={360} onChange={phaseChange} />
                    </tbody>
                </table>
           </div>
        )
    }
}