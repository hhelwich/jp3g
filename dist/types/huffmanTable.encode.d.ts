import { DHT, HuffmanTree } from './jpeg';
/**
 * Return counts of huffman codes starting with length 1 and the 1-byte symbols
 * sorted by huffman code for a given huffman tree
 */
export declare const getHuffmanCodeCounts: (huffmanTable: HuffmanTree) => {
    counts: number[];
    symbols: number[];
};
/**
 * Returns the number of bytes needed to encode the given DHT segment
 */
export declare const getDhtLength: ({ tables }: DHT) => number;
export declare const encodeDHT: (segment: DHT, offset: number, buffer: Uint8Array) => number;
