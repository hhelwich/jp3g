export declare const enum Marker {
    SOI = 216,
    COM = 254,
    DQT = 219,
    DHT = 196,
    SOS = 218,
    EOI = 217,
    SOF0 = 192
}
export declare const zigZag: Uint8Array;
export interface SOI {
    type: 'SOI';
}
export interface APP {
    type: 'APP';
    appType: number;
    data: Uint8Array;
}
export interface COM {
    type: 'COM';
    text: string;
}
export interface DQT_TABLE {
    id: 0 | 1 | 2 | 3;
    bytes: 1 | 2;
    values: number[];
}
export interface DQT {
    type: 'DQT';
    tables: DQT_TABLE[];
}
/**
 * Huffman tree realized as interleaved arrays. The array indices are the code
 * bits and the number nodes are the 1-byte symbols.
 */
export interface HuffmanTree extends Array<HuffmanTree | number> {
}
export interface DHT_TABLE {
    /**
     * Can store integers from 0 to 15 but only 0 (DC) or 1 (AC) are valid.
     */
    cls: number;
    /**
     * Can store integers from 0 to 15 but only 0, 1 are valid for baseline frames
     * and 0 to 3 are valid for extended and progressive frames.
     */
    id: number;
    tree: HuffmanTree;
}
export interface DHT {
    type: 'DHT';
    tables: DHT_TABLE[];
}
export interface SOF {
    type: 'SOF';
    frameType: number;
    /** Sample precision in bits (8, 12). */
    precision: number;
    /** Image width in pixels */
    width: number;
    /** Image height in pixels */
    height: number;
    components: {
        /**
         * Component id (0,1,…,255).
         * For JFIF they have the order and id Y=1, Cb=2, Cr=3. But not all encoders
         * follow the spec for the ids so we will only use the order to determine
         * the component.
         */
        id: number;
        /**
         * Horizontal sampling (0,1,2,3).
         * h * v = Number of data units that are used in one MCU for interleaved
         */
        h: number;
        /** Vertical sampling (0,1,2,3) */
        v: number;
        /** The id of the quantization table for this component. */
        qId: number;
    }[];
}
export interface SOS {
    type: 'SOS';
    data: Uint8Array;
    components: {
        id: number;
        dcTbl: number;
        acTbl: number;
    }[];
    specStart: number;
    specEnd: number;
    ah: number;
    al: number;
}
export interface EOI {
    type: 'EOI';
}
export declare type Segment = SOI | APP | COM | DQT | DHT | SOF | SOS | EOI;
export declare type SegmentForType<T extends Segment['type']> = T extends 'SOI' ? SOI : T extends 'APP' ? APP : T extends 'COM' ? COM : T extends 'DQT' ? DQT : T extends 'DHT' ? DHT : T extends 'SOF' ? SOF : T extends 'SOS' ? SOS : T extends 'EOI' ? EOI : never;
export declare type Jpeg = Segment[];
