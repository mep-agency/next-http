import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescriptPlugin from 'rollup-plugin-typescript2';
import typescript from 'typescript';

import pkg from './package.json' assert { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './dist/cjs/index.js',
      format: 'cjs',
    },
    {
      file: './dist/esm/index.js',
      format: 'es',
    },
  ],
  external: [...Object.keys(pkg.peerDependencies || {})],
  plugins: [
    nodeResolve(),
    commonjs(),
    typescriptPlugin({
      typescript: typescript,
    }),
  ],
};
