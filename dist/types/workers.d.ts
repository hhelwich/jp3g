import { Append, Callback } from './util';
/**
 * Type of a message that is sent to the worker in order to call a function.
 */
export declare type MessageToWorker = [callId: number, fnId: number, args: unknown[]];
/**
 * Type of a message that is sent back to the main thread by the worker after a
 * function has been completed in the worker.
 */
export declare type MessageFromWorker<T> = [
    callId: number,
    errorMessage?: string,
    result?: T
];
/**
 * Creates a worker handler that runs a function in a worker.
 */
export declare const onMessageToWorker: (postMessageFromWorker: (message: MessageFromWorker<unknown>, transfer?: ArrayBuffer[]) => void) => ({ data: [callId, fnId, args] }: MessageEvent<MessageToWorker>) => void;
export declare let maxWorkerCount: number;
declare const waitIdle: (callback: Callback<void>) => void;
export { waitIdle };
/**
 * Returns an asynchronous function that runs a synchronous function in a worker
 * pool.
 * The transfer functions are used to extract `Transferable`s so that they can
 * be passed to the worker and back by reference.
 */
export declare const workerFunction: <A extends any[], B>(inputTransfer: (args: A) => ArrayBuffer[], fn: (...args: A) => B, outputTransfer: (result: B) => ArrayBuffer[]) => (...args: [...A, Callback<B>]) => void;
/**
 * Set zero to any number of workers which should be used to process
 * functions.
 */
export declare const setWorkerCount: (workerCount: number) => void;
