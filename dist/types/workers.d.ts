/**
 * Asynchronous function that can be called both directly and in a worker.
 */
declare type WorkerFunction = (...args: any[]) => PromiseLike<any>;
/**
 * Extract the type wrapped in a promise type.
 */
declare type UnwrapPromise<T> = T extends PromiseLike<infer U> ? U : T;
/**
 * Returns a fake worker that works in the same thread.
 */
export declare const fakeWorker: () => Worker;
/**
 * Set zero to any number of workers which should be used to process functions.
 */
export declare const setWorker: (...workers: Worker[]) => void;
/**
 * Proxy a function so that it can also be processed in a worker.
 * To pass ArrayBuffers by reference instead of by value, functions must be
 * specified which extract the ArrayBuffers from the function's inputs and
 * outputs.
 */
export declare const workerFunction: <F extends WorkerFunction>(fn: F, inputTransfer: (args: Parameters<F>) => ArrayBuffer[], outputTransfer: (result: UnwrapPromise<ReturnType<F>>) => ArrayBuffer[]) => F;
export {};
