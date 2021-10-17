const PI = Math.PI;
const DEG = 180 / PI;
const { sin, cos, atan2 } = Math;

type point = [number, number];

export type Vp = point | number[];
// @ts-expect-error because reasons
export class Vec extends Array<number> implements point {
  get x() {
    return this[0];
  }

  set x(x: number) {
    this[0] = x;
  }

  get y() {
    return this[1];
  }

  set y(y: number) {
    this[1] = y;
  }

  angle = this.hAngle;
  magnitude = this.len;

  constructor(input: Vp) {
    super(2);
    this[0] = input[0] || 0;
    this[1] = input[1] || 0;
  }

  static fromObject(input: { x: number; y: number }) {
    return new Vec([input.x, input.y]);
  }

  static r2d(r: number) {
    return r * DEG;
  }

  static d2r(d: number) {
    return d / DEG;
  }

  static lerp(p0: Vp, p1: Vp, t: number) {
    return new Vec(p0).add(new Vec(p1).mulScaler(t)).mulScaler(1 - t);
  }

  static DCQuadBeziercurve(p0: Vp, p1: Vp, p2: Vp, t: number) {
    const q1 = this.lerp(p0, p1, t);
    const q2 = this.lerp(p1, p2, t);
    const op = this.lerp(q1, q2, t);
    return op;
  }

  static DCCubicBezierCurve([p0, p1, p2, p3]: Vp[], t: number) {
    const { lerp } = this;
    const c1 = lerp(p0, p1, t);
    const c2 = lerp(p1, p2, t);
    const c3 = lerp(p2, p3, t);
    const q1 = lerp(c1, c2, t);
    const q2 = lerp(c2, c3, t);
    const op = lerp(q1, q2, t);
    return op;
  }

  static _bezPn1 = (t: number) => {
    const t3 = t ** 3;
    const t2 = t ** 2;
    return -1 * t3 + 3 * t2 + -3 * t + 1;
  };

  static _bezPn2 = (t: number) => {
    const t3 = t ** 3;
    const t2 = t ** 2;
    return 3 * t3 + -6 * t2 + 3 * t + 0;
  };

  static _bezPn3 = (t: number) => {
    const t3 = t ** 3;
    const t2 = t ** 2;
    return -3 * t3 + 3 * t2 + 0 * t + 0;
  };

  static _bezPn4 = (t: number) => {
    const t3 = t ** 3;
    return t3;
  };

  static _derivitivePn1 = (t: number) => {
    const t2 = t ** 2;
    return -3 * t2 + 6 * t - 3;
  };

  static _derivitivePn2 = (t: number) => {
    const t2 = t ** 2;
    return 9 * t2 + -12 * t + 3;
  };

  static _derivitivePn3 = (t: number) => {
    const t2 = t ** 2;
    return -9 * t2 + 6 * t + 0;
  };

  static _derivitivePn4 = (t: number) => {
    const t2 = t ** 2;
    return 3 * t2 + 0 * t + 0;
  };

  static bernsteinCubicBezierCurve([p0, p1, p2, p3]: Vp[], t: number) {
    const A = new Vec(p0).mulScaler(Vec._bezPn1(t));
    const B = new Vec(p1).mulScaler(Vec._bezPn2(t));
    const C = new Vec(p2).mulScaler(Vec._bezPn3(t));
    const D = new Vec(p3).mulScaler(Vec._bezPn4(t));
    return A.add(B).add(C).add(D);
  }

  static cubicBezierCurveDerivitive([p0, p1, p2, p3]: Vp[], t: number) {
    const A = new Vec(p0).mulScaler(Vec._derivitivePn1(t));
    const B = new Vec(p1).mulScaler(Vec._derivitivePn2(t));
    const C = new Vec(p2).mulScaler(Vec._derivitivePn3(t));
    const D = new Vec(p3).mulScaler(Vec._derivitivePn4(t));
    return A.add(B).add(C).add(D);
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
    if (inp === 0) {
      this.y = 0;
      this.x = 0;
    } else {
      this.x /= inp;
      this.y /= inp;
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

  mixX(inp: Vp, amnt = 0.5) {
    this.x = (1 - amnt) * this.x + amnt * inp[0];
    return this;
  }

  mixY(inp: Vp, amnt = 0.5) {
    this.y = (1 - amnt) * this.y + amnt * inp[1];
    return this;
  }

  mix(inp: Vp, amnt = 0.5) {
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

  absAngle() {
    return PI + this.hAngle();
  }

  rotate(amt: number) {
    const { x, y } = this;
    const nx = x * cos(amt) - y * sin(amt);
    const ny = x * sin(amt) + y * cos(amt);
    this.x = nx;
    this.y = ny;
    return this;
  }

  rotateTo(ang: number) {
    return this.rotate(ang - this.angle());
  }

  distSq(inp: Vp) {
    const dx = this._distX(inp);
    const dy = this._distY(inp);
    return dx ** 2 + dy ** 2;
  }

  dist(inp: Vp) {
    return Math.sqrt(this.distSq(inp));
  }

  lenSq() {
    const { x, y } = this;
    return x ** 2 + y ** 2;
  }

  len() {
    return Math.sqrt(this.lenSq());
  }

  norm() {
    const length = this.len();
    if (length === 0) {
      this.x = 1;
      this.y = 0;
    } else this.divScaler(length);
    return this;
  }

  projectOn(inp: Vp) {
    const [ix, iy] = inp;
    const { x, y } = this;
    const coeff = (x * ix + y * iy) / (ix * ix + iy * iy);
    this.x = coeff * ix;
    this.y = coeff * iy;
  }

  isZero() {
    return this.x === 0 && this.y === 0;
  }

  equals([ix, iy]: Vp) {
    return this.x === ix && this.y === iy;
  }

  private _distX(inp: Vp) {
    return this.x - inp[0];
  }

  private _distY(inp: Vp) {
    return this.y - inp[1];
  }
}
