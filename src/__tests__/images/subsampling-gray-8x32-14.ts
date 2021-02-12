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
    width: 8,
    height: 32,
    components: [{ id: 1, h: 1, v: 4, qId: 0 }],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [8, [6, [7]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [2, [1, 4]],
          [
            [
              [0, 3],
              [5, 6],
            ],
            [
              [17, [19, 33]],
              [
                [34, [7, 8]],
                [
                  [21, [36, 65]],
                  [[113, 129], [225]],
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
      66, 218, 174, 134, 117, 180, 51, 81, 114, 159, 144, 125, 237, 217, 199,
      145, 184, 110, 58, 242, 135, 170, 61, 0, 33, 247, 218, 72, 6, 126, 56,
      196, 109, 190, 15, 169, 253, 34, 188, 110, 106, 92, 227, 108, 229, 168,
      182, 211, 152, 11, 186, 101, 212, 145, 84, 251, 69, 196, 101, 85, 46, 89,
      143,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
