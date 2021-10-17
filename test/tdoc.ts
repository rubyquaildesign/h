import * as h from '../src/main';
import {interpolateRainbow} from 'd3'
const cv = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = cv.getContext('2d');

ctx.fillRect(0, 0, 400, 400);
const testPoints = [
  [50, 200],
  [100, 150],
  [100, 250],
  [200, 100],
  [250, 300],
  [300, 50],
  [350, 350],
].map((v) => new h.Vec(v));
ctx.fillStyle = 'white';

ctx.lineWidth = 3;
ctx.strokeStyle = '#aaa';


testPoints.map((pt) => {
  h.drawDot(pt, 3, ctx);
  ctx.fill();
});
for (let t = 0; t <= 1; t += 0.05) {
  ctx.fillStyle = interpolateRainbow(t)
  const pt = h.Vec.bernsteinCubicBezierCurve(testPoints.slice(0, 4), t);
  ctx.beginPath();
  h.drawDot(pt, 2, ctx);
  ctx.fill();
  const pt2 = pt.add(h.Vec.cubicBezierCurveDerivitive(testPoints.slice(0, 4), t).rotate(h.PI / 2).norm().mulScaler(15))
  ctx.beginPath();
  h.drawDot(pt2, 2, ctx);
  ctx.fill();
}
ctx.translate(100, 400);

for (let t = 0; t <= 1; t += 0.005) {
  ctx.fillStyle = interpolateRainbow(t)
  const pt = h.Vec.cubicBezierCurveDerivitive(testPoints.slice(0, 4), t);
  ctx.beginPath();
  h.drawDot(pt, 2, ctx);
  ctx.fill();
}
