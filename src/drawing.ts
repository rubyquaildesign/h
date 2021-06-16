import * as M from './maths';
import * as P from 'd3-path';
type Drawable = P.Path | CanvasRenderingContext2D;
function isCtx(ctx: Drawable): ctx is CanvasRenderingContext2D {
  if (typeof window === 'undefined') return false;

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

export function drawLoop(
  loop: Loop | Iterable<Pt>,
  close: boolean,
  ctx?: P.Path
): string;
export function drawLoop(
  loop: Loop | Iterable<Pt>,
  close: boolean,
  ctx: CanvasRenderingContext2D
): void;
export function drawLoop(
  loop: Loop | Iterable<Pt>,
  close: boolean,
  ctx: Drawable = P.path()
) {
  let count = 0;

  for (const point of loop) {
    if (count < 1) ctx.moveTo(...point);
    else ctx.lineTo(...point);
    count++;
  }
  if (close) ctx.closePath();
  if (!isCtx(ctx)) return ctx.toString();

  return;
}
export function drawBezierLoop(
  loop: Loop,
  close: boolean,
  ctx?: P.Path
): string;
export function drawBezierLoop(
  loop: Loop,
  close: boolean,
  ctx: CanvasRenderingContext2D
): void;
export function drawBezierLoop(
  loop: Loop,
  close: boolean,
  ctx: Drawable = P.path()
) {
  for (let i = 0; i <= loop.length - 3; i += 4) {
    if (i === 0) ctx.moveTo(...loop[0]);
    else ctx.lineTo(...loop[i]);
    ctx.bezierCurveTo(...loop[i + 1], ...loop[i + 2], ...loop[i + 3]);
  }
  if (close) ctx.closePath();
  if (!isCtx(ctx)) return ctx.toString();
}
export function drawShape(shape: Shape, ctx?: P.Path): string;
export function drawShape(shape: Shape, ctx: CanvasRenderingContext2D): void;
export function drawShape(shape: Shape, ctx: Drawable = P.path()) {
  if (isCtx(ctx)) ctx.beginPath();
  shape.forEach((loop) => drawLoop(loop, true, ctx));
  if (!isCtx(ctx)) return ctx.toString();

  return;
}
export function drawBezierShape(shape: Shape, ctx?: P.Path): string;
export function drawBezierShape(
  shape: Shape,
  ctx: CanvasRenderingContext2D
): void;
export function drawBezierShape(shape: Shape, ctx: Drawable = P.path()) {
  if (isCtx(ctx)) ctx.beginPath();
  shape.forEach((loop) => drawBezierLoop(loop, true, ctx));
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
// ? FUTURE ABILITY Solve the equation to generate a mid point from the 2nd last point and the 2nd point for a closing loop
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
  const ptsNo = toDraw.length;

  if (close && ptsNo % 2)
    throw new Error(
      `in order to close a Faux quad loop, there needs to be an even number of input points. ${ptsNo} points where put in`
    );
  if (!close && !(ptsNo % 2))
    throw new Error(
      `in order to draw a open Faux quad loop, there needs to be an odd number of input points. ${ptsNo} points where put in`
    );
  const start = toDraw.shift();

  if (close) toDraw.push(start!);
  ctx.moveTo(...start!);
  for (let i = 0; i < toDraw.length; i += 2) {
    const [x1, y1, x2, y2] = [...toDraw[i], ...toDraw[i + 1]];

    ctx.quadraticCurveTo(x1, y1, x2, y2);
  }
  if (!isCtx(ctx)) return ctx.toString();
}

export function drawFauxCubicLoop(
  loop: Loop,
  close: boolean,
  ctx?: P.Path
): string;
export function drawFauxCubicLoop(
  loop: Loop,
  close: boolean,
  ctx: CanvasRenderingContext2D
): void;
export function drawFauxCubicLoop(
  loop: Loop,
  close: boolean,
  ctx: Drawable = P.path()
) {
  const toDraw = loop.slice();
  const inputLength = toDraw.length;
  const start = toDraw.shift();

  if (close) toDraw.push(start!);
  ctx.moveTo(...start!);
  let lasti = 0;

  for (let i = 0; i < inputLength - 2; i++) {
    const [x1, y1, x2, y2, x3, y3] = [
      ...toDraw[i],
      ...toDraw[i + 1],
      ...toDraw[i + 2],
    ];

    ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    lasti = i + 3;
  }
  switch (inputLength - lasti) {
    case 1:
      ctx.lineTo(...toDraw[lasti]);
      break;
    case 2:
      const [x1, y1] = toDraw[lasti];
      const [x2, y2] = toDraw[lasti + 1];

      ctx.quadraticCurveTo(x1, y1, x2, y2);
      break;
    default:
      break;
  }
  if (!isCtx(ctx)) return ctx.toString();
}
