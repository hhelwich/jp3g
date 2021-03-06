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
    type: 'APP',
    appType: 14,
    // prettier-ignore
    data: new Uint8Array([
      65, 100, 111, 98, 101, 0, 100, 0, 0, 0, 0, 2,
    ]),
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
    type: 'DQT',
    tables: [
      {
        id: 1,
        // prettier-ignore
        data: new Uint8Array([
           5,  5,  7, 14, 30, 30, 30, 30,
           5,  6,  8, 20, 30, 30, 30, 30,
           7,  8, 17, 30, 30, 30, 30, 30,
          14, 20, 30, 30, 30, 30, 30, 30,
          30, 30, 30, 30, 30, 30, 30, 30,
          30, 30, 30, 30, 30, 30, 30, 30,
          30, 30, 30, 30, 30, 30, 30, 30,
          30, 30, 30, 30, 30, 30, 30, 30,
        ]),
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 16,
    height: 16,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 2, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
      { id: 4, h: 2, v: 1, qId: 0 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [[3, 5], [8]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, 2],
          [
            [
              [3, 4],
              [5, 6],
            ],
            [
              [17, [0, 18]],
              [
                [
                  [7, 19],
                  [33, 49],
                ],
                [
                  [50, 81],
                  [[21, 51], [65]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [[6, 7], [8]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, [17, [0, 2]]],
          [
            [
              [3, 4],
              [5, 18],
            ],
            [
              [49, [6, 7]],
              [
                [81, 97],
                [[33, 130], [161]],
              ],
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
      { id: 4, dcId: 0, acId: 0 },
    ],
    specStart: 0,
    specEnd: 63,
    ah: 0,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      21, 195, 100, 92, 183, 53, 249, 14, 169, 71, 167, 131, 44, 80, 164, 72,
      206, 240, 130, 40, 16, 242, 14, 220, 135, 36, 184, 199, 64, 123, 250, 211,
      78, 75, 89, 192, 151, 164, 60, 31, 35, 193, 76, 245, 195, 70, 85, 45, 86,
      252, 40, 111, 67, 177, 73, 65, 114, 224, 92, 14, 19, 164, 203, 15, 236,
      53, 74, 90, 151, 17, 102, 66, 131, 243, 60, 250, 162, 118, 212, 215, 17,
      41, 247, 196, 245, 70, 144, 214, 141, 121, 169, 82, 176, 249, 223, 32,
      171, 2, 4, 67, 27, 59, 57, 127, 106, 146, 49, 135, 241, 199, 126, 191,
      154, 123, 110, 75, 213, 229, 229, 74, 213, 231, 218, 114, 41, 198, 25,
      145, 20, 143, 126, 0, 13, 127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
