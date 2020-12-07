import { JFIFUnits, Jpeg } from '../../jpeg'

const jpeg: Jpeg = [
  { type: 'SOI' },
  {
    type: 'JFIF',
    version: [1, 1],
    units: JFIFUnits.DotsPerInch,
    density: { x: 72, y: 72 },
  },
  {
    type: 'DQT',
    tables: [
      {
        id: 0,
        bytes: 1,
        // prettier-ignore
        values: [
           3,  2,  2,  3,  5,  8, 10, 12,
           2,  2,  3,  4,  5, 12, 12, 11,
           3,  3,  3,  5,  8, 11, 14, 11,
           3,  3,  4,  6, 10, 17, 16, 12,
           4,  4,  7, 11, 14, 22, 21, 15,
           5,  7, 11, 13, 16, 21, 23, 18,
          10, 13, 16, 17, 21, 24, 24, 20,
          14, 18, 19, 20, 22, 20, 21, 20,
        ],
      },
    ],
  },
  {
    type: 'DQT',
    tables: [
      {
        id: 1,
        bytes: 1,
        // prettier-ignore
        values: [
           3,  4,  5,  9, 20, 20, 20, 20,
           4,  4,  5, 13, 20, 20, 20, 20,
           5,  5, 11, 20, 20, 20, 20, 20,
           9, 13, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
        ],
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 8,
    height: 8,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [4] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, 2],
          [
            [3, 4],
            [
              [6, 17],
              [
                [5, 7],
                [[8, 18], [22]],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [3, [4]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, 2],
          [
            [0, 3],
            [
              [4, [17, 33]],
              [[51, 65], [97]],
            ],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [
      { id: 1, dcId: 0, acId: 0 },
      { id: 2, dcId: 1, acId: 1 },
      { id: 3, dcId: 1, acId: 1 },
    ],
    specStart: 0,
    specEnd: 63,
    ah: 0,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      90, 249, 11, 155, 244, 70, 85, 82, 161, 228, 204, 157, 78, 47, 111, 232,
      237, 85, 105, 36, 89, 37, 69, 82, 37, 80, 76, 141, 18, 17, 38, 129, 27,
      219, 0, 15, 170, 162, 128, 199, 204, 175, 130, 151, 5, 135, 157, 73, 222,
      128, 218, 147, 180,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
