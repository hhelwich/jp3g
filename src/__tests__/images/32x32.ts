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
    width: 32,
    height: 32,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [7, [6, [5, [4]]]] }] },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [0, 2]],
          [
            [3, [4, 5]],
            [
              [17, [6, 18]],
              [
                [
                  [33, 34],
                  [65, 81],
                ],
                [
                  [97, [7, 19]],
                  [
                    [49, 82],
                    [145, [177]],
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
    type: 'DHT',
    tables: [
      {
        cls: 0,
        id: 1,
        tree: [
          [5, 6],
          [7, [3, [8, [4, [9]]]]],
        ],
      },
    ],
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, 3],
          [
            [0, 2],
            [
              4,
              [
                [5, [17, 33]],
                [
                  [49, 65],
                  [
                    [6, 18],
                    [20, [34]],
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
      137, 183, 86, 58, 146, 102, 228, 242, 103, 241, 38, 106, 203, 212, 78,
      136, 122, 67, 107, 25, 253, 61, 184, 182, 162, 72, 192, 118, 114, 146, 57,
      84, 26, 3, 16, 121, 188, 198, 128, 202, 141, 67, 80, 35, 115, 178, 80,
      188, 148, 235, 34, 63, 32, 212, 22, 72, 145, 179, 72, 233, 228, 63, 84,
      201, 147, 29, 153, 234, 76, 117, 234, 45, 180, 30, 116, 89, 85, 70, 241,
      230, 222, 167, 126, 139, 201, 173, 29, 106, 108, 85, 80, 251, 141, 195, 9,
      25, 39, 162, 195, 93, 47, 244, 36, 72, 114, 241, 27, 83, 249, 243, 29,
      172, 86, 45, 207, 27, 89, 200, 58, 247, 67, 50, 226, 99, 192, 189, 135,
      105, 61, 217, 163, 244, 52, 214, 190, 38, 236, 116, 184, 232, 139, 101,
      248, 249, 88, 238, 36, 126, 205, 235, 8, 91, 22, 83, 250, 184, 241, 111,
      83, 232, 73, 188, 215, 211, 182, 30, 13, 195, 56, 161, 202, 69, 19, 220,
      249, 146, 183, 48, 34, 157, 7, 152, 187, 162, 44, 83, 66, 25, 24, 220, 99,
      31, 3, 178, 243, 108, 117, 109, 223, 220, 74, 110, 69, 155, 155, 1, 9,
      237, 90, 213, 213, 12, 105, 50, 231, 62, 83, 243, 248, 161, 67, 226, 73,
      244, 112, 130, 135, 196, 202, 123, 131, 27, 229, 104, 148, 138, 206, 214,
      107, 126, 162, 99, 92, 100, 46, 5, 18, 85, 122, 69, 142, 65, 166, 192,
      201, 91, 140, 123, 137, 224, 138, 42, 221, 34, 31, 32, 161, 98, 103, 29,
      29, 100, 148, 82, 96, 19, 179, 248, 182, 98, 131, 4, 81, 215, 140, 90,
      127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg