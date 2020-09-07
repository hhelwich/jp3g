export const enum Environment {
  BrowserMain,
  BrowserWorker,
  NodeJs,
}

/**
 * Is used to distinguish whether this script is being executed in the browser
 * main thread, worker thread or in node.js.
 */
export const environment =
  // @ts-ignore
  typeof window !== 'undefined'
    ? Environment.BrowserMain
    : typeof self !== 'undefined'
    ? Environment.BrowserWorker
    : Environment.NodeJs
