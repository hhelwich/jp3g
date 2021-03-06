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
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 24,
    height: 24,
    components: [{ id: 1, h: 3, v: 3, qId: 0 }],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 0,
        tree: [
          [7, 8],
          [[4, 5], [6]],
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
              [
                [0, 6],
                [7, 18],
              ],
              [
                [
                  [20, 33],
                  [49, 81],
                ],
                [
                  [
                    [34, 145],
                    [161, 177],
                  ],
                  [
                    [
                      [19, 36],
                      [50, 65],
                    ],
                    [[97, 178], [193]],
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
    components: [{ id: 1, dcId: 0, acId: 0 }],
    specStart: 0,
    specEnd: 63,
    ah: 0,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      18, 101, 204, 200, 50, 236, 132, 201, 148, 226, 147, 21, 42, 27, 136, 73,
      86, 219, 155, 116, 28, 240, 210, 233, 230, 168, 229, 26, 134, 87, 67, 77,
      85, 22, 167, 239, 244, 240, 143, 118, 239, 178, 216, 182, 114, 80, 159,
      103, 90, 36, 180, 174, 96, 144, 69, 252, 240, 153, 201, 129, 198, 52, 99,
      237, 190, 242, 61, 8, 63, 204, 24, 52, 98, 154, 168, 37, 49, 31, 136, 92,
      101, 194, 10, 86, 58, 160, 246, 252, 143, 111, 98, 236, 220, 195, 70, 165,
      213, 93, 164, 58, 162, 135, 216, 8, 220, 158, 219, 144, 20, 61, 20, 48,
      169, 7, 213, 17, 65, 214, 136, 14, 39, 161, 32, 27, 121, 226, 66, 53, 51,
      59, 82, 13, 233, 117, 132, 71, 219, 211, 228, 152, 87, 236, 131, 140, 228,
      237, 65, 204, 181, 44, 209, 34, 185, 93, 168, 25, 114, 229, 20, 124, 103,
      67, 72, 108, 29, 136, 74, 19, 225, 64, 9, 30, 20, 129, 200, 125, 175, 143,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
