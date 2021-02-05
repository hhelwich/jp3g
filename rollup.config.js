import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import { terser } from 'rollup-plugin-terser'

const factoryName = 'bundleFunction'
const factoryHeader = name => `\n}(this, (function (${name}) { 'use strict';\n`

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
      exclude: ['**/__tests__/**/*.ts', '**/__demo__/**/*.ts'],
    }),
    {
      renderChunk: code =>
        code
          .replace(/factory\(\)/g, 'factory(factory)')
          .replace(factoryHeader(''), factoryHeader(factoryName)),
    },
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
