import interpolate from 'b-spline';

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
  const toDraw = loop.slice(0);

  if (close) {
    const endSize = Math.min(len, degree + 1);
    const lookFwrd = toDraw.slice(0, endSize);

    toDraw.push(...lookFwrd);
  }
  for (let index = 0; index < resolution; index++) {
    const t = index / resolution;

    yield interpolate(t, degree, toDraw);
  }
}
