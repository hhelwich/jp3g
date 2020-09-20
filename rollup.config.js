import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

const config = ({ minify }) => ({
  input: 'src/jp3g.ts',
  output: {
    file: `dist/jp3g${minify ? '.min' : ''}.js`,
    format: 'umd',
    name: 'jp3g',
  },
  plugins: [
    json(),
    typescript(),
    ...(minify
      ? [
          terser({
            output: {
              comments: false,
            },
          }),
        ]
      : []),
  ],
})

export default [config({ minify: false }), config({ minify: true })]