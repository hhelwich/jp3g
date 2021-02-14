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
           3,  2,  2,  3,  5,  8, 10, 12,
           2,  2,  3,  4,  5, 12, 12, 11,
           3,  3,  3,  5,  8, 11, 14, 11,
           3,  3,  4,  6, 10, 17, 16, 12,
           4,  4,  7, 11, 14, 22, 21, 15,
           5,  7, 11, 13, 16, 21, 23, 18,
          10, 13, 16, 17, 21, 24, 24, 20,
          14, 18, 19, 20, 22, 20, 21, 20,
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
           3,  4,  5,  9, 20, 20, 20, 20,
           4,  4,  5, 13, 20, 20, 20, 20,
           5,  5, 11, 20, 20, 20, 20, 20,
           9, 13, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
        ]),
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 32,
    height: 32,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [7, [8, [6, [5]]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [2, 3]],
          [
            [4, [0, 5]],
            [
              [17, [6, 7]],
              [
                [
                  [18, 19],
                  [49, 81],
                ],
                [
                  [97, [8, 34]],
                  [
                    [145, [33, 35]],
                    [[65, 66], [82]],
                  ],
                ],
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
          [6, 8],
          [
            [4, 7],
            [9, [5, [10]]],
          ],
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
          [1, [0, 2]],
          [
            [3, 4],
            [
              [5, 17],
              [
                [6, 33],
                [
                  [34, 49],
                  [
                    [18, [50, 65]],
                    [[145, 161], [177]],
                  ],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DRI', ri: 8 },
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
      19, 211, 151, 231, 108, 115, 16, 74, 143, 43, 63, 21, 68, 100, 177, 165,
      205, 61, 45, 62, 185, 81, 182, 152, 117, 237, 89, 222, 159, 53, 83, 119,
      71, 227, 37, 46, 5, 18, 71, 230, 151, 238, 75, 76, 194, 215, 29, 37, 183,
      151, 208, 116, 13, 113, 33, 40, 110, 29, 213, 49, 92, 116, 21, 98, 132,
      177, 144, 151, 128, 179, 255, 0, 156, 100, 155, 93, 207, 4, 161, 169, 178,
      151, 114, 124, 145, 158, 12, 252, 213, 169, 139, 197, 62, 114, 14, 186,
      74, 86, 79, 34, 108, 200, 116, 122, 81, 251, 144, 184, 135, 74, 112, 172,
      224, 204, 128, 232, 47, 73, 162, 77, 35, 77, 157, 209, 77, 195, 186, 195,
      231, 182, 18, 202, 150, 2, 150, 71, 209, 62, 79, 138, 129, 148, 134, 83,
      11, 156, 209, 189, 44, 249, 135, 16, 233, 33, 63, 1, 218, 187, 52, 38,
      219, 115, 158, 64, 109, 175, 180, 14, 1, 199, 90, 18, 199, 98, 44, 221, 2,
      105, 26, 67, 79, 237, 44, 121, 107, 199, 35, 101, 204, 136, 248, 3, 249,
      91, 168, 246, 82, 216, 30, 218, 51, 198, 240, 119, 87, 104, 5, 169, 32,
      125, 157, 175, 255, 208, 44, 110, 23, 17, 233, 87, 229, 108, 24, 144, 141,
      133, 165, 174, 151, 75, 91, 183, 123, 104, 120, 91, 225, 103, 221, 223,
      20, 47, 90, 156, 53, 0, 123, 135, 146, 79, 45, 206, 218, 48, 150, 179,
      234, 254, 42, 231, 100, 54, 218, 108, 20, 176, 192, 227, 83, 3, 1, 40, 63,
      168, 236, 60, 87, 43, 41, 106, 57, 54, 243, 237, 80, 86, 113, 144, 58, 98,
      246, 180, 13, 169, 67, 74, 250, 132, 118, 232, 202, 10, 164, 149, 18, 59,
      211, 33, 115, 141, 54, 18, 64, 106, 76, 175, 241, 6, 192, 226, 3, 86, 85,
      247, 83, 25, 179, 253, 84, 170, 181, 26, 207, 178, 223, 59, 54, 4, 109,
      43, 25, 168, 101, 151, 82, 161, 154, 42, 172, 205, 42, 147, 57, 100, 200,
      8, 69, 154, 134, 32, 117, 74, 36, 81, 125, 103, 233, 46, 153, 202, 194,
      66, 74, 227, 89, 239, 210, 116, 252, 144, 144, 179, 201, 207, 126, 149,
      58, 122, 236, 178, 223, 93, 170, 79, 41, 138, 108, 155, 233, 127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg