import { Jpeg } from './jpeg';
export { setWorker } from './workers';
export declare const version: string;
export declare const decode: (jpegData: ArrayBufferLike) => Promise<Jpeg>;
export declare const decodeImage: (jpeg: Jpeg) => Promise<ImageData>;
