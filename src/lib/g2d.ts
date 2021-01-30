export interface IPoint2D {
    x: number;
    y: number;
}

export class CanvasTools {
    static drawMinLine(ctx: CanvasRenderingContext2D, minY: number, y: number, width: number) {
        ctx.beginPath()
        ctx.setLineDash([1, 2])
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.setLineDash([])
        ctx.font = "20px Arial";
        ctx.fillText(`${minY.toPrecision(3)}`, 0, y + 20);
    }

    static drawMaxLine(ctx: CanvasRenderingContext2D, maxY: number, y: number, width: number) {
        ctx.beginPath()
        ctx.setLineDash([1, 2])
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.strokeStyle = "#000000";
        ctx.stroke();
        ctx.setLineDash([])
        ctx.font = "20px Arial";
        ctx.fillText(`${maxY.toPrecision(3)}`, 0, y - 5);
    }
}