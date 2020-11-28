/**
 * Input and output components in the range [0,255)
 *
 * See: https://www.w3.org/Graphics/JPEG/jfif3.pdf
 */
export const yCbCr2Rgb = ([Y, Cb, Cr]: number[]) => [
  Y + 1.402 * Cr - 179.456,
  Y - 0.34414 * Cb - 0.71414 * Cr + 135.45984,
  Y + 1.772 * Cb - 226.816,
]
