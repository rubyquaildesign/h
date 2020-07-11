// An Animation is a class that can be run in which case it draws it's state and increments the statecounter (from 0 to 1)
export class Animation {
  maxFrames: number;
  ref: NonNullable<any>;
  drawnFrames = 0;
  delay = 0;
  interpolator: (t: number) => number = (t) => t;
  done = false;
  drawFunc: Animation.StateDrawFunction;
  constructor(
    drawFunc: Animation.StateDrawFunction,
    ref: NonNullable<any>,
    maxFrames: number,
    delay?: number,
    interp?: (t: number) => number
  ) {
    this.drawFunc = drawFunc;
    this.ref = ref;
    this.maxFrames = maxFrames;
    if (delay && delay > 0) this.delay = delay;
    if (interp) this.interpolator = interp;
  }
  // TODO Drawing State
  step(): Animation.stepInfo | void {
    if (this.done) return { done: true };
  }
  // TODO Keeping Track of frames/time
  reset() {
    this.drawnFrames = 0;
    this.done = false;
  }
}
export namespace Animation {
  export type StateDrawFunction = (
    t: number,
    currentF: number,
    maxF: number,
    rawT: number
  ) => any;
  export type stepInfo = {
    done: boolean;
    delay?: boolean;
    delayLeft?: number;
  };
}
