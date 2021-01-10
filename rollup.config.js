import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

const config = ({ minify }) => ({
  input: 'src/index.ts',
  output: {
    file: `dist/jp3g${minify ? '.min' : ''}.js`,
    format: 'umd',
    name: 'jp3g',
  },
  plugins: [
    json(),
    typescript({
      exclude: ['src/**/__tests__/**/*.ts'],
    }),
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
