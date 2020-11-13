import { DHT, HuffmanTree } from './jpeg';
/**
 * Build a huffman tree from The counts of huffman codes starting with length
 * 1 and the 1-byte symbols sorted by huffman code.
 */
export declare const getHuffmanTree: ({ counts, symbols, }: {
    counts: number[];
    symbols: number[];
}) => HuffmanTree;
/**
 * Decode DHT segment
 */
export declare const decodeDHT: (data: Uint8Array) => DHT;
