import { Loop } from './types';
/**
 * Creates and iterator walking through the spline of a given loop outputing the points of the new loop
 * @param loop - a loop of Pts to extract a spline from
 * @param degree - the degree of the spline to extract
 * @param close - whether to close the spline or not
 * @param outputResolution - resolution of the output loop
 */
export declare function spline(loop: Loop, degree: number, close: boolean, outputResolution?: number): Generator<import("./types").Pt, void, unknown>;
