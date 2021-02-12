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
      { id: 1, h: 2, v: 1, qId: 0 },
      { id: 2, h: 2, v: 1, qId: 1 },
      { id: 3, h: 2, v: 2, qId: 1 },
      { id: 4, h: 1, v: 2, qId: 0 },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 0,
        tree: [
          [4, 5],
          [6, [8]],
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
          [
            [1, 2],
            [3, 4],
          ],
          [
            [17, [5, 18]],
            [
              [
                [0, 6],
                [7, 33],
              ],
              [
                [49, 65],
                [
                  [19, 20],
                  [[50, 51], [81]],
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
          [0, 8],
          [9, [5]],
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
          [1, [2, 17]],
          [
            [
              [0, 3],
              [6, [4, 5]],
            ],
            [
              [
                [33, 34],
                [65, 129],
              ],
              [
                [161, [7, 49]],
                [
                  [209, [8, 18]],
                  [[19, 97], [145]],
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
      63, 80, 233, 79, 115, 43, 68, 218, 177, 100, 117, 238, 33, 202, 165, 130,
      153, 70, 70, 219, 70, 79, 249, 3, 223, 123, 245, 137, 124, 151, 164, 185,
      245, 52, 94, 149, 106, 106, 77, 27, 162, 9, 250, 199, 85, 84, 142, 117,
      166, 235, 134, 19, 49, 162, 32, 188, 199, 59, 78, 248, 204, 176, 245, 133,
      119, 108, 192, 160, 123, 126, 30, 12, 23, 207, 168, 5, 205, 32, 75, 35,
      51, 187, 3, 151, 114, 148, 187, 253, 13, 33, 107, 164, 102, 252, 83, 201,
      90, 152, 2, 52, 193, 139, 187, 151, 193, 152, 104, 123, 156, 67, 99, 66,
      232, 91, 181, 50, 236, 254, 213, 12, 233, 1, 247, 127, 17, 63, 169, 169,
      97, 19, 157, 104, 112, 91, 141, 161, 177, 163, 234, 121, 182, 71, 33, 71,
      51, 112, 254, 99, 77, 82, 179, 155, 215, 218, 151, 88, 202, 38, 161, 120,
      154, 211, 133, 48, 45, 67, 218, 159, 48, 157, 2, 43, 245, 217, 180, 9,
      173, 249, 15, 19, 220, 97, 235, 74, 43, 118, 245, 231, 149, 114, 154, 85,
      116, 37, 19, 5, 188, 8, 16, 164, 231, 189, 139, 143,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
