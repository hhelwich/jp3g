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
    width: 16,
    height: 32,
    components: [
      { id: 1, h: 2, v: 1, qId: 0 },
      { id: 2, h: 1, v: 4, qId: 1 },
      { id: 3, h: 1, v: 4, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [6] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [
            [1, 2],
            [3, 4],
          ],
          [
            [17, [5, 6]],
            [
              [18, [0, 19]],
              [
                [20, 33],
                [49, [[7, 50], [81]]],
              ],
            ],
          ],
        ],
      },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 1,
        tree: [
          [5, 7],
          [8, [6]],
        ],
      },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [
            [0, 1],
            [2, 3],
          ],
          [
            [4, [5, 17]],
            [
              [
                [7, 20],
                [177, [6, 8]],
              ],
              [
                [
                  [18, 34],
                  [35, 49],
                ],
                [
                  [50, [66, 97]],
                  [[162, 179], [209]],
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
      57, 77, 186, 238, 58, 83, 246, 166, 107, 117, 11, 36, 19, 17, 221, 150,
      229, 83, 63, 35, 210, 24, 122, 129, 243, 247, 75, 46, 111, 152, 233, 77,
      26, 50, 154, 155, 170, 202, 235, 103, 201, 227, 162, 41, 236, 70, 56, 206,
      68, 32, 26, 100, 223, 89, 140, 123, 137, 13, 75, 179, 216, 52, 212, 56,
      67, 198, 117, 9, 233, 68, 136, 105, 79, 191, 202, 226, 138, 129, 78, 104,
      171, 45, 196, 50, 242, 191, 214, 102, 26, 52, 254, 80, 107, 21, 143, 38,
      133, 92, 8, 222, 1, 121, 101, 201, 82, 125, 70, 157, 27, 190, 160, 254,
      46, 67, 69, 77, 215, 152, 81, 95, 182, 137, 252, 26, 61, 175, 235, 222,
      227,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
