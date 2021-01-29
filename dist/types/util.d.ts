export declare type Head<T extends any[]> = T extends [...infer H, any] ? H : never;
export declare type Last<T extends any[]> = T extends [...infer H, infer L] ? L : never;
export declare type Prepend<I, T extends any[]> = [I, ...T];
export declare type Append<T extends any[], I> = [...T, I];
/**
 * Extract the type wrapped in a promise type.
 */
export declare type UnwrapCallback<T> = T extends Callback<infer U> ? U : never;
/**
 * Callback type if used without Promises.
 */
export declare type Callback<T> = (error: Error | undefined | null, result: T) => void;
export declare const isFunction: (f: unknown) => f is Function;
export declare const isBlob: (b: unknown) => b is Blob;
/**
 * Just the identity function.
 */
export declare const identity: <T>(a: T) => T;
/**
 * Compose two asynchronous functions.
 */
export declare const composeAsync: <A extends any[], B, C>(fn1: (...as: [...A, Callback<B>]) => void, fn2: (b: B, callback: Callback<C>) => void) => (...as: [...A, Callback<C>]) => void;
/**
 * Lift synchronous function to asynchronous function.
 */
export declare const toAsync: <A extends any[], B>(fn: (...a: A) => B) => (...a: [...A, Callback<B>]) => void;
/**
 * Convert an internal callback style function to an external function that can
 * work with callbacks and `Promise`s. If the last parameter is not a function,
 * a `Promise` is returned. That means, that also optional parameters work, but
 * the last parameter before the callback must not be a function.
 */
export declare const enablePromise: <T extends any[]>(fn: (...args: T) => void) => {
    (...args: T): void;
    (...args: Head<T>): Promise<UnwrapCallback<Last<T>>>;
};
/**
 * Use instead of `Array.from` to not annoy older browsers or use instead of
 * `Array#slice`.
 */
export declare const array: <T>(iterable: Iterable<T> | ArrayLike<T>, start?: number, end?: number) => T[];
/**
 * Use instead of `Array.find` to prevent problems with old browsers.
 */
export declare const find: <T>(xs: T[], predicate: (x: T) => boolean) => T;
/**
 * Like `ImageData` constructor but also works in ancient browsers like IE11
 * with the following differences if used in this old environments:
 * - A new buffer is created for the data
 * - Throws if used in a worker
 */
export declare const createImageData: (data: Uint8ClampedArray, width: number, height: number) => ImageData;
/**
 * Read a `Blob` to memory and return an `Uint8Array`.
 */
export declare const readBlob: (blob: Blob, callback: Callback<Uint8Array>) => void;
export declare const waitState: (isState: () => boolean) => [check: () => void, wait: (callback: Callback<void>) => void];
/**
 * Returns a new view on the undelaying `ArrayBuffer` but returns a direct
 * `Uint8Array` also for node.js `Buffer`s.
 * Indices behave the same way like `Array#slice()` and `Uint8Array#subarray()`.
 */
export declare const subarray: (buffer: Uint8Array, start: number, end?: number) => Uint8Array;
