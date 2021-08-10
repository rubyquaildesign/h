export const PI = Math.PI;
export const TAU = 2 * Math.PI;
const sqrt = Math.sqrt;
type TDPT = [number, number];
export function rndm(): number;
export function rndm(max: number): number;
export function rndm(min: number, max: number): number;
export function rndm(...args: number[]) {
  if (args[0] == null) {
    return Math.random();
  }
  if (args[1] == null) {
    return args[0] * Math.random();
  } else {
    return args[0] + Math.random() * (args[1] - args[0]);
  }
}
export function flr(value: number): number {
  return Math.floor(value);
}
function lenAr(a: [number, number], b: [number, number]): number {
  const xDist = (b[0] - a[0]) ** 2;
  const yDist = (b[1] - a[1]) ** 2;

  return sqrt(xDist + yDist);
}
function lenxy(a: XYPt, b: XYPt): number {
  const xDist = (b.x - a.x) ** 2;
  const yDist = (b.y - a.y) ** 2;

  return sqrt(xDist + yDist);
}
function isXYPt(a: XYPt | Pt): a is XYPt {
  return (a as XYPt).x !== undefined;
}
export function len<T extends XYPt | Pt>(a: T, b: T) {
  if (isXYPt(a) && isXYPt(b)) {
    return lenxy(a, b);
  }

  return lenAr(a as [number,number], b as [number,number]);
}
export function sub(a: Pt, b: Pt): Pt {
  return [a[0] - b[0], a[1] - b[1]];
}
