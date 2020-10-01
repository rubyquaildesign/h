import test from 'tape';
import { path } from 'd3-path';
import { flr, spline } from '../src/index';
import DOM from 'jsdom';
import { drawLine, drawFauxQuadLoop, drawLoop } from '../src/drawing';
import { log } from 'console';

test('test Maths', (t) => {
  t.plan(3);
  t.is(3, flr(3), 'floor works');
  t.is(3, flr(3.9), 'still works');
  t.isNot(3, flr(4), `damn, you're good`);
});
test('line', (t) => {
  t.equal(
    drawLine([
      [0, 1],
      [1, 1],
    ]),
    'M0,1L1,1',
    'draw line'
  );
  t.end();
});
test('quadLine', (t) => {
  t.equal(
    drawFauxQuadLoop(
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      true
    ),
    'M0,0Q1,0,1,1Q0,1,0,0',
    'draw quad'
  );
  t.throws(() => {
    drawFauxQuadLoop(
      [
        [0, 0],
        [1, 0],
        [1, 1],
      ],
      true
    );
  });
  t.throws(() => {
    drawFauxQuadLoop(
      [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, 1],
      ],
      false
    );
  });
  t.doesNotThrow(() => {
    drawFauxQuadLoop(
      [
        [0, 0],
        [1, 0],
        [1, 1],
      ],
      false
    );
  });
  t.end();
});
test('spline', (t) => {
  const points = [
    [-1, -1],
    [1, -1],
    [2, 0],
    [10, 10],
    [0.5, 0],
    [-1, 1],
  ] as [number, number][];

  const pth = path();

  const op = spline(points, 2, true, 64);

  drawLoop(op, true, pth);
  console.log(pth.toString());
  t.end();
});
