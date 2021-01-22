import { Jpeg } from './jpeg';
import { Callback } from './util';
declare type Jp3g = {
    scale: (factor: number) => Jp3g;
    toJPEG: {
        (callback: Callback<Jpeg>): void;
        (): Promise<Jpeg>;
    };
    toImageData: {
        (args_0: Callback<ImageData>): void;
        (): Promise<ImageData>;
    };
};
declare const _jp3g: {
    (jpegData: ArrayBufferLike | Blob | Jpeg): Jp3g;
    setWorkerCount: (workerCount: number) => void;
    waitIdle: (callback: Callback<void>) => void;
    version: string;
};
export default _jp3g;
declare global {
    const jp3g: typeof _jp3g;
}
