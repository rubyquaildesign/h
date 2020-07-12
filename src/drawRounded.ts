import { sub, len, TAU, PI } from './maths';
import { Path } from 'd3-path';
const atan2 = Math.atan2;

function propPoint([sx, sy]: Pt, seg: number, len: number, [dx, dy]: Pt): Pt {
  const factor = seg / len;

  return [sx - dx * factor, sy - dy * factor];
}
function roundedCorner(
  pre: Pt,
  p: Pt,
  pst: Pt,
  r: number,
  ctx: CanvasRenderingContext2D | Path,
  ac: boolean
) {
  const PPre = sub(p, pre);
  const PPst = sub(p, pst);
  const intAng =
    (Math.atan2(PPre[1], PPre[0]) - Math.atan2(PPst[1], PPst[0])) / 2;
  const tan = Math.abs(Math.tan(intAng));
  let rad = r;
  let seg = r / tan;
  const PPreLen = len([0, 0], PPre);
  const PPstLen = len([0, 0], PPst);
  const minLen = Math.min(PPreLen, PPstLen) / 3;

  if (seg > minLen) {
    seg = minLen;
    rad = minLen / tan;
  }
  const preCross = propPoint(p, seg, PPreLen, PPre);
  const pstCross = propPoint(p, seg, PPstLen, PPst);

  const dx = p[0] * 2 - preCross[0] - pstCross[0];
  const dy = p[1] * 2 - preCross[1] - pstCross[1];
  const ll = len([0, 0], [dx, dy]);
  const dd = len([0, 0], [seg, rad]);
  const [cx, cy] = propPoint(p, dd, ll, [dx, dy]);

  const preVec = sub(preCross, [cx, cy]);
  const pstVec = sub(pstCross, [cx, cy]);

  let stAng = atan2(preVec[1], preVec[0]);

  if (stAng < 0) stAng = TAU + stAng;
  let endAng = atan2(pstVec[1], pstVec[0]);

  if (endAng < 0) endAng = TAU + endAng;

  const angLen = endAng - stAng;

  if (endAng < stAng) {
    endAng = TAU + endAng;
    // angLen = -1 * angLen;
  }
  ctx.arc(cx, cy, rad, stAng, endAng, ac);
}
function newRd(
  lastPt: Pt,
  thisPt: Pt,
  nextPt: Pt,
  rad: number,
  ctx: CanvasRenderingContext2D | Path
) {
  const abs = Math.abs;
  const minL = Math.min(abs(len(lastPt, thisPt)), abs(len(thisPt, nextPt))) / 3;
  const intAng =
    (Math.atan2(thisPt[1] - lastPt[1], thisPt[0] - lastPt[0]) -
      Math.atan2(thisPt[1] - nextPt[1], thisPt[0] - nextPt[0])) /
    2;
  let r = rad;
  let seg = r / Math.abs(Math.tan(intAng));

  if (seg < minL) {
    seg = minL;
    r = seg * Math.abs(Math.tan(intAng));
  }
  ctx.arcTo(thisPt[0], thisPt[1], nextPt[0], nextPt[1], r);
}
export function drawRoundLoop(
  lp: Loop,
  rad: number,
  ctx: CanvasRenderingContext2D | Path
): void {
  const loopTurning = lp.reduce((sum, [ax, ay], i, arr) => {
    const l = arr.length;
    const [bx, by] = arr[(i + 1) % l];

    return sum + (bx - ax) * (by + ay);
  }, 0);
  const dY = lp[1][1] - lp[0][1];
  const dX = lp[1][0] - lp[0][0];
  const xPerY = dY / dX;
  const sX = lp[0][0] + dX / 2;
  const sY = lp[0][1] + (xPerY * dX) / 2;

  ctx.moveTo(sX, sY);
  lp.map((pt, i, arr) => {
    if (i === 0) return;
    const l = arr.length;
    const preI = i - 1;
    const pstI = (i + 1) % l;

    newRd(arr[preI], pt, arr[pstI], rad, ctx);
  });
  newRd(lp[lp.length - 1], lp[0], [sX, sY], rad, ctx);
  ctx.closePath();
}
