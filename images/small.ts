import { Jpeg } from '../src/jpeg'

const jpeg: Jpeg = [
  { type: 'SOI' },
  {
    type: 'APP',
    appType: 0,
    data: new Uint8Array([74, 70, 73, 70, 0, 1, 1, 1, 0, 72, 0, 72, 0, 0]),
  },
  { type: 'COM', text: 'Foo' },
  {
    type: 'DQT',
    tables: [
      {
        id: 0,
        bytes: 1,
        // prettier-ignore
        values: [
           9,  6,  5,  9, 13, 22, 28, 33,
           6,  6,  8, 10, 14, 31, 32, 30,
           8,  7,  9, 13, 22, 31, 37, 30,
           8,  9, 12, 16, 28, 47, 43, 33,
          10, 12, 20, 30, 37, 59, 56, 42,
          13, 19, 30, 35, 44, 56, 61, 50,
          26, 35, 42, 47, 56, 65, 65, 55,
          39, 50, 51, 53, 60, 54, 56, 53,
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
           9, 10, 13, 25, 53, 53, 53, 53,
          10, 11, 14, 36, 53, 53, 53, 53,
          13, 14, 30, 53, 53, 53, 53, 53,
          25, 36, 53, 53, 53, 53, 53, 53,
          53, 53, 53, 53, 53, 53, 53, 53,
          53, 53, 53, 53, 53, 53, 53, 53,
          53, 53, 53, 53, 53, 53, 53, 53,
          53, 53, 53, 53, 53, 53, 53, 53,
        ],
      },
    ],
  },
  {
    type: 'SOF',
    frameType: 0,
    precision: 8,
    width: 19,
    height: 13,
    components: [
      { id: 1, h: 2, v: 2, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 0,
        tree: [
          [0, 4],
          [[2, 5], [7]],
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
          1,
          [
            [2, [0, 3]],
            [
              [4, 0x11],
              [
                [5, 0x21],
                [
                  [0x13, 0x41],
                  [
                    [0x31, 0x51],
                    [0x91, [0xb1]],
                  ],
                ],
              ],
            ],
          ],
        ],
      },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [2] }] },
  {
    type: 'DHT',
    tables: [{ cls: 1, id: 1, tree: [0, [0x11, [[0x21, 0x22], [0x61]]]] }],
  },
  {
    type: 'SOS',
    components: [
      { id: 1, dcTbl: 0, acTbl: 0 },
      { id: 2, dcTbl: 1, acTbl: 1 },
      { id: 3, dcTbl: 1, acTbl: 1 },
    ],
    specStart: 0,
    specEnd: 63,
    ah: 0,
    al: 0,
    data: new Uint8Array([
      0xcd,
      0xb8,
      0xec,
      0x4b,
      0xd9,
      0xd9,
      0x25,
      0xab,
      0x3a,
      0x14,
      0x76,
      0xc9,
      0xd0,
      0x14,
      0xed,
      0xee,
      0x2a,
      0xe5,
      0x9b,
      0x79,
      0x31,
      0xbd,
      0x29,
      0x46,
      0x56,
      0x12,
      0x22,
      0xbd,
      0x3b,
      0xf8,
      0xfe,
      0x52,
      0x9c,
      0x6e,
      0x74,
      0xf0,
      0x6e,
      0x33,
      0x84,
      0x63,
      0x24,
      0xf4,
      0xd3,
      0xd9,
      0xfc,
      0xad,
      0xfe,
      0x49,
      0xf2,
      0x64,
      0xa3,
      0xa8,
      0xec,
      0x89,
      0xd0,
      0x1f,
      0x45,
      0x2d,
      0xaf,
      0x03,
      0x0a,
      0xbf,
      0x1c,
      0x7d,
      0xae,
      0xe8,
      0xa9,
      0x8f,
      0x5d,
      0x07,
      0xe5,
      0x14,
      0xe8,
      0xbf,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
