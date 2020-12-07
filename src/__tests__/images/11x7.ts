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
           6,  4,  4,  6, 10, 16, 20, 24,
           5,  5,  6,  8, 10, 23, 24, 22,
           6,  5,  6, 10, 16, 23, 28, 22,
           6,  7,  9, 12, 20, 35, 32, 25,
           7,  9, 15, 22, 27, 44, 41, 31,
          10, 14, 22, 26, 32, 42, 45, 37,
          20, 26, 31, 35, 41, 48, 48, 40,
          29, 37, 38, 39, 45, 40, 41, 40,
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
           7,  7, 10, 19, 40, 40, 40, 40,
           7,  8, 10, 26, 40, 40, 40, 40,
          10, 10, 22, 40, 40, 40, 40, 40,
          19, 26, 40, 40, 40, 40, 40, 40,
          40, 40, 40, 40, 40, 40, 40, 40,
          40, 40, 40, 40, 40, 40, 40, 40,
          40, 40, 40, 40, 40, 40, 40, 40,
          40, 40, 40, 40, 40, 40, 40, 40,
        ],
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 11,
    height: 7,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [5, [6]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [3, [1, 2]],
          [
            [4, 17],
            [
              [5, 6],
              [
                [0, 33],
                [65, [225]],
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
          [1, [2, 17]],
          [
            [
              [0, 3],
              [4, 33],
            ],
            [
              [
                [5, 7],
                [18, 22],
              ],
              [
                [49, 65],
                [[35, 81], [177]],
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
      11, 95, 204, 135, 87, 150, 121, 51, 167, 100, 71, 0, 227, 65, 150, 60, 48,
      137, 234, 238, 238, 237, 234, 148, 190, 116, 169, 198, 102, 101, 196, 172,
      80, 165, 74, 103, 23, 14, 72, 248, 12, 95, 230, 13, 52, 218, 218, 109, 26,
      217, 29, 134, 191, 110, 198, 199, 215, 109, 110, 46, 241, 65, 23, 125,
      196, 26, 56, 200, 216, 198, 70, 185, 45, 18, 254, 113, 141, 129, 79, 39,
      198, 7, 17, 149, 166, 96, 21, 72, 81, 73, 80, 143,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
