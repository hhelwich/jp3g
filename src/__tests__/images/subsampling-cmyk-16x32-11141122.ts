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
    height: 32,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 4, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
      { id: 4, h: 2, v: 2, qId: 0 },
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
          [[5, 6], [8]],
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
              [19, [0, 6]],
              [
                [33, [7, 20]],
                [
                  [49, 65],
                  [81, [21, [50]]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [7, [8, [6]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [
            [1, 4],
            [5, 17],
          ],
          [
            [
              [0, 2],
              [3, 18],
            ],
            [
              [49, [6, 65]],
              [
                [
                  [7, 34],
                  [50, 81],
                ],
                [[113, 129], [162]],
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
      70, 171, 210, 250, 173, 123, 168, 72, 61, 166, 178, 43, 122, 122, 160, 96,
      81, 69, 84, 38, 52, 225, 49, 16, 24, 155, 249, 56, 0, 112, 3, 231, 230,
      170, 34, 21, 194, 100, 251, 160, 132, 158, 166, 46, 92, 144, 215, 154, 96,
      119, 111, 150, 137, 104, 225, 250, 194, 151, 88, 235, 244, 176, 122, 188,
      2, 13, 148, 57, 163, 53, 194, 53, 42, 9, 227, 44, 202, 65, 119, 140, 239,
      157, 187, 98, 52, 71, 87, 186, 142, 251, 98, 213, 40, 12, 89, 109, 159,
      218, 253, 110, 226, 243, 247, 184, 48, 98, 197, 28, 99, 53, 211, 144, 126,
      69, 190, 231, 139, 54, 206, 174, 185, 174, 178, 58, 238, 169, 160, 192,
      229, 2, 141, 128, 182, 79, 51, 238, 208, 249, 161, 221, 59, 97, 173, 125,
      245, 61, 218, 234, 1, 14, 196, 20, 2, 73, 46, 155, 237, 159, 124, 127, 1,
      169, 74, 91, 4, 152, 33, 137, 49, 153, 242, 49, 26,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
