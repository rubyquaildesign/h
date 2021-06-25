const PI = Math.PI;
const TAU = PI * 2;
const { sin, cos, tan, atan2, random } = Math;

type point = [number, number];

type Vp = point | Array<number>;
// @ts-ignore
export class Vec extends Array<number> implements point {
  get x() {
    return this[0];
  }
  get y() {
    return this[1];
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
  static fromObject(input: { x: number; y: number }) {
    return new Vec([input.x, input.y]);
  }

  add(inp: Vp) {
    this.x += inp[0];
    this.y += inp[1];
    return this;
  }
  addScalar(inp: number) {
    this.x += inp;
    this.y += inp;
    return this;
  }
  sub(inp: Vp) {
    this.x -= inp[0];
    this.y -= inp[1];
    return this;
  }
  subScaler(inp: number) {
    this.x -= inp;
    this.y -= inp;
    return this;
  }
  div(inp: Vp) {
    this.x /= inp[0];
    this.y /= inp[1];
    return this;
  }
  divScaler(inp: number) {
    if (inp !== 0) {
      this.x /= inp;
      this.y /= inp;
    } else {
      this.y = 0;
      this.x = 0;
    }
    return this;
  }
  mul(inp: Vp) {
    this.x *= inp[0];
    this.y *= inp[1];
    return this;
  }
  mulScaler(inp: number) {
    this.x *= inp;
    this.y *= inp;
    return this;
  }
  invertX() {
    this.x *= -1;
    return this;
  }
  invertY() {
    this.y *= -1;
    return this;
  }
  invert() {
    return this.invertX().invertY();
  }
  round() {
    this.map((i) => Math.round(i));
    return this;
  }
  mixX(inp: Vp, amnt: number = 0.5) {
    this.x = (1 - amnt) * this.x + amnt * inp[0];
    return this;
  }
  mixY(inp: Vp, amnt: number = 0.5) {
    this.y = (1 - amnt) * this.y + amnt * inp[1];
    return this;
  }
  mix(inp: Vp, amnt: number = 0.5) {
    return this.mixX(inp, amnt).mixY(inp, amnt);
  }
  clone() {
    return new Vec(this);
  }
  dot(inp: Vp) {
    return this.x * inp[0] + this.y * inp[1];
  }
  cross(inp: Vp) {
    return this.x * inp[1] - this.y * inp[0];
  }
  hAngle() {
    return atan2(this.y, this.x);
  }
  vAngle() {
    return atan2(this.x, this.y);
  }
  angle = this.hAngle;
  rotate(amt: number) {
    let { x, y } = this;
    let nx = x * cos(amt) - y * sin(amt);
    let ny = x * sin(amt) + y * cos(amt);
    this.x = nx;
    this.y = ny;
    return this;
  }
  rotateTo(ang: number) {
    return this.rotate(ang - this.angle());
  }
  private _distX(inp: Vp) {
    return this.x - inp[0];
  }
  private _distY(inp: Vp) {
    return this.y - inp[1];
  }
  distSq(inp: Vp) {
    let dx = this._distX(inp);
    let dy = this._distY(inp);
    return dx ** 2 + dy ** 2;
  }
  dist(inp: Vp) {
    return Math.sqrt(this.distSq(inp));
  }
  lenSq() {
    let { x, y } = this;
    return x ** 2 + y ** 2;
  }
  len() {
    return Math.sqrt(this.lenSq());
  }
  magnitude = this.len;
  norm() {
    let length = this.len();
    if (length === 0) {
      this.x = 1;
      this.y = 0;
    } else this.divScaler(length);
    return this;
  }
}
