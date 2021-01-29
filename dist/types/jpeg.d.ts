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
export declare const SOI = "SOI";
export declare const EOI = "EOI";
export declare const COM = "COM";
export declare const APP = "APP";
export declare const JFIF = "JFIF";
export declare const DHT = "DHT";
export declare const DQT = "DQT";
export declare const SOF = "SOF";
export declare const SOS = "SOS";
export declare const enum JFIFUnits {
    PixelAspectRatio = 0,
    DotsPerInch = 1,
    DotsPerCm = 2
}
export declare type SOI = {
    type: typeof SOI;
};
export declare type JFIF = {
    type: typeof JFIF;
    version: [number, number];
    units: number;
    density: {
        x: number;
        y: number;
    };
    thumbnail?: {
        x: number;
        y: number;
        data: Uint8Array;
    };
};
export declare type APP = {
    type: typeof APP;
    appType: number;
    data: Uint8Array;
};
export declare type COM = {
    type: typeof COM;
    text: string;
};
export declare type QuantizationTable = Uint8Array | Uint16Array;
export declare type DQT = {
    type: typeof DQT;
    tables: {
        id: 0 | 1 | 2 | 3;
        data: QuantizationTable;
    }[];
};
/**
 * Huffman tree realized as interleaved arrays. The array indices are the code
 * bits and the number nodes are the 1-byte symbols.
 */
export interface HuffmanTree extends Array<HuffmanTree | number> {
}
export declare type DHT_TABLE = {
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
};
export declare type DHT = {
    type: typeof DHT;
    tables: DHT_TABLE[];
};
export declare type SOF = {
    type: typeof SOF;
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
         * Horizontal sampling factor. Can encode/decode integers from 0 to 15 but
         * only values 1-4 are allowed.
         * h * v = Number of data units that are used for that component in one MCU
         * for an interleaved scan.
         */
        h: number;
        /**
         * Vertical sampling factor. Can encode/decode integers from 0 to 15 but
         * only values 1-4 are allowed.
         */
        v: number;
        /** The id of the quantization table for this component. */
        qId: number;
    }[];
};
export declare type SOS = {
    type: typeof SOS;
    data: Uint8Array;
    components: {
        id: number;
        dcId: number;
        acId: number;
    }[];
    specStart: number;
    specEnd: number;
    ah: number;
    al: number;
};
export declare type EOI = {
    type: typeof EOI;
};
export declare type Segment = SOI | JFIF | APP | COM | DQT | DHT | SOF | SOS | EOI;
export declare type JPEG = Segment[];
