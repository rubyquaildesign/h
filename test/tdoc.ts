import {
  randomUniform,
  Delaunay,
  polygonCentroid,
  interpolateCividis,
  interpolateInferno,
  interpolateRainbow,
  scaleLinear,
} from 'd3';
import * as h from '../src/main';
import { iterate } from 'iterare';

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
const ctx = canvas.getContext('2d');
const width = 1080;
const height = 1920;
canvas.width = width;
canvas.height = height;
const pointCount = 512;
ctx.fillStyle = '#2d2a2e';
ctx.fillRect(0, 0, width, height);
const randWid = randomUniform(width);
const randHei = randomUniform(height);
const ptsIter = iterate(new Float32Array(pointCount * 2)).map((i) =>
  i % 2 ? randHei() : randWid(),
);
const ptsArr = new Float32Array(ptsIter);
const del = new Delaunay(ptsArr);
const v = del.voronoi([0, 0, width, height]);

for (let relaxCount = 0; relaxCount < 128; relaxCount++) {
  iterate(v.cellPolygons())
    .map((vp) => {
      const [x, y] = polygonCentroid(vp as any);
      ptsArr.set([x, y], vp.index * 2);
    })
    .forEach(() => 0);
  v.update();
}

// ctx.beginPath();
// v.render(ctx);
// ctx.stroke();

function sample<T>(obj: ArrayLike<T>) {
  return obj[Math.floor(Math.random() * obj.length)];
}
function weightedChoice<T>(choices: [T, number][]) {
  const weights = choices.map(([_, w]) => w);
  let target = weights.reduce((a, b) => a + b, 0) * Math.random();
  for (const [value, weight] of choices) {
    target -= weight;
    if (target < 0) {
      return value;
    }
  }
}
const weight = iterate(v.cellPolygons())
  .map((pg) => {
    return {
      pg,
      point: new h.Vec(
        Array.from(ptsArr.slice(pg.index * 2, pg.index * 2 + 2)),
      ),
    };
  })
  .map(({ pg, point }) => {
    const d = point.dist([width / 2, height / 2]);
    const t = scaleLinear([0, (width / 2) * Math.SQRT2], [0, 1]).clamp(true)(d);
    const col = interpolateRainbow(t);
    ctx.fillStyle = col;
    // ctx.beginPath();
    // h.drawLoop(pg, true, ctx);
    // ctx.fill();
    return t;
  })
  .toArray();
const start = sample(del.hull);
const full: number[] = [];
function continueLine(visitedSoFar: number[]): number[] {
  const thisI = visitedSoFar[visitedSoFar.length - 1];
  full.push(thisI);
  const n = v.neighbors(thisI);
  const options = iterate(n)
    .filter((element) => !del.hull.includes(element))
    .filter((element) => !visitedSoFar.includes(element))
    .filter((pointI) => !full.includes(pointI))
    .map((element) => [element, weight[element]] as [number, number])
    .map(
      ([v, w]) => [v, del.hull.includes(v) ? 1 / 1000 : w] as [number, number],
    )
    .toArray();
  if (options.length === 0) return visitedSoFar;
  const next = weightedChoice(options);

  return continueLine([...visitedSoFar, next]);
}

ctx.strokeStyle = '#a9dc76';
ctx.lineWidth = 4;
const lines: number[][] = [];
let availablePts = del.hull.filter((pt) => !full.includes(pt));
while (availablePts.length) {
  console.log(availablePts.length);

  const st = sample(availablePts);
  lines.push(continueLine([st]));
  availablePts = availablePts.filter((pt) => !full.includes(pt));
}
console.log(lines);

for (const line of lines) {
  if (line.length < 3) continue;
  const pts = line.map((i) => Array.from(ptsArr.slice(i * 2, i * 2 + 2)));
  console.log(pts);

  ctx.beginPath();
  h.drawLoop(
    h.spline(pts, Math.min(pts.length - 1, 3), false, 500),
    false,
    ctx,
  );
  ctx.stroke();
}
