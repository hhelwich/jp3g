// @ts-ignore
const noWindows = typeof window === 'undefined'

export const isNode = noWindows && typeof self === 'undefined'

export const isWorker = noWindows && !isNode
