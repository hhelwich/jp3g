/**
 * Input and output components in the range [0,255)
 *
 * See: https://www.w3.org/Graphics/JPEG/jfif3.pdf
 */
export const yCbCr2Rgb = ([Y, Cb, Cr]: [number, number, number]): [
  number,
  number,
  number
] => [
  // TODO Expand
  Y + 1.402 * (Cr - 128),
  Y - 0.34414 * (Cb - 128) - 0.71414 * (Cr - 128),
  Y + 1.772 * (Cb - 128),
]
