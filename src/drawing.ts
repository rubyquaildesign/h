import { Line, Loop, Shape, Pt } from './types';
import * as M from './maths';
import * as P from 'd3-path';
type Drawable = P.Path | CanvasRenderingContext2D;
function isCtx(ctx: Drawable): ctx is CanvasRenderingContext2D {
    return ctx instanceof CanvasRenderingContext2D;
}
export function drawLine(line: Line, ctx?: P.Path): string;
export function drawLine(line: Line, ctx: CanvasRenderingContext2D): void;
export function drawLine(line: Line, ctx: Drawable = P.path()) {
    ctx.moveTo(...line[0]);
    ctx.lineTo(...line[1]);
    if (!isCtx(ctx)) {
        return ctx.toString();
    }
}

export function drawLoop(loop: Loop, close: boolean, ctx?: P.Path): string;
export function drawLoop(
    loop: Loop,
    close: boolean,
    ctx: CanvasRenderingContext2D
): void;
export function drawLoop(loop: Loop, close: boolean, ctx: Drawable = P.path()) {
    const toDraw = loop.slice();
    const start = toDraw.shift();

    ctx.moveTo(...start);

    toDraw.forEach((pt) => ctx.lineTo(...pt));
    if (close) ctx.closePath();
    if (!isCtx(ctx)) return ctx.toString();

    return;
}

export function drawShape(shape: Shape, ctx?: P.Path): string;
export function drawShape(shape: Shape, ctx: CanvasRenderingContext2D): void;
export function drawShape(shape: Shape, ctx: Drawable = P.path()) {
    if (isCtx(ctx)) ctx.beginPath();
    shape.forEach((loop) => drawLoop(loop, true, ctx));
    if (!isCtx(ctx)) return ctx.toString();

    return;
}
export function drawDot(
    point: Pt,
    radius: number,
    ctx: CanvasRenderingContext2D
) {
    const [x, y] = point;

    ctx.beginPath();
    ctx.ellipse(x, y, radius, radius, 0, 0, M.TAU);
    ctx.closePath();
}
// TODO: Solve the equation to generate a mid point from the 2nd last point and the 2nd point for a closing loop
export function drawFauxQuadLoop(
    loop: Loop,
    close: boolean,
    ctx?: P.Path
): string;
export function drawFauxQuadLoop(
    loop: Loop,
    close: boolean,
    ctx: CanvasRenderingContext2D
): void;
export function drawFauxQuadLoop(
    loop: Loop,
    close: boolean,
    ctx: Drawable = P.path()
) {
    const toDraw = loop.slice();

    if (toDraw.length % 2 && close) {
    }
}
