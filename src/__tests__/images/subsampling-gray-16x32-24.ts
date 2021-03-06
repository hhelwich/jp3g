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
    width: 16,
    height: 32,
    components: [{ id: 1, h: 2, v: 4, qId: 0 }],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [7, [8, [6]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [2, 3]],
          [
            [17, [0, 4]],
            [
              [5, [6, 7]],
              [
                [
                  [18, 20],
                  [33, 49],
                ],
                [
                  [129, 241],
                  [
                    [19, 34],
                    [65, [161]],
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
      219, 108, 166, 101, 23, 143, 50, 144, 176, 100, 138, 84, 212, 23, 1, 181,
      40, 77, 65, 22, 141, 27, 156, 254, 29, 171, 165, 75, 12, 45, 124, 37, 93,
      145, 196, 81, 62, 58, 10, 174, 180, 166, 48, 218, 98, 16, 203, 105, 134,
      204, 76, 126, 199, 186, 154, 180, 150, 51, 159, 204, 182, 218, 19, 42, 79,
      242, 125, 82, 94, 242, 231, 242, 123, 115, 134, 209, 129, 135, 92, 69,
      189, 239, 54, 149, 137, 236, 17, 240, 71, 143, 185, 160, 172, 131, 133,
      64, 245, 172, 222, 65, 190, 34, 107,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
