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
    height: 16,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 3, v: 2, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [5] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [2, [1, 3]],
          [
            [4, [5, 6]],
            [
              [17, 33],
              [
                [0, 34],
                [[49, 65], [113]],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [5, [[6, 7], [8]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, [3, 17]],
          [
            [
              [0, 2],
              [4, 33],
            ],
            [
              [
                [5, 6],
                [18, 19],
              ],
              [
                [49, [97, [8, 50]]],
                [
                  [
                    [65, 82],
                    [98, 113],
                  ],
                  [[114, 193], [194]],
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
    ],
    specStart: 0,
    specEnd: 63,
    ah: 0,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      46, 201, 184, 224, 91, 81, 37, 196, 173, 215, 200, 99, 188, 232, 57, 18,
      158, 140, 170, 228, 244, 43, 221, 3, 9, 236, 182, 73, 227, 231, 5, 172,
      192, 55, 131, 27, 8, 174, 43, 114, 1, 154, 181, 228, 84, 223, 195, 79,
      222, 168, 153, 97, 25, 25, 68, 67, 144, 253, 99, 66, 165, 151, 165, 168,
      144, 202, 108, 240, 178, 57, 32, 173, 38, 216, 95, 72, 248, 63, 232, 66,
      233, 229, 1, 67, 77, 42, 70, 109, 100, 61, 217, 157, 201, 60, 57, 246,
      230, 22, 237, 1, 134, 213, 226, 41, 147, 41, 176, 109, 60, 122, 95, 139,
      249, 187, 221, 26, 63,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
