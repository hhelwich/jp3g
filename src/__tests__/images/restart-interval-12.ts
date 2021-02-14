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
            [9, [10, [5]]],
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
  { type: 'DRI', ri: 12 },
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
      224, 204, 128, 232, 46, 147, 68, 154, 70, 155, 59, 162, 155, 135, 117,
      135, 207, 108, 37, 149, 44, 5, 44, 143, 162, 124, 159, 21, 3, 41, 12, 166,
      23, 57, 163, 122, 89, 243, 14, 33, 210, 66, 126, 3, 181, 118, 104, 77,
      182, 231, 60, 128, 219, 95, 104, 28, 3, 142, 180, 37, 142, 196, 89, 186,
      4, 210, 52, 134, 159, 218, 88, 242, 215, 142, 70, 203, 153, 17, 240, 7,
      242, 183, 81, 236, 165, 176, 61, 180, 103, 141, 224, 238, 174, 208, 11,
      82, 64, 251, 59, 82, 35, 112, 184, 143, 74, 101, 43, 96, 196, 132, 108,
      46, 154, 157, 46, 150, 183, 110, 246, 208, 240, 183, 194, 207, 187, 190,
      40, 94, 181, 56, 106, 0, 247, 15, 36, 158, 91, 157, 180, 97, 45, 103, 213,
      252, 85, 206, 200, 109, 180, 216, 41, 97, 129, 198, 166, 6, 2, 80, 127,
      81, 216, 120, 175, 43, 41, 106, 57, 54, 243, 237, 80, 86, 113, 144, 58,
      98, 246, 180, 13, 169, 67, 74, 250, 132, 118, 232, 202, 10, 164, 149, 18,
      59, 211, 33, 115, 141, 54, 18, 64, 106, 76, 175, 241, 6, 192, 226, 3, 87,
      255, 208, 57, 125, 212, 198, 108, 255, 0, 84, 236, 213, 168, 214, 125,
      150, 137, 217, 176, 35, 105, 88, 205, 67, 44, 186, 149, 12, 209, 85, 102,
      105, 84, 153, 203, 38, 64, 66, 44, 212, 49, 3, 170, 81, 34, 139, 235, 63,
      73, 116, 206, 86, 18, 18, 87, 26, 207, 126, 147, 167, 228, 132, 133, 158,
      78, 123, 244, 169, 211, 215, 101, 150, 250, 237, 82, 121, 76, 83, 100,
      223, 75,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
