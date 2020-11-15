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
export declare const decodeFrame: (jpeg: Jpeg) => ImageData;
export declare const decodeFns: (data: Uint8Array) => {
    nextBit: () => number;
    nextHuffmanByte: (tree: HuffmanTree) => number;
    nextDcDiff: (huffmanTreeDC: HuffmanTree) => number;
    nextDc: (huffmanTreeDC: HuffmanTree) => number;
    getCoeff: (huffmanTreeDC: HuffmanTree, huffmanTreeAC: HuffmanTree) => number[];
};
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
