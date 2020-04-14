import { Line } from './types';
import * as P from 'd3-path';
type Drawable = P.Path | CanvasRenderingContext2D;
function isPath(ctx:Drawable): ctx is P.Path {
return !(ctx as CanvasRenderingContext2D).canvas
}
export function drawLine(line:Line): string;
export function drawLine(line:Line,ctx:CanvasRenderingContext2D):void;
export function drawLine(line:Line,ctx:Drawable = P.path()) {
    ctx.moveTo(...line[0]);
    ctx.lineTo(...line[1]);
    if (isPath(ctx)) {
       return ctx.toString()
    }
}