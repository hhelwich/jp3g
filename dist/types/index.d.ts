import { JPEG } from './jpeg';
import { Callback } from './util';
declare type JP3G = {
    scale: (factor: number) => JP3G;
    toObject: {
        (callback: Callback<JPEG>): void;
        (): Promise<JPEG>;
    };
    toBuffer: {
        (callback: Callback<Uint8Array>): void;
        (): Promise<Uint8Array>;
    };
    toImageData: {
        (args_0: Callback<ImageData>): void;
        (): Promise<ImageData>;
    };
};
declare const _jp3g: {
    (jpegData: Uint8Array | ArrayBuffer | Blob | JPEG): JP3G;
    setWorkerCount: (workerCount: number) => void;
    waitIdle: (callback: Callback<void>) => void;
    version: string;
};
export default _jp3g;
export { JPEG };
declare global {
    const jp3g: typeof _jp3g;
}
