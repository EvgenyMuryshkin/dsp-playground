import { Component } from "react";
import { CanvasTools, Convert, Generate, IPoint2D, Sampling, Signal } from "../../lib";
import { IComplexNumber } from "../../lib/complex";
import "./sampling-canvas.scss";

interface IProps {
    samples: IComplexNumber[],
    hideMarkers?: boolean;
}

interface IState {
    width: number;
    height: number;
}

export class SamplingCanvas extends Component<IProps, IState> {
    canvas: HTMLCanvasElement | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 1024,
            height: 300
        }
    }

    componentDidUpdate() {
        this.drawTimeDomain();
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        const { width, height } = this.state;
        ctx.clearRect(0, 0, width, height);

        ctx.setLineDash([1, 2])
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawTimeDomain() {
        const { width, height } = this.state;

        const { canvas } = this;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        this.drawGrid(ctx);

        const { samples, hideMarkers } = this.props;
        if (!samples) return;

        const yAxis = height / 2;

        const values = samples.map((s, idx): IPoint2D => ({
            x: idx,
            y: s.r
        }))

        const maxY = Math.max(...values.map(v => v.y));
        const minY = Math.min(...values.map(v => v.y));
        const absMaxY = Math.max(Math.abs(maxY), Math.abs(minY));

        const maxScaleY = 30;
        const scaleY = Convert.between((yAxis - 20) / absMaxY, 1, maxScaleY);
        const scaleX = width / samples.length;

        ctx.lineWidth = 1;
        ctx.imageSmoothingEnabled = true;

        const translate = (p: IPoint2D) => {
            return {
                x: scaleX * p.x,
                y: yAxis - scaleY * p.y
            };
        }

        // sampling markers
        if (!hideMarkers) {
            for (const value of values) {
                const from = translate(value);
                ctx.beginPath();
                ctx.arc(from.x, from.y, 1, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }

        ctx.beginPath();
        for (let i = 0; i < values.length - 1; i++) {
            const from = translate(values[i]);
            const to = translate(values[i + 1]);

            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
        }
        ctx.stroke();

        const maxLine = translate({ x: maxY, y: maxY });
        CanvasTools.drawMaxLine(ctx, absMaxY, maxLine.y, width);

        const minLine = translate({ x: minY, y: minY });
        CanvasTools.drawMinLine(ctx, minY, minLine.y, width);

        ctx.font = "15px Arial";
        const scaleText = `Scale: ${scaleY}`;
        const measure = ctx.measureText(scaleText);
        ctx.fillText(scaleText, width - measure.width, 15);
    }

    render() {
        const { width, height } = this.state;

        return <canvas
            width={width}
            height={height}
            className="sampling-canvas"
            ref={(r) => {
                this.canvas = r;
                this.drawTimeDomain();
            }}
        />
    }
}