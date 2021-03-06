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
    width: 8,
    height: 32,
    components: [
      { id: 1, h: 1, v: 2, qId: 0 },
      { id: 2, h: 1, v: 2, qId: 1 },
      { id: 3, h: 1, v: 4, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [6, [7]] }] },
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
              [18, 19],
              [
                [6, 49],
                [
                  [0, 33],
                  [[7, 34], [129]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [5, [8, [9]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, [2, 17]],
          [
            [
              [0, 3],
              [4, 5],
            ],
            [
              [18, [6, 49]],
              [
                [
                  [7, 129],
                  [
                    [19, 33],
                    [34, 35],
                  ],
                ],
                [
                  [
                    [65, 66],
                    [98, 145],
                  ],
                  [[161, 177], [209]],
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
      115, 192, 190, 72, 85, 113, 53, 58, 122, 41, 152, 70, 129, 172, 9, 91,
      201, 83, 133, 72, 73, 182, 188, 126, 182, 36, 142, 207, 87, 242, 18, 255,
      0, 39, 68, 46, 47, 90, 165, 179, 5, 193, 54, 162, 27, 8, 156, 220, 157,
      101, 140, 28, 66, 253, 36, 39, 221, 194, 49, 236, 119, 249, 228, 255, 0,
      91, 162, 42, 16, 145, 57, 36, 149, 159, 38, 62, 166, 221, 249, 237, 26,
      15, 75, 167, 165, 166, 224, 138, 176, 161, 136, 119, 78, 61, 71, 179, 142,
      239, 207, 104, 123, 87, 30, 128, 41, 224, 174, 51, 76, 22, 121, 149, 42,
      30, 56, 183, 178, 62, 156, 67, 252, 68, 167, 149, 118, 170, 153, 38, 104,
      112, 91, 224, 15, 200, 118, 243, 222, 60, 127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
