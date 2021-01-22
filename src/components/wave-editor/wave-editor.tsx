import { Component } from "react";
import { Assign, Convert, Wave } from "../../lib";
import "./wave-editor.scss";

interface IProps {
    wave: Wave;
    onChange: (wave: Wave) => void;
}

export class WaveEditor extends Component<IProps> {
    render() {
        const { wave, onChange } = this.props;
        return (
            <div className="wave-editor">
                <table>
                    <tbody>
                        <tr className="wave-editor-row">
                            <td>Amplitude</td>
                            <td>
                                <input 
                                    type="range" 
                                    value={wave.Amplitude} 
                                    min="0" 
                                    max="100" 
                                    onChange={t => {
                                        const newWave = Assign.recursive(wave, { Amplitude: parseInt(t.target.value) });
                                        onChange(newWave);
                                    }}/>
                            </td>
                            <td>
                                <input 
                                    value={wave.Amplitude} 
                                    type="number"
                                    min="0" 
                                    max="100" 
                                    onChange={t => {
                                        const newWave = Assign.recursive(wave, { Amplitude: parseInt(t.target.value) });
                                        onChange(newWave);
                                    }}/>
                            </td>
                        </tr>
                        <tr className="wave-editor-row">
                            <td>Freq</td>
                            <td>
                                <input 
                                    type="range" 
                                    value={wave.FrequencyHz} 
                                    min="0" 
                                    max="2047" 
                                    onChange={t => {
                                        const newWave = Assign.recursive(wave, { FrequencyHz: parseInt(t.target.value) });
                                        onChange(newWave);
                                    }}/>
                            </td>
                            <td>
                                <input 
                                    value={wave.FrequencyHz} 
                                    type="number"
                                    min="0" 
                                    max="2047" 
                                    onChange={t => {
                                        const newWave = Assign.recursive(wave, { FrequencyHz: parseInt(t.target.value) });
                                        onChange(newWave);
                                    }}/>
                            </td>
                        </tr>
                        <tr className="wave-editor-row">
                            <td>Phase</td>
                            <td>
                                <input 
                                    type="range" 
                                    value={Convert.rad2deg(wave.PhaseRad)} 
                                    min="0" 
                                    max="360" 
                                    onChange={t => {
                                        const newWave = Assign.recursive(wave, { PhaseRad: Convert.deg2rad(parseInt(t.target.value)) });
                                        onChange(newWave);
                                    }}/>
                            </td>
                            <td>
                                <input 
                                    value={Convert.rad2deg(wave.PhaseRad)} 
                                    type="number"
                                    min="0" 
                                    max="360" 
                                    onChange={t => {
                                        const newWave = Assign.recursive(wave, { PhaseRad: Convert.deg2rad(parseInt(t.target.value)) });
                                        onChange(newWave);
                                    }}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
           </div>
        )
    }
}