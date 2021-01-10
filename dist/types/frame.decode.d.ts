import { HuffmanTree, Jpeg, SOF } from './jpeg';
export declare const prepareScanDecode: (sof: SOF) => {
    maxH: number;
    maxV: number;
    mcusPerLine: number;
    mcusPerColumn: number;
    components: {
        id: number;
        h: number;
        v: number;
        qId: number;
        blocksBufferSize: number;
        blocksPerLine: number;
        blocksPerColumn: number;
    }[];
};
/**
 * Some old browsers cannot create an `ImageData` in a worker, so we transfer
 * the parameters of the `ImageData` constructor.
 */
export declare type ImageDataArgs = [
    data: Uint8ClampedArray,
    width: number,
    height: number
];
export declare type DecodeOptions = {
    downScale?: number;
};
export declare const decodeFrame: (jpeg: Jpeg, { downScale }?: DecodeOptions) => ImageDataArgs;
export declare const createNextBit: (data: Uint8Array) => () => number;
export declare const createDecodeQCoeffs: (data: Uint8Array, outQCoeffs: Int16Array) => (lastDc: number, huffmanTreeDC: HuffmanTree, huffmanTreeAC: HuffmanTree) => void;
/**
 * This function is taken from the JPEG specification. It is used to decode DC
 * coefficients. DC coefficients are coded as differences to the previous DC
 * value (as these are usually smaller). This difference is then coded in two
 * parts: First a huffman-coded byte that defines the magnitude of the DC
 * difference by number of following bits. This function calculates the DC
 * coefficient difference from these two values.
 *
 * E.g. coded: 1100 1101 1011 ...
 * First three bits 110 are e.g. huffman encoded magnitude t=7. Next 7 bits are
 * v=0110110=52. Encoded DC coefficient difference = extend(52, 7) = -73
 *
 * @param v Bits encoded after huffman encoded magnitude.
 * @param t Magnitude of the DC coefficient and also the number of encoded bits
 * in the previous parameter.
 */
export declare const extend: (v: number, t: number) => number;
