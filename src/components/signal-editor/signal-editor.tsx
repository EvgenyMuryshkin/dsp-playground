import { Component } from "react";
import { Generate, Signal } from "../../lib";
import { Glyph, IWaveEditorConfig, WaveEditor } from "..";
import "./signal-editor.scss";

interface IProps {
    signal: Signal;
    editorConfig: IWaveEditorConfig;
    onChange: (signal: Signal) => void;
}

export class SignalEditor extends Component<IProps> {
    render() {
        const { signal, editorConfig, onChange } = this.props;

        return (
            <div className="signal-editor">
                <table>
                    <tbody>
                        {signal.Waves.map((w, idx) => {
                            return (
                                <tr key={idx}>
                                    <td>
                                        <WaveEditor wave={w} editorConfig={editorConfig} onChange={(wave) => {
                                            const newWaves = [...signal.Waves];
                                            newWaves.splice(idx, 1, wave);
                                            onChange(new Signal(newWaves));
                                        }} />
                                    </td>
                                    <td>
                                        <Glyph glyph="remove" onClick={() => {
                                            const newWaves = [...signal.Waves];
                                            newWaves.splice(idx, 1);
                                            onChange(new Signal(newWaves));
                                        }} />
                                    </td>
                                </tr>
                            )
                        })}
                        <tr>
                            <td></td>
                            <td>
                                <Glyph glyph="add" onClick={() => {
                                    const newWaves = [...signal.Waves, Generate.complexSignal(10, 0)];
                                    onChange(new Signal(newWaves));
                                }} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}