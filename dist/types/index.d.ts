import { Jpeg } from './jpeg';
import { Callback } from './util';
declare const _jp3g: {
    (jpegData: ArrayBufferLike | Blob | Jpeg): {
        scale: (factor: number) => any;
        toJPEG: {
            (callback: Callback<Jpeg>): void;
            (): Promise<Jpeg>;
        };
        toImageData: {
            (args_0: Callback<ImageData>): void;
            (): Promise<ImageData>;
        };
    };
    setWorkerCount: (workerCount: number) => void;
    waitIdle: (callback: Callback<void>) => void;
    version: string;
};
export default _jp3g;
declare global {
    const jp3g: typeof _jp3g;
}
