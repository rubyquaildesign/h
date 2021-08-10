import FS from 'node:fs';
import {range} from 'd3-array';

export function writeSvg(
  positions: Array<[number, number]>,
  path: string,
  cp: Array<[number, number]>,
) {
  const outputString = `<?xml version="1.0" encoding="utf-8"?>
  <svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="-3 -3 6 6">
  ${positions
    .map(
      (v) =>
        '<circle cx="' + v[0] + '" cy="' + v[1] + '" r="0.1" fill="#3008" />',
    )
    .join('\n')}
    ${range(0, cp.length - 3, 4)
      .map(
        (i) =>
          '<circle cx="' +
          cp[i][0] +
          '" cy="' +
          cp[i][1] +
          '" r="0.05" fill="#0035" />' +
          '<circle cx="' +
          cp[i + 1][0] +
          '" cy="' +
          cp[i + 1][1] +
          '" r="0.05" fill="#0308" />' +
          '<circle cx="' +
          cp[i + 2][0] +
          '" cy="' +
          cp[i + 2][1] +
          '" r="0.05" fill="#0308" />' +
          '<circle cx="' +
          cp[i + 3][0] +
          '" cy="' +
          cp[i + 3][1] +
          '" r="0.05" fill="#0035" />',
      )
      .join('\n')}
  <path
    d="${path}"
    stroke="#000b" fill="#0000" stroke-width="0.03" />

</svg>`;
  FS.writeFileSync('./test.svg', outputString);
}
