/**
 * Enumeration of all environments relevant for this code base.
 */
export declare const enum Environment {
    BrowserMain = 0,
    BrowserWorker = 1,
    NodeJs = 2
}
/**
 * This constant is used to distinguish whether this script is being executed in
 * the browser main thread, worker thread or in node.js.
 */
export declare const environment: Environment;