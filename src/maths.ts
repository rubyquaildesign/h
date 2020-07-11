export const PI = Math.PI;
export const TAU = 2 * Math.PI;
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
