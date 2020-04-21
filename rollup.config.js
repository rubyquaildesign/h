import * as R from 'rollup';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
/**
 * @type {R.RollupOptions}
 */
const config = {
    input: 'src/index.ts',
    output: {
        file: 'h.umd.js',
        format: 'umd',
        name: 'h',
    },
    plugins: [
        typescript({}),
        commonjs({ extensions: ['.js', '.ts'] }),
        resolve(),
    ],
};
export default config;
