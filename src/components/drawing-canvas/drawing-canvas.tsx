import { Component } from "react";
import { BufferStream, CanvasTools, Clone, Convert, Generate, IPoint2D, Sampling, Signal } from "../../lib";
import { IComplexNumber } from "../../lib/complex";
import "./drawing-canvas.scss";

interface IProps {
    onChange: (samples: IPoint2D[]) => void;
}

interface IState {
    samples: IPoint2D[];
    width: number;
    height: number;
}

export class DrawingCanvas extends Component<IProps, IState> {
    canvas: HTMLCanvasElement | null = null;
    buffer: BufferStream<IPoint2D> | null = null;

    enabled = false;
    lastPoint: IPoint2D | null = null;

    constructor(props: IProps) {
        super(props);
        this.state = {
            samples: Generate.range(0, 1024).map((i): IPoint2D => ({ x: i, y: 0 })),
            width: 1024,
            height: 300
        }

        this.onMouseUp = this.onMouseUp.bind(this);
        document.addEventListener("mouseup", this.onMouseUp);

        this.processPoints = this.processPoints.bind(this);
        this.buffer = new BufferStream<IPoint2D>(20, this.processPoints);
    }

    componentWillUnmount() {
        document.removeEventListener("mouseup", this.onMouseUp);
    }

    onMouseUp(e: Event) {
        if (!this.enabled) return;

        e.stopPropagation();
        e.preventDefault();
        this.enabled = false;
        this.lastPoint = null;
    }

    componentDidUpdate() {
        this.drawSignal();
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

    translate(p: IPoint2D) {
        const { width, height } = this.state;

        const yAxis = height / 2;

        return {
            x: p.x,
            y: yAxis - p.y
        };
    }

    drawSignal() {
        const { canvas } = this;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        this.drawGrid(ctx);

        const { samples } = this.state;

        ctx.lineWidth = 1;
        ctx.imageSmoothingEnabled = true;

        ctx.beginPath();
        for (let i = 0; i < samples.length - 1; i++) {
            const from = this.translate(samples[i]);
            const to = this.translate(samples[i + 1]);

            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
        }
        ctx.stroke();
    }

    processPoints(points: IPoint2D[]) {
        const { onChange } = this.props;

        for (const pt of points) {
            const { lastPoint } = this;
            if (lastPoint && pt.x !== lastPoint.x) {
                const dx = pt.x - lastPoint.x;
                const dy = pt.y - lastPoint.y;

                Generate
                    .inclusive(lastPoint.x, pt.x)
                    .forEach((i, idx) => {
                        this.state.samples[i].y = lastPoint.y + idx * dy / dx;
                    })

            }
            else {
                this.state.samples[pt.x].y = pt.y;
            }

            this.lastPoint = pt;
        }

        this.drawSignal();
        onChange([...this.state.samples]);
    }

    setPosition(e: React.MouseEvent<HTMLCanvasElement>) {
        if (!this.canvas) return;
        e.stopPropagation();
        e.preventDefault();

        var rect = this.canvas.getBoundingClientRect();
        const pt = this.translate({ x: e.clientX - rect.left, y: e.clientY - rect.top });
        this.buffer?.next(pt);
    }

    render() {
        const { width, height } = this.state;

        return <canvas
            width={width}
            height={height}
            className="drawing-canvas"
            onMouseDown={(e) => {
                this.enabled = true;
                this.setPosition(e);
            }}
            onMouseMove={(e) => {
                if (!this.enabled) return;
                this.setPosition(e);
            }}
            ref={(r) => {
                this.canvas = r;
                this.drawSignal();
            }}
        />
    }
}