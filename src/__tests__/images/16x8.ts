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
    width: 16,
    height: 8,
    components: [
      { id: 1, h: 2, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [7] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [
            [1, 2],
            [3, 5],
          ],
          [
            [17, [4, 6]],
            [
              [18, 20],
              [
                [0, 50],
                [
                  [7, 22],
                  [[33, 65], [97]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [5, [6]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, [2, 17]],
          [
            [33, [3, 5]],
            [
              [
                [0, 4],
                [7, 18],
              ],
              [
                [49, 50],
                [[8, 34], [82]],
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
      34, 104, 109, 114, 106, 185, 91, 30, 91, 238, 127, 86, 10, 19, 25, 69, 23,
      215, 5, 179, 235, 18, 24, 26, 98, 7, 227, 238, 127, 56, 252, 221, 231, 91,
      14, 187, 88, 222, 228, 107, 161, 249, 113, 56, 215, 6, 162, 148, 250, 230,
      12, 99, 186, 41, 129, 128, 210, 104, 196, 7, 168, 204, 114, 195, 47, 163,
      2, 229, 112, 77, 221, 84, 28, 36, 54, 231, 16, 25, 248, 221, 51, 16, 147,
      203, 190, 31, 242, 162, 213, 159, 187, 208, 77, 66, 167, 74, 24, 211, 17,
      29, 1, 235, 63, 103, 221, 249, 13, 143,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
