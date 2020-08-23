import interpolate from 'b-spline';
import { range } from 'd3-array';
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
  let knots = range(len - (degree + 1));

  knots.push(...new Array<number>(degree + 1).fill(knots.length));
  knots.unshift(...new Array<number>(degree + 1).fill(0));
  if (close) {
    toDraw.push(...toDraw.slice(0, degree + 1));
    knots = range(toDraw.length + (degree + 1));
  }
  for (let index = 0; index < resolution; index++) {
    const t = index / resolution;

    yield interpolate(t, degree, toDraw, knots);
  }
}
