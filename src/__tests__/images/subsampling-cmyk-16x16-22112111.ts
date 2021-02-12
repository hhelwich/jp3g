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
      { id: 1, h: 2, v: 2, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 2, v: 1, qId: 1 },
      { id: 4, h: 1, v: 1, qId: 0 },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 0,
        tree: [
          [2, 4],
          [7, [8]],
        ],
      },
    ],
  },
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
                [33, [0, 7]],
                [
                  [65, 81],
                  [
                    [20, [21, 34]],
                    [[49, 50], [161]],
                  ],
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
          [17, [1, 2]],
          [
            [3, [0, 33]],
            [
              [
                [4, 6],
                [49, 65],
              ],
              [
                [97, [5, 7]],
                [
                  [81, 113],
                  [129, [240]],
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
      62, 246, 70, 50, 233, 41, 68, 104, 104, 117, 215, 90, 116, 149, 7, 44,
      172, 147, 141, 128, 78, 39, 43, 130, 175, 35, 240, 56, 55, 226, 77, 163,
      36, 199, 102, 34, 218, 82, 2, 100, 52, 148, 228, 50, 189, 175, 127, 239,
      29, 92, 43, 116, 9, 26, 147, 101, 182, 167, 252, 61, 188, 128, 89, 103,
      114, 247, 183, 140, 135, 174, 153, 209, 125, 145, 98, 7, 213, 230, 212,
      43, 136, 172, 72, 159, 180, 166, 210, 97, 108, 237, 20, 103, 151, 57, 171,
      34, 172, 199, 175, 215, 205, 250, 152, 238, 248, 191, 1, 129, 118, 29, 22,
      230, 218, 250, 240, 57, 42, 188, 81, 199, 42, 196, 232, 166, 36, 93, 1,
      35, 115, 167, 207, 198, 155, 217, 43, 52, 244, 184, 35, 88, 222, 208, 129,
      2, 216, 238, 118, 78, 43, 84, 83, 225, 234, 132, 235, 90, 148, 185, 117,
      117, 57, 67, 89, 71, 195, 135, 180, 208, 13, 141, 164, 133, 125, 193, 57,
      155, 175, 35, 201, 243, 235, 175,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
