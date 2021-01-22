import { Component } from "react";
import { Convert, Generate, Sampling, Signal } from "../../lib";
import "./time-domain-canvas.scss";

interface IProps {
    signal: Signal;
    samplingRate: number;
}

interface IPoint2D {
    x: number;
    y: number;
}

interface IState {
    width: number;
    height: number;
    duration: number;
}

export class TimeDomainCanvas extends Component<IProps, IState> {
    canvas: HTMLCanvasElement | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 1024,
            height: 300,
            duration: 2
        }
    }

    componentDidUpdate() {
        this.drawTimeDomain();
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        const { width, height } = this.state;
        ctx.clearRect(0, 0, width, height);

        ctx.setLineDash([1,2]) 
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height /2);
        ctx.stroke();
        ctx.setLineDash([]); 
    }

    drawTimeDomain() {
        const { width, height, duration} = this.state;

        const { canvas } = this;
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        this.drawGrid(ctx);

        const { signal, samplingRate} = this.props;
        if (!signal) return;
      
        const yAxis = height / 2;

        const dt = duration / samplingRate;
        const values: IPoint2D[] = Generate
            .range(0, samplingRate + 1)
            .map(t => {
                return {
                    x: t,
                    y: Sampling.signalValue(signal, t * dt).r
                }
            }
        );
        
        const maxY = Math.max(...values.map(v => Math.abs(v.y)));
        const maxScaleY = 1; // 10
        const scaleY = Convert.between((yAxis - 10) / maxY, 1, maxScaleY);
        const scaleX = width / samplingRate;

        ctx.lineWidth = 1;
        ctx.imageSmoothingEnabled = true;

        console.log(values);

        const translate = (p: IPoint2D) => {
            return {
                x: scaleX * p.x,
                y: yAxis - scaleY * p.y
            };
        }

        for (const value of values) {
            const from = translate(value);
            ctx.beginPath();
            ctx.arc(from.x, from.y, 1, 0, 2 * Math.PI);
            ctx.stroke();
        }

        ctx.beginPath();

        for (let i = 0; i < values.length - 1; i++) {
            const from = values[i];
            const to = values[i + 1];

            ctx.moveTo(scaleX * from.x, (yAxis - scaleY * from.y));
            ctx.lineTo(scaleX * to.x, (yAxis - scaleY * to.y));
        }

        ctx.stroke();
        ctx.font = "30px Arial";
        ctx.fillText(`Scale: ${scaleY}, dt: ${dt}`, 0, 30);
    }

    render() {
        const { width, height} = this.state;

        return <canvas
            width={width}
            height={height}
            className="time-domain-canvas"
            ref={(r) => {
                this.canvas = r;
                this.drawTimeDomain();
            }}
        />
    }
}