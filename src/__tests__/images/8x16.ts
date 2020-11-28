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
    width: 8,
    height: 16,
    components: [
      { id: 1, h: 1, v: 2, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [6, [8]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [3, 5]],
          [
            [18, [2, 6]],
            [
              [17, [0, 4]],
              [
                [7, [19, 20]],
                [
                  [
                    [21, 34],
                    [35, 50],
                  ],
                  [[51, 65], [97]],
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
            [
              [4, 5],
              [18, 33],
            ],
            [
              [49, [0, 3]],
              [
                [7, [24, 34]],
                [[65, 81], [97]],
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
      97, 193, 92, 244, 235, 120, 48, 62, 219, 133, 135, 163, 225, 85, 36, 59,
      225, 187, 149, 74, 206, 138, 79, 197, 1, 16, 13, 68, 102, 71, 56, 253,
      198, 167, 39, 62, 93, 22, 69, 151, 115, 181, 52, 181, 86, 155, 211, 168,
      64, 32, 242, 158, 238, 7, 107, 211, 89, 37, 42, 244, 224, 103, 42, 82,
      129, 243, 83, 238, 207, 214, 52, 175, 76, 16, 211, 40, 228, 57, 164, 23,
      125, 192, 126, 84, 28, 21, 251, 236, 178, 60, 187, 234, 227, 155, 165, 17,
      243, 101, 111, 166, 78, 176, 128, 90, 156, 48, 178, 95, 23, 185, 171, 47,
      144, 214, 215,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
