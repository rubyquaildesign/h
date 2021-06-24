const PI = Math.PI
const TAU = PI * 2;
const { sin, cos, tan, atan2, random } = Math;

type point = [number, number];

type Vp = point | Array<number>;
// @ts-ignore
class Vec extends Array implements point {

  get x() {
    return this[0]
  }
  get y() {
    return this[1]
  }
  set x(x: number) {
    this[0] = x;
  }
  set y(y: number) {
    this[1] = y;
  }
  constructor(input: Vp) {
    super(2);
    this[0] = input[0] || 0;
    this[1] = input[1] || 0;
  }
  static fromObject(input: { x: number, y: number }) {
    return new Vec([input.x,input.y])
  }

  add(inp: Vp) {
    this.x += inp[0]
    this.y += inp[1]
    return this;
  }
}