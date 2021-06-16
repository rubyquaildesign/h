import interpolate from 'b-spline';
import { range } from 'd3-array';
import { splineToBezier } from './bohm';
import { catmulToBezier, simplifySpline } from './catmull';
/**
 * Creates and iterator walking through the spline of a given loop outputing the points of the new loop
 * @param loop - a loop of Pts to extract a spline from
 * @param degree - the degree of the spline to extract
 * @param close - whether to close the spline or not
 * @param outputResolution - resolution of the output loop
 */
export function* spline(
  loop: Loop,
  degree: number,
  close: boolean,
  outputResolution?: number
) {
  const resolution = outputResolution || loop.length;
  const len = loop.length;
  let toDraw = loop.slice(0);
  let knots: number[] = new Array(degree + 1).fill(0);

  knots.push(...range(0, len - (degree + 1)).map((d) => d + 1));
  knots.push(...new Array(degree + 1).fill(len - degree));
  if (close) {
    toDraw.push(...toDraw.slice(0, degree));
    knots = range(toDraw.length + (degree + 1));
  }
  for (let index = 0; index < resolution; index++) {
    const t = index / resolution;

    yield interpolate(t, degree, toDraw, knots);
  }
  if (!close) yield toDraw[toDraw.length - 1];
}
/**
 * Beziers spline returns a series of beziers representing a spline
 * @param loop spline to return
 * @param [degree] degree of the spline, defaults to 3
 * @param [close] whether the spline should be closed
 * @returns Bezier series
 */
export function bezierSpline(
  loop: Loop,
  degree: number = 3,
  close: boolean = false
): Loop {
  if (degree === 3) {
    return splineToBezier(loop, close);
  } else {
    let cm = simplifySpline(loop, degree, close);
    return catmulToBezier(cm);
  }
}
