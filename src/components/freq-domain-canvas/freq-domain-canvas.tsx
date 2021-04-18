import { Component } from "react";
import { Context } from "vm";
import { CanvasTools, Convert, DFT, FFT, ftDirection, ftType, Generate, IPoint2D, Sampling, Signal } from "../../lib";
import { IComplexNumber } from "../../lib/complex";
import "./freq-domain-canvas.scss";

interface IProps {
    samples: IComplexNumber[];
    type: ftType;
    absValues: boolean;
}

interface IFreq2D {
    x: number;
    f: IComplexNumber;
}

interface IState {
    width: number;
    height: number;
}

export class FreqDomainCanvas extends Component<IProps, IState> {
    rCanvas: HTMLCanvasElement | null = null;
    iCanvas: HTMLCanvasElement | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
            width: 1024,
            height: 300
        }
    }

    componentDidUpdate() {
        this.drawFreqDomain();
    }

    drawGrid(ctx: CanvasRenderingContext2D) {
        const { width, height } = this.state;
        ctx.clearRect(0, 0, width, height);

        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.strokeStyle = "#000000";
        ctx.stroke();

        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, height);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
    }

    drawFreqDomain() {
        const { type, absValues } = this.props;
        const { width, height } = this.state;
        const { rCanvas, iCanvas } = this;

        const rCtx = rCanvas?.getContext("2d");
        const iCtx = iCanvas?.getContext("2d");

        rCtx && this.drawGrid(rCtx);
        iCtx && this.drawGrid(iCtx);

        const { samples } = this.props;
        if (!samples) return;

        const yAxis = height / 2;
        const rawSpectre = type == ftType.DFT
            ? DFT.transform(samples, ftDirection.Forward)
            : FFT.transform(samples, ftDirection.Forward);

        console.log("Raw spectre:", rawSpectre);

        const samplingRate = samples.length;
        // place negative freqs to the left
        const fft = [...rawSpectre.slice(samplingRate / 2, samplingRate), ...rawSpectre.slice(0, (samplingRate / 2))];

        if (fft.length != rawSpectre.length) throw new Error("fft length is screwed up");

        const rawSpectrePart = (
            ctx: CanvasRenderingContext2D,
            source: IComplexNumber[],
            data: (v: IComplexNumber) => number) => {

            const maxY = Math.max(...fft.map(v => data(v)));
            const minY = Math.min(...fft.map(v => data(v)));
            const absMaxY = Math.max(Math.abs(maxY), Math.abs(minY));

            const maxScaleY = yAxis - 25;
            const scaleY = Convert.between((yAxis - 25) / absMaxY, 0.1, maxScaleY);
            const scaleX = width / samplingRate;

            ctx.lineWidth = 1;
            ctx.imageSmoothingEnabled = true;

            const translate = (x: number, p: IComplexNumber): IPoint2D => {
                return {
                    x: scaleX * x,
                    y: yAxis - scaleY * data(p)
                };
            }

            ctx.beginPath();

            for (let i = 0; i < source.length; i++) {
                const from = translate(i, { r: 0, i: 0 });
                const to = translate(i, source[i]);

                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
            }

            ctx.strokeStyle = "#ff0000";
            ctx.stroke();

            const maxLine = translate(0, { r: maxY, i: maxY });
            CanvasTools.drawMaxLine(ctx, maxY, maxLine.y, width);

            const minLine = translate(0, { r: minY, i: minY });
            CanvasTools.drawMinLine(ctx, minY, minLine.y, width);
        }

        if (rCtx && absValues) {
            rawSpectrePart(rCtx, fft, p => Math.sqrt(p.r * p.r + p.i * p.i));
        }
        else if (rCtx && iCtx) {
            // real part of spectre
            rawSpectrePart(rCtx, fft, p => p.r);

            // im part of spectre
            rawSpectrePart(iCtx, fft, p => p.i);
        }
    }

    render() {
        const { absValues } = this.props;
        const { width, height } = this.state;

        if (absValues) {
            return (
                <div>
                    <div>Abs</div>
                    <canvas
                        width={width}
                        height={height}
                        className="freq-domain-canvas"
                        ref={(r) => {
                            this.rCanvas = r;
                            this.drawFreqDomain();
                        }}
                    />
                </div>
            )
        }
        else {
            return (
                <div>
                    <div>Re</div>
                    <canvas
                        width={width}
                        height={height}
                        className="freq-domain-canvas"
                        ref={(r) => {
                            this.rCanvas = r;
                            this.drawFreqDomain();
                        }}
                    />
                    <div>Im</div>
                    <canvas
                        width={width}
                        height={height}
                        className="freq-domain-canvas"
                        ref={(r) => {
                            this.iCanvas = r;
                            this.drawFreqDomain();
                        }}
                    />
                </div>
            )
        }
    }
}