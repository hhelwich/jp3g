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
      { id: 2, h: 2, v: 2, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [6] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [2, 3]],
          [
            [5, [4, 17]],
            [
              [
                [0, 6],
                [18, 20],
              ],
              [
                [33, 49],
                [
                  [7, 50],
                  [65, [81]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [5, [6, [8]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [17, [1, 2]],
          [
            [
              [0, 3],
              [5, 6],
            ],
            [
              [
                [18, 49],
                [97, 193],
              ],
              [
                [
                  [4, 7],
                  [34, [19, 20]],
                ],
                [
                  [
                    [33, 65],
                    [81, 82],
                  ],
                  [[98, 113], [129]],
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
      31, 17, 85, 45, 7, 41, 77, 87, 65, 152, 140, 75, 77, 146, 93, 5, 160, 232,
      87, 86, 224, 165, 86, 251, 215, 238, 28, 76, 121, 79, 42, 33, 52, 123,
      201, 247, 229, 106, 222, 215, 184, 209, 78, 182, 210, 201, 26, 109, 114,
      164, 32, 27, 220, 245, 127, 95, 156, 98, 10, 181, 103, 119, 201, 110, 46,
      195, 248, 119, 72, 10, 141, 96, 79, 233, 86, 170, 185, 191, 67, 117, 141,
      130, 203, 90, 92, 252, 42, 139, 133, 83, 67, 186, 67, 244, 203, 49, 146,
      18, 107, 230, 76, 198, 174, 3, 164, 0, 79, 154, 146, 116, 202, 27, 231,
      165, 51, 140, 169, 163, 251, 5, 244, 25, 124, 78, 94, 62, 236, 244, 17,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
