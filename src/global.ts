export {};
declare global {
  type Pt = [number, number];
  type Loop = Pt[];
  type Line = [Pt, Pt];
  type Shape = Loop[];
  type Extent = [number, number, number, number];
}
