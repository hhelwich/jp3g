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
    width: 24,
    height: 8,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 3, v: 1, qId: 1 },
      { id: 4, h: 1, v: 1, qId: 0 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [4, [8]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [2, 3]],
          [
            [4, [5, 17]],
            [
              [18, [6, 19]],
              [
                [81, [0, 7]],
                [
                  [33, 34],
                  [[20, 50], [65]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [8, [5]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [17, [1, 33]],
          [
            [
              [2, 3],
              [4, 5],
            ],
            [
              [49, [0, 7]],
              [
                [81, [18, 19]],
                [
                  [34, [50, 65]],
                  [[113, 129], [177]],
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
      31, 112, 232, 186, 166, 175, 93, 76, 232, 16, 150, 245, 54, 58, 118, 222,
      127, 54, 128, 109, 5, 23, 2, 215, 204, 251, 142, 15, 219, 142, 160, 84,
      110, 34, 83, 82, 45, 183, 172, 42, 169, 14, 254, 217, 3, 15, 157, 19, 168,
      165, 73, 239, 39, 125, 12, 46, 115, 194, 133, 103, 101, 127, 210, 141,
      164, 142, 207, 92, 169, 237, 17, 76, 89, 94, 68, 116, 229, 178, 125, 73,
      240, 56, 127, 165, 229, 142, 249, 5, 69, 36, 17, 84, 32, 141, 202, 55, 42,
      48, 216, 26, 170, 32, 65, 213, 8, 214, 213, 25, 178, 235, 75, 114, 132,
      178, 143, 137, 7, 101, 160, 27, 27, 73, 10, 246, 9, 204, 221, 121, 43,
      201, 253, 227, 199, 95,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
