import { spline } from './spline';

function ptAdd(ptA: Pt, ptB: Pt) {
  return [ptA[0] + ptB[0], ptA[1] + ptB[1]] as Pt;
}
function ptSub(ptA: Pt, ptB: Pt) {
  return [ptA[0] - ptB[0], ptA[1] - ptB[1]] as Pt;
}

function ptScalDiv(s: number, pt: Pt): Pt {
  return [pt[0] / s, pt[1] / s];
}

export function simplifySpline(
  pts: Loop,
  degree: number,
  close: boolean = false,
  numPts?: number
): Loop {
  numPts ??= pts.length;
  if (degree >= pts.length)
    throw new RangeError(
      `degree ${degree} is larger then the pts length of ${pts.length}`
    );
  let splinePoints = [...spline(pts, degree, false, numPts)];
  if (close)
    return [
      splinePoints[numPts - 1],
      ...splinePoints,
      ...splinePoints.slice(0, 2),
    ];
  // p0;
  const p0 = splinePoints[0];
  const p1 = splinePoints[1];
  let dy0 = p1[1] - p0[1];
  let dx0 = p1[0] - p0[0];
  let ang0 = Math.atan2(dy0, dx0) + Math.PI;
  const p00: Pt = [Math.cos(ang0), Math.sin(ang0)];

  const pn = splinePoints[numPts];
  const pn1 = splinePoints[numPts - 1];
  let dy1 = pn1[1] - pn[1];
  let dx1 = pn1[0] - pn[0];
  let angn = Math.atan2(dy1, dx1) + Math.PI;
  const pnn: Pt = [Math.cos(angn), Math.sin(angn)];

  return [p00, ...splinePoints, pnn];
}
function bezierCurve(p1: Pt, p2: Pt, p3: Pt, p4: Pt): BezierCurve {
  return [
    p2,
    ptAdd(p2, ptScalDiv(6, ptSub(p3, p1))),
    ptAdd(p3, ptScalDiv(6, ptSub(p4, p2))),
    p3,
  ];
}
export function catmulToBezier(pts: Loop): Loop {
  let output: Array<Pt[]> = [];
  for (let i = 0; i < pts.length - 4; i++) {
    let [a, b, c, d] = pts.slice(i, i + 4);
    let cv = bezierCurve(a, b, c, d);
    if (i===0)
    output.push(cv); else output.push(cv.slice(1,4))
  }
  return output.flat();
}
