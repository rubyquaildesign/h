// An Animation is a class that can be run in which case it draws it's state and increments the statecounter (from 0 to 1)
export class Animation<T> {
  readonly maxFrames: number;
  readonly ref: NonNullable<T>;
  private _drawnFrames = 0;
  get drawnFrames() {
    return this._drawnFrames;
  }

  private _delay = 0;
  get delay() {
    return this._delay;
  }

  readonly loop: boolean;
  readonly stay: boolean;
  interpolator: (t: number) => number = (t) => t;
  private _done = false;
  get isDone() {
    return this._done;
  }

  drawFunc: Animation.StateDrawFunction<T>;
  constructor({
    drawFunc,
    maxFrames,
    ref,
    delay = 0,
    loop,
    stay,
    interp = (t) => t,
  }: Animation.ConstuctorOps<T>) {
    this.drawFunc = drawFunc;
    this.ref = ref;

    this.maxFrames = maxFrames > 0 ? Math.ceil(maxFrames) : 1;
    if (delay && delay > 0) this._delay = delay;
    if (interp) this.interpolator = interp;
    this.loop = loop ?? false;
    this.stay = stay ?? true;
  }

  // TODO Drawing State
  reset(): Animation<T> {
    this._drawnFrames = 0;
    this._done = false;

    return this;
  }

  step(): Animation.stepInfo | void {
    if (this._done && !this.stay) return {done: this._done};
    if (this._delay > 0) {
      this._delay -= 1;

      return {done: this._done, delay: true, delayLeft: this._delay};
    }

    let rawT = this._drawnFrames / this.maxFrames;

    rawT = rawT > 1 ? 1 : rawT;
    // Run
    this.drawFunc(
      this.interpolator(rawT),
      this._drawnFrames,
      this.ref,
      this.maxFrames,
      rawT,
    );
    if (!this._done) this._drawnFrames++;
    if (this._drawnFrames >= this.maxFrames) {
      if (this.loop) {
        this.reset();

        return;
      }

      this._done = true;
    }
  }
  // TODO Keeping Track of frames/time
}
export namespace Animation {
  export type StateDrawFunction<T> = (
    t: number,
    currentF: number,
    ref: T,
    maxF: number,
    rawT: number,
  ) => any;
  export type stepInfo = {
    done: boolean;
    delay?: boolean;
    delayLeft?: number;
  };
  export type ConstuctorOps<T> = {
    drawFunc: StateDrawFunction<T>;
    ref: NonNullable<T>;
    maxFrames: number;
    delay?: number;
    stay?: boolean;
    loop?: boolean;
    interp?: (t: number) => number;
  };
}
