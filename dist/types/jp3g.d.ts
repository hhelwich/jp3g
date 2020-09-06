export declare const version: string;
export declare const decode: (buffer: ArrayBuffer) => Promise<{
    width: number;
    height: number;
    data: ArrayBufferLike;
}>;
