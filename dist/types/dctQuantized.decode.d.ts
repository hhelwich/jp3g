import { QuantizationTable } from './jpeg';
/**
 * - Dequantize coefficients
 * - Floating point optimized IDCT.
 * - Decenter by adding 128
 */
export declare const invDctQuantized: (qTable: QuantizationTable, qCoeffs: Int16Array, outSamples: Uint8ClampedArray, outOffset: number) => void;