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
           3,  2,  2,  3,  4,  6,  8, 10,
           2,  2,  2,  3,  4,  9, 10,  9,
           2,  2,  3,  4,  6,  9, 11,  9,
           2,  3,  4,  5,  8, 14, 13, 10,
           3,  4,  6,  9, 11, 17, 16, 12,
           4,  6,  9, 10, 13, 17, 18, 15,
           8, 10, 12, 14, 16, 19, 19, 16,
          12, 15, 15, 16, 18, 16, 16, 16,
        ]),
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 8,
    height: 8,
    components: [{ id: 1, h: 1, v: 1, qId: 0 }],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [6] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, 2],
          [
            [3, 5],
            [
              [7, [0, 4]],
              [
                [6, 8],
                [18, [35]],
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
      29, 215, 254, 193, 81, 225, 222, 49, 117, 83, 144, 242, 84, 205, 88, 210,
      195, 37, 103, 31, 77, 139, 179, 251, 46, 136, 255, 0, 117, 132, 128, 161,
      89, 164, 62, 229, 80, 2, 16, 1, 36, 13, 127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
