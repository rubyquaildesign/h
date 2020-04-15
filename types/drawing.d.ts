import { Line, Loop, Shape, Pt } from './types';
import * as P from 'd3-path';
export declare function drawLine(line: Line, ctx?: P.Path): string;
export declare function drawLine(line: Line, ctx: CanvasRenderingContext2D): void;
export declare function drawLoop(loop: Loop, close: boolean, ctx?: P.Path): string;
export declare function drawLoop(loop: Loop, close: boolean, ctx: CanvasRenderingContext2D): void;
export declare function drawShape(shape: Shape, ctx?: P.Path): string;
export declare function drawShape(shape: Shape, ctx: CanvasRenderingContext2D): void;
export declare function drawDot(point: Pt, radius: number, ctx: CanvasRenderingContext2D): void;
export declare function drawFauxQuadLoop(loop: Loop, close: boolean, ctx?: P.Path): string;
export declare function drawFauxQuadLoop(loop: Loop, close: boolean, ctx: CanvasRenderingContext2D): void;