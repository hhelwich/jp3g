/**
 * If inputs are integers in the range r,b,g ∈ [0, 255] then outputs are floats
 * in the range Y ∈ [0, 255] and Cb, Cr ∈ [0.5, 255.5].
 *
 * See https://www.w3.org/Graphics/JPEG/jfif3.pdf
 */
export const rgb2YCbCr = ([r, g, b]: [number, number, number]): [
  number,
  number,
  number
] => [
  0.299 * r + 0.587 * g + 0.114 * b,
  -0.1687 * r - 0.3313 * g + 0.5 * b + 128,
  0.5 * r - 0.4187 * g - 0.0813 * b + 128,
]
