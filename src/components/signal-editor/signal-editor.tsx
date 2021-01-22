import { Component } from "react";
import { Generate, Signal, Wave } from "../../lib";
import { Glyph, WaveEditor } from "..";
import "./signal-editor.scss";

interface IProps {
    signal: Signal;
    onChange: (signal: Signal) => void;
}

export class SignalEditor extends Component<IProps> {
    render() {
        const { signal, onChange } = this.props;
        
        return (
            <div className="signal-editor">
                <table>
                    <tbody>
                        {signal.Waves.map((w, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>
                                        <WaveEditor wave={w} onChange={(wave) => {
                                            const newWaves = [...signal.Waves];
                                            newWaves.splice(idx, 1, wave);
                                            onChange(new Signal(newWaves));
                                        }}/>
                                    </td>
                                    <td>
                                        <Glyph glyph="remove" onClick={() => { 
                                            const newWaves = [...signal.Waves];
                                            newWaves.splice(idx, 1);
                                            onChange(new Signal(newWaves));                                            
                                         }}/>
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td></td>
                            <td>
                                <Glyph glyph="add" onClick={() => { 
                                    const newWaves = [...signal.Waves, Generate.realSignal(10, 0)];
                                    onChange(new Signal(newWaves));                                            
                                }}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}