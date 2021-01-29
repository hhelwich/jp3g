import { DQT } from './jpeg';
export declare const getDqtLength: (dqt: DQT) => number;
export declare const encodeDQT: (dqt: DQT, offset: number, buffer: Uint8Array) => number;
