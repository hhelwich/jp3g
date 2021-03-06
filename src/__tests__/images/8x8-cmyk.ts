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
    type: 'DQT',
    tables: [
      {
        id: 1,
        // prettier-ignore
        data: new Uint8Array([
           3,  3,  4,  8, 16, 16, 16, 16,
           3,  3,  4, 11, 16, 16, 16, 16,
           4,  4,  9, 16, 16, 16, 16, 16,
           8, 11, 16, 16, 16, 16, 16, 16,
          16, 16, 16, 16, 16, 16, 16, 16,
          16, 16, 16, 16, 16, 16, 16, 16,
          16, 16, 16, 16, 16, 16, 16, 16,
          16, 16, 16, 16, 16, 16, 16, 16,
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
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
      { id: 4, h: 1, v: 1, qId: 0 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [4, [9]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [2, 3],
          [
            [1, [4, 5]],
            [
              [6, 7],
              [
                17,
                [
                  [33, [20, 21]],
                  [[34, 35], [49]],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [6] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          1,
          [
            [2, 17],
            [
              [18, [3, 5]],
              [
                [33, [0, 6]],
                [
                  [8, 65],
                  [[34, 37], [51]],
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
      30, 95, 163, 246, 102, 202, 219, 203, 202, 49, 11, 25, 190, 137, 226, 96,
      234, 199, 186, 144, 17, 76, 161, 165, 236, 64, 174, 36, 94, 68, 78, 15,
      222, 28, 245, 179, 230, 6, 35, 135, 165, 229, 222, 174, 195, 179, 234,
      237, 228, 139, 179, 27, 36, 188, 212, 80, 168, 80, 7, 206, 229, 63, 72,
      28, 148, 51, 195, 126, 225, 219, 251, 99, 95, 236, 97, 113, 120, 190, 108,
      253, 28, 156, 172, 247, 166, 24, 226, 4, 91, 21, 190, 168, 181, 142, 199,
      180, 147, 180, 178, 59, 213, 235, 53, 101, 70, 29, 80, 104, 246, 123, 63,
      164, 165, 17, 166, 24, 165, 80, 179, 236, 21, 195, 138, 101, 240, 211,
      249, 156, 243, 188, 143, 28, 136,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
