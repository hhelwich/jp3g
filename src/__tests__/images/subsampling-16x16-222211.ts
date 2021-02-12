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
      { id: 1, h: 2, v: 2, qId: 0 },
      { id: 2, h: 2, v: 2, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [7, [1, [6]]] }] },
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
            [18, [5, 6]],
            [
              [17, [0, 19]],
              [
                [20, [7, 65]],
                [
                  [81, 129],
                  [[33, 50], [161]],
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
      198, 218, 119, 173, 70, 207, 184, 24, 21, 26, 119, 61, 5, 140, 50, 3, 47,
      183, 12, 8, 119, 136, 249, 245, 141, 55, 58, 127, 80, 175, 1, 94, 46, 203,
      134, 153, 196, 112, 64, 82, 121, 247, 128, 208, 169, 92, 50, 166, 174, 71,
      78, 26, 114, 140, 158, 112, 64, 60, 63, 112, 62, 53, 110, 110, 177, 157,
      68, 233, 44, 41, 180, 67, 210, 80, 99, 186, 10, 159, 153, 189, 187, 40,
      71, 226, 5, 136, 22, 35, 220, 126, 221, 177, 168, 42, 213, 157, 223, 37,
      184, 187, 15, 225, 221, 32, 42, 53, 129, 63, 165, 90, 170, 230, 253, 13,
      214, 54, 11, 45, 105, 115, 240, 170, 46, 21, 77, 14, 233, 15, 211, 44,
      198, 72, 73, 175, 153, 51, 26, 184, 14, 144, 1, 62, 106, 73, 211, 40, 111,
      158, 148, 206, 50, 166, 143, 236, 23, 208, 101, 241, 57, 120, 251, 179,
      208, 71,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
