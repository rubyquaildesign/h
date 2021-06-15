export type Pt = [number, number];
export type Loop = Pt[];
export type Line = [Pt, Pt];
export type Shape = Loop[];
export type Extent = [number, number, number, number];
export type BezierCurve = [start: Pt, c1: Pt, c2: Pt, end: Pt];
