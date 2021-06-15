import { range } from 'd3-array';
/*
polar form beziers are represented as forms from a to be, eg
deg2 = (a,a),(a,b),(b,b).
deg3 = (a,a,a),(a,a,b),(a,b,b),(b,b,b)
a point on a bezier of t would be equal to (t,t,t)

for a b-spline of degree n, with a knot vector consisting of inceasing knots, the polar value arguements consist of groups of n adjacent knots. eg for a deg3 b-spline, it's first value would be (0,1,2), next would be (1,2,3) etc

argument order doesn't matter

for any single polar point, changing one argument can be calualted if you know two other points, eg deg2 (0,a) and (0,b) point (0,c) will equal( (b - c) * (0,a) + (c - a) * (0,b) ) / (b - a)

a knot vector is a series of knots that specify the intervals for bezier curves that make up b-splines, there are always n-1 knots appended to both ends of the knot vector

*/
function ptScalAdd(s: number, pt: Pt) {
  return [pt[0] + s, pt[1] + s] as Pt;
}
function ptScalDiv(s: number, pt: Pt) {
  return [pt[0] / s, pt[1] / s];
}
function ptScalMult(s: number, pt: Pt) {
  return pt.map((d) => d * s) as Pt;
}
function ptAdd(ptA: Pt, ptB: Pt) {
  return [ptA[0] + ptB[0], ptA[1] + ptB[1]] as Pt;
}
function ptSub(ptA: Pt, ptB: Pt) {
  return [ptA[0] - ptB[0], ptA[1] - ptB[1]] as Pt;
}
function computeAffine(ptA: Pt, ptB: Pt, a: number, b: number, c: number) {
  let top = ptAdd(ptScalMult(b - c, ptA), ptScalMult(c - a, ptB));
  return ptScalDiv(b - a, top) as Pt;
}
function splineSegToBezier(
  a: number,
  b: number,
  c: number,
  d: number,
  controlPoints: Pt[]
) {
  const Xab = controlPoints[a];
  const abc = controlPoints[b];
  const bcd = controlPoints[c];
  const cdY = controlPoints[d];
  let bbb: Pt;
  let ccc: Pt;
  let abb: Pt;
  let ccd: Pt;
  let bbc: Pt;
  let bcc: Pt;
  bbc = computeAffine(abc, bcd, a, d, b);
  bcc = computeAffine(abc, bcd, a, d, c);
  abb = computeAffine(Xab, abc, a - 1, c, b);
  ccd = computeAffine(bcd, cdY, b, d + 1, c);
  bbb = computeAffine(abb, bbc, a, c, b);
  ccc = computeAffine(bcc, ccd, b, d, c);
  return [bbb, bbc, bcc, ccc] as BezierCurve;
}
let testPoints = [
  [1.5, 0.5],
  [0.5, 0],
  [-0.5, 0.5],
  [0.5, 1.5],
  [1.5, 0.5],
  [0.5, 0],
  [-0.5, 0.5],
  [0.5, 1.5],
] as Pt[];
console.log(splineSegToBezier(0, 1, 2, 3, testPoints));
console.log(splineSegToBezier(1, 2, 3, 4, testPoints));
console.log(splineSegToBezier(2, 3, 4, 5, testPoints));
console.log(splineSegToBezier(3, 4, 5, 6, testPoints));
export function splineToBezier(pts: Loop, close: boolean = false): Loop {
  if (pts.length < 4) throw new Error('too few points for spline');
  let cp = [...pts];
  if (close) {
    cp.push(...pts.slice(0, 3));
  } else {
    let n = pts[pts.length - 1];
    cp.unshift(pts[0], pts[0]);
    cp.push(n, n);
  }
  let output: (BezierCurve | Pt[])[] = [];
  for (let i = 0; i < cp.length - 4; i++) {
    const bz = splineSegToBezier(i, i + 1, i + 2, i + 3, cp);
    if (i === 0) output.push(bz);
    else output.push(bz.slice(1, 4));
  }
  return output.flat();
}
