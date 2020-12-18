import { JFIFUnits, Jpeg } from '../../jpeg'

const jpeg: Jpeg = [
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
        values: new Uint8Array([
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
        values: new Uint8Array([
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
    width: 35,
    height: 35,
    components: [
      { id: 1, h: 1, v: 2, qId: 0 },
      { id: 2, h: 2, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 0,
        tree: [
          [0, 8],
          [
            [5, 6],
            [7, [4, [9]]],
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
                  [20, 33],
                ],
                [
                  [49, [8, 65]],
                  [
                    [81, [34, 35]],
                    [[50, 98], [129]],
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
          [
            [0, 5],
            [6, 7],
          ],
          [
            [8, 9],
            [
              [2, 3],
              [4, [10]],
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
        cls: 1,
        id: 1,
        tree: [
          [1, [0, 2]],
          [
            [3, [4, 17]],
            [
              [18, [6, 7]],
              [
                [33, [5, 49]],
                [
                  [
                    [34, 65],
                    [81, 97],
                  ],
                  [
                    [146, 193],
                    [[20, 50], [177]],
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
      136, 244, 213, 168, 250, 93, 79, 30, 19, 138, 193, 11, 24, 207, 197, 47,
      186, 161, 235, 173, 178, 241, 98, 126, 213, 113, 153, 108, 112, 72, 60,
      110, 66, 125, 108, 168, 140, 15, 37, 36, 83, 109, 91, 166, 95, 32, 62, 20,
      223, 245, 93, 185, 146, 166, 60, 219, 40, 109, 199, 161, 225, 78, 237,
      195, 173, 130, 142, 142, 50, 98, 46, 116, 132, 142, 45, 197, 133, 249, 94,
      152, 110, 237, 203, 149, 35, 148, 147, 245, 40, 0, 5, 100, 26, 30, 5, 222,
      225, 1, 50, 110, 151, 41, 215, 53, 142, 20, 243, 38, 200, 91, 202, 206,
      62, 84, 77, 54, 52, 155, 113, 82, 36, 45, 100, 193, 198, 254, 64, 165,
      205, 22, 221, 215, 137, 49, 115, 110, 7, 157, 149, 65, 110, 199, 80, 146,
      57, 92, 246, 59, 195, 150, 39, 216, 144, 79, 210, 238, 17, 9, 25, 62, 106,
      196, 45, 189, 188, 82, 242, 61, 188, 152, 52, 120, 16, 81, 119, 242, 194,
      79, 162, 105, 129, 123, 186, 193, 65, 71, 16, 66, 201, 241, 82, 15, 95,
      37, 105, 182, 250, 136, 78, 134, 100, 129, 144, 162, 132, 175, 31, 197, 2,
      42, 122, 83, 233, 72, 228, 253, 154, 181, 141, 191, 145, 242, 57, 204,
      192, 130, 77, 174, 79, 111, 137, 94, 133, 245, 156, 15, 173, 166, 140,
      198, 69, 216, 73, 230, 254, 158, 192, 166, 77, 251, 252, 173, 1, 181, 86,
      217, 211, 66, 50, 237, 205, 184, 105, 89, 64, 25, 10, 105, 213, 143, 111,
      210, 146, 109, 202, 245, 19, 184, 26, 154, 219, 10, 197, 121, 190, 137,
      150, 24, 147, 81, 53, 17, 19, 10, 59, 92, 46, 165, 11, 64, 87, 26, 27, 74,
      206, 18, 226, 198, 9, 199, 127, 25, 3, 29, 78, 219, 62, 161, 51, 109, 8,
      129, 191, 33, 252, 141, 56, 93, 43, 111, 5, 39, 77, 142, 42, 172, 93, 40,
      189, 203, 110, 71, 46, 36, 88, 144, 15, 107, 121, 119, 85, 189, 184, 90,
      58, 30, 161, 11, 225, 115, 6, 89, 231, 199, 107, 217, 195, 237, 57, 9,
      221, 182, 202, 65, 203, 125, 199, 192, 164, 209, 157, 203, 87, 41, 31,
      116, 254, 35, 222, 177, 118, 141, 96, 54, 197, 5, 25, 142, 130, 96, 36,
      98, 174, 26, 157, 71, 150, 174, 244, 81, 140, 72, 238, 5, 118, 58, 132,
      156, 28, 177, 29, 90, 144, 86, 188, 138, 41, 67, 2, 62, 137, 68, 157, 74,
      6, 78, 84, 222, 169, 228, 246, 14, 16, 7, 97, 69, 119, 88, 32, 153, 242,
      214, 220, 240, 191,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
