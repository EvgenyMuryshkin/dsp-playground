import { Component } from "react";
import { SignalEditor, TimeDomainCanvas } from "../components";
import { Convert, Generate, Signal, Wave } from "../lib";

interface IState {
    signal: Signal;
}

interface IState {
    samplingRate: number;
}

export class Lesson1 extends Component<{}, IState> {
    constructor(props: {}) {
        super(props)
        this.state = {
            samplingRate: 1024,
            signal: new Signal([
                Generate.realSignal(50, 1),
                Generate.realSignal(20, 3)
            ])
        }
    }

    render() {
        const { signal, samplingRate } = this.state;
        
        return (
            <div>
                <SignalEditor signal={signal} onChange={s => this.setState({ signal: s })}/>
                <div>
                    <input 
                        type="number" 
                        min={1}
                        value={samplingRate} 
                        onChange={e => this.setState({ samplingRate: parseInt(e.target.value) })}/>
                </div>
                <TimeDomainCanvas signal={signal} samplingRate={samplingRate} />
            </div>
        )
    }
}