/**
 * Input and output components in the range [0,255)
 *
 * See: https://www.w3.org/Graphics/JPEG/jfif3.pdf
 */
export declare const yCbCr2Rgb: ([Y, Cb, Cr]: [number, number, number]) => [
    number,
    number,
    number
];
