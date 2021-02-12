import { JFIFUnits, JPEG } from '../../jpeg'

const jpeg: JPEG = [
  { type: 'SOI' },
  {
    type: 'JFIF',
    version: [1, 1],
    units: JFIFUnits.DotsPerCm,
    density: { x: 10, y: 10 },
  },
  {
    type: 'DQT',
    tables: [
      {
        id: 0,
        // prettier-ignore
        data: new Uint8Array([
           5,  3,  3,  5,  7, 12, 15, 18,
           4,  4,  4,  6,  8, 17, 18, 17,
           4,  4,  5,  7, 12, 17, 21, 17,
           4,  5,  7,  9, 15, 26, 24, 19,
           5,  7, 11, 17, 20, 33, 31, 23,
           7, 11, 17, 19, 24, 31, 34, 28,
          15, 19, 23, 26, 31, 36, 36, 30,
          22, 28, 29, 29, 34, 30, 31, 30,
        ]),
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 16,
    height: 8,
    components: [{ id: 1, h: 2, v: 1, qId: 0 }],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [7] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [2, [3, 4]]],
          [
            [
              [5, 6],
              [17, 19],
            ],
            [
              [49, [0, 18]],
              [
                [20, 65],
                [
                  [7, 21],
                  [50, [97]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [{ id: 1, dcId: 0, acId: 0 }],
    specStart: 0,
    specEnd: 63,
    ah: 0,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      38, 151, 185, 46, 17, 215, 88, 163, 180, 119, 211, 169, 213, 91, 238, 217,
      185, 187, 29, 109, 85, 113, 143, 221, 63, 192, 252, 167, 39, 189, 161,
      144, 51, 65, 140, 68, 90, 87, 144, 56, 234, 101, 100, 138, 83, 233, 154,
      1, 6, 167, 0, 227, 173, 127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
