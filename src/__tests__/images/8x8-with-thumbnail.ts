import { JFIFUnits, JPEG } from '../../jpeg'

const jpeg: JPEG = [
  { type: 'SOI' },
  {
    type: 'JFIF',
    version: [1, 1],
    units: JFIFUnits.DotsPerInch,
    density: { x: 72, y: 72 },
  },
  {
    type: 'APP',
    appType: 1,
    // prettier-ignore
    data: new Uint8Array([
      69, 120, 105, 102, 0, 0, 73, 73, 42, 0, 8, 0, 0, 0, 0, 0, 14, 0, 0, 0, 8,
      0, 0, 1, 4, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 1, 4, 0, 1, 0, 0, 0, 0, 1, 0, 0,
      2, 1, 3, 0, 3, 0, 0, 0, 116, 0, 0, 0, 3, 1, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0,
      6, 1, 3, 0, 1, 0, 0, 0, 6, 0, 0, 0, 21, 1, 3, 0, 1, 0, 0, 0, 3, 0, 0, 0,
      1, 2, 4, 0, 1, 0, 0, 0, 122, 0, 0, 0, 2, 2, 4, 0, 1, 0, 0, 0, 196, 7, 0,
      0, 0, 0, 0, 0, 8, 0, 8, 0, 8, 0, 255, 216, 255, 224, 0, 16, 74, 70, 73,
      70, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0, 255, 219, 0, 67, 0, 8, 6, 6, 7, 6, 5, 8,
      7, 7, 7, 9, 9, 8, 10, 12, 20, 13, 12, 11, 11, 12, 25, 18, 19, 15, 20, 29,
      26, 31, 30, 29, 26, 28, 28, 32, 36, 46, 39, 32, 34, 44, 35, 28, 28, 40,
      55, 41, 44, 48, 49, 52, 52, 52, 31, 39, 57, 61, 56, 50, 60, 46, 51, 52,
      50, 255, 219, 0, 67, 1, 9, 9, 9, 12, 11, 12, 24, 13, 13, 24, 50, 33, 28,
      33, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
      50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50,
      50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 255, 192, 0,
      17, 8, 1, 0, 1, 0, 3, 1, 34, 0, 2, 17, 1, 3, 17, 1, 255, 196, 0, 31, 0, 0,
      1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
      10, 11, 255, 196, 0, 181, 16, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1,
      125, 1, 2, 3, 0, 4, 17, 5, 18, 33, 49, 65, 6, 19, 81, 97, 7, 34, 113, 20,
      50, 129, 145, 161, 8, 35, 66, 177, 193, 21, 82, 209, 240, 36, 51, 98, 114,
      130, 9, 10, 22, 23, 24, 25, 26, 37, 38, 39, 40, 41, 42, 52, 53, 54, 55,
      56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 83, 84, 85, 86, 87, 88, 89,
      90, 99, 100, 101, 102, 103, 104, 105, 106, 115, 116, 117, 118, 119, 120,
      121, 122, 131, 132, 133, 134, 135, 136, 137, 138, 146, 147, 148, 149, 150,
      151, 152, 153, 154, 162, 163, 164, 165, 166, 167, 168, 169, 170, 178, 179,
      180, 181, 182, 183, 184, 185, 186, 194, 195, 196, 197, 198, 199, 200, 201,
      202, 210, 211, 212, 213, 214, 215, 216, 217, 218, 225, 226, 227, 228, 229,
      230, 231, 232, 233, 234, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250,
      255, 196, 0, 31, 1, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1,
      2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 255, 196, 0, 181, 17, 0, 2, 1, 2, 4, 4, 3,
      4, 7, 5, 4, 4, 0, 1, 2, 119, 0, 1, 2, 3, 17, 4, 5, 33, 49, 6, 18, 65, 81,
      7, 97, 113, 19, 34, 50, 129, 8, 20, 66, 145, 161, 177, 193, 9, 35, 51, 82,
      240, 21, 98, 114, 209, 10, 22, 36, 52, 225, 37, 241, 23, 24, 25, 26, 38,
      39, 40, 41, 42, 53, 54, 55, 56, 57, 58, 67, 68, 69, 70, 71, 72, 73, 74,
      83, 84, 85, 86, 87, 88, 89, 90, 99, 100, 101, 102, 103, 104, 105, 106,
      115, 116, 117, 118, 119, 120, 121, 122, 130, 131, 132, 133, 134, 135, 136,
      137, 138, 146, 147, 148, 149, 150, 151, 152, 153, 154, 162, 163, 164, 165,
      166, 167, 168, 169, 170, 178, 179, 180, 181, 182, 183, 184, 185, 186, 194,
      195, 196, 197, 198, 199, 200, 201, 202, 210, 211, 212, 213, 214, 215, 216,
      217, 218, 226, 227, 228, 229, 230, 231, 232, 233, 234, 242, 243, 244, 245,
      246, 247, 248, 249, 250, 255, 218, 0, 12, 3, 1, 0, 2, 17, 3, 17, 0, 63, 0,
      226, 232, 162, 138, 249, 147, 247, 16, 162, 138, 40, 3, 160, 162, 138, 43,
      207, 60, 176, 162, 138, 40, 3, 169, 162, 138, 43, 202, 60, 96, 162, 138,
      40, 3, 178, 162, 138, 43, 198, 62, 124, 40, 162, 138, 0, 187, 69, 20, 86,
      7, 204, 133, 20, 81, 64, 24, 212, 81, 69, 119, 31, 50, 20, 81, 69, 0, 101,
      81, 69, 21, 210, 120, 1, 69, 20, 80, 6, 125, 20, 81, 93, 39, 142, 20, 81,
      69, 0, 121, 173, 20, 81, 95, 74, 127, 104, 5, 20, 81, 64, 29, 5, 20, 81,
      94, 121, 229, 133, 20, 81, 64, 29, 77, 20, 81, 94, 81, 227, 5, 20, 81, 64,
      29, 149, 20, 81, 94, 49, 243, 225, 69, 20, 80, 5, 218, 40, 162, 176, 62,
      100, 40, 162, 138, 0, 198, 162, 138, 43, 184, 249, 144, 162, 138, 40, 3,
      42, 138, 40, 174, 147, 192, 10, 40, 162, 128, 51, 232, 162, 138, 233, 60,
      112, 162, 138, 40, 3, 206, 40, 162, 138, 251, 3, 251, 56, 40, 162, 138, 0,
      101, 20, 81, 92, 133, 5, 20, 81, 64, 29, 125, 20, 81, 94, 57, 225, 5, 20,
      81, 64, 30, 131, 69, 20, 87, 207, 159, 44, 20, 81, 69, 0, 105, 209, 69,
      21, 202, 124, 80, 81, 69, 20, 1, 207, 81, 69, 21, 232, 159, 26, 20, 81,
      69, 0, 99, 209, 69, 21, 216, 124, 224, 81, 69, 20, 1, 53, 20, 81, 94, 193,
      152, 81, 69, 20, 1, 230, 84, 81, 69, 123, 7, 246, 144, 81, 69, 20, 0, 202,
      40, 162, 185, 10, 10, 40, 162, 128, 58, 250, 40, 162, 188, 115, 194, 10,
      40, 162, 128, 61, 6, 138, 40, 175, 159, 62, 88, 40, 162, 138, 0, 211, 162,
      138, 43, 148, 248, 160, 162, 138, 40, 3, 158, 162, 138, 43, 209, 62, 52,
      40, 162, 138, 0, 199, 162, 138, 43, 176, 249, 192, 162, 138, 40, 2, 106,
      40, 162, 189, 131, 48, 162, 138, 40, 3, 205, 168, 162, 138, 250, 131, 251,
      60, 40, 162, 138, 0, 109, 20, 81, 92, 197, 5, 20, 81, 64, 30, 93, 69, 20,
      87, 168, 126, 34, 20, 81, 69, 0, 118, 52, 81, 69, 112, 157, 65, 69, 20,
      80, 7, 117, 69, 20, 87, 152, 121, 129, 69, 20, 80, 7, 65, 69, 20, 86, 103,
      204, 133, 20, 81, 64, 26, 148, 81, 69, 73, 241, 65, 69, 20, 80, 4, 180,
      81, 69, 122, 102, 97, 69, 20, 80, 7, 151, 81, 69, 21, 210, 127, 106, 5,
      20, 81, 64, 13, 162, 138, 43, 152, 160, 162, 138, 40, 3, 203, 168, 162,
      138, 245, 15, 196, 66, 138, 40, 160, 14, 198, 138, 40, 174, 19, 168, 40,
      162, 138, 0, 238, 168, 162, 138, 243, 15, 48, 40, 162, 138, 0, 232, 40,
      162, 138, 204, 249, 144, 162, 138, 40, 3, 82, 138, 40, 169, 62, 40, 40,
      162, 138, 0, 150, 138, 40, 175, 76, 204, 40, 162, 138, 0, 243, 58, 40,
      162, 189, 195, 251, 72, 40, 162, 138, 0, 74, 40, 162, 179, 24, 81, 69, 20,
      1, 197, 209, 69, 21, 145, 249, 48, 81, 69, 20, 1, 208, 81, 69, 21, 200,
      122, 97, 69, 20, 80, 7, 164, 81, 69, 21, 227, 31, 149, 133, 20, 81, 64,
      29, 101, 20, 81, 95, 68, 117, 133, 20, 81, 64, 20, 232, 162, 138, 237, 63,
      55, 10, 40, 162, 128, 31, 69, 20, 87, 65, 33, 69, 20, 80, 7, 148, 209, 69,
      21, 202, 127, 108, 5, 20, 81, 64, 9, 69, 20, 86, 99, 10, 40, 162, 128, 56,
      186, 40, 162, 178, 63, 38, 10, 40, 162, 128, 58, 10, 40, 162, 185, 15, 76,
      40, 162, 138, 0, 244, 138, 40, 162, 188, 99, 242, 176, 162, 138, 40, 3,
      172, 162, 138, 43, 232, 142, 176, 162, 138, 40, 2, 157, 20, 81, 93, 167,
      230, 225, 69, 20, 80, 3, 232, 162, 138, 232, 36, 40, 162, 138, 0, 242,
      234, 40, 162, 186, 143, 237, 64, 162, 138, 40, 1, 104, 162, 138, 212, 65,
      69, 20, 80, 6, 93, 20, 81, 94, 97, 249, 224, 81, 69, 20, 1, 213, 81, 69,
      21, 235, 157, 161, 69, 20, 80, 6, 173, 20, 81, 65, 241, 65, 69, 20, 80, 7,
      165, 81, 69, 21, 227, 24, 133, 20, 81, 64, 30, 115, 69, 20, 87, 214, 159,
      152, 133, 20, 81, 64, 22, 232, 162, 138, 200, 196, 40, 162, 138, 0, 225,
      40, 162, 138, 241, 207, 236, 96, 162, 138, 40, 1, 104, 162, 138, 212, 65,
      69, 20, 80, 6, 93, 20, 81, 94, 97, 249, 224, 81, 69, 20, 1, 213, 81, 69,
      21, 235, 157, 161, 69, 20, 80, 6, 173, 20, 81, 65, 241, 65, 69, 20, 80, 7,
      165, 81, 69, 21, 227, 24, 133, 20, 81, 64, 30, 115, 69, 20, 87, 214, 159,
      152, 133, 20, 81, 64, 22, 232, 162, 138, 200, 196, 40, 162, 138, 0, 226,
      104, 162, 138, 200, 254, 196, 10, 40, 162, 128, 31, 69, 20, 87, 81, 33,
      69, 20, 80, 5, 250, 40, 162, 188, 179, 227, 2, 138, 40, 160, 14, 158, 138,
      40, 174, 99, 196, 10, 40, 162, 128, 58, 218, 40, 162, 185, 15, 56, 40,
      162, 138, 0, 237, 232, 162, 138, 243, 136, 10, 40, 162, 128, 62, 76, 162,
      138, 43, 245, 163, 227, 194, 138, 40, 160, 13, 170, 40, 162, 184, 79, 56,
      40, 162, 138, 0, 142, 138, 40, 175, 8, 254, 165, 10, 40, 162, 128, 31, 69,
      20, 87, 81, 33, 69, 20, 80, 5, 250, 40, 162, 188, 179, 227, 2, 138, 40,
      160, 14, 158, 138, 40, 174, 99, 196, 10, 40, 162, 128, 58, 218, 40, 162,
      185, 15, 56, 40, 162, 138, 0, 237, 232, 162, 138, 243, 136, 10, 40, 162,
      128, 62, 76, 162, 138, 43, 245, 163, 227, 194, 138, 40, 160, 13, 170, 40,
      162, 184, 79, 56, 40, 162, 138, 0, 40, 162, 138, 226, 63, 168, 130, 138,
      40, 160, 7, 209, 69, 21, 216, 72, 81, 69, 20, 1, 78, 138, 40, 173, 143,
      52, 40, 162, 138, 0, 207, 162, 138, 43, 164, 241, 130, 138, 40, 160, 12,
      186, 40, 162, 186, 79, 12, 40, 162, 138, 0, 207, 162, 138, 43, 164, 241,
      130, 138, 40, 160, 10, 116, 81, 69, 106, 121, 161, 69, 20, 80, 7, 65, 69,
      20, 87, 1, 230, 5, 20, 81, 64, 29, 77, 20, 81, 95, 56, 127, 67, 133, 20,
      81, 64, 15, 162, 138, 43, 176, 144, 162, 138, 40, 2, 157, 20, 81, 91, 30,
      104, 81, 69, 20, 1, 159, 69, 20, 87, 73, 227, 5, 20, 81, 64, 25, 116, 81,
      69, 116, 158, 24, 81, 69, 20, 1, 159, 69, 20, 87, 73, 227, 5, 20, 81, 64,
      20, 232, 162, 138, 212, 243, 66, 138, 40, 160, 14, 130, 138, 40, 174, 3,
      204, 10, 40, 162, 128, 58, 202, 40, 162, 188, 131, 250, 20, 40, 162, 138,
      0, 175, 69, 20, 86, 135, 24, 81, 69, 20, 1, 86, 138, 40, 173, 78, 0, 162,
      138, 40, 2, 149, 20, 81, 91, 158, 96, 81, 69, 20, 1, 70, 138, 40, 173,
      207, 40, 40, 162, 138, 0, 167, 69, 20, 86, 199, 152, 20, 81, 69, 0, 84,
      162, 138, 43, 83, 128, 40, 162, 138, 0, 175, 69, 20, 86, 135, 16, 81, 69,
      20, 1, 233, 148, 81, 69, 124, 201, 251, 144, 81, 69, 20, 1, 94, 138, 40,
      173, 14, 48, 162, 138, 40, 2, 173, 20, 81, 90, 156, 1, 69, 20, 80, 5, 42,
      40, 162, 183, 60, 192, 162, 138, 40, 2, 141, 20, 81, 91, 158, 80, 81, 69,
      20, 1, 78, 138, 40, 173, 143, 48, 40, 162, 138, 0, 169, 69, 20, 86, 167,
      0, 81, 69, 20, 1, 94, 138, 40, 173, 14, 32, 162, 138, 40, 3, 255, 217,
    ]),
  },
  {
    type: 'DQT',
    tables: [
      {
        id: 0,
        // prettier-ignore
        data: new Uint8Array([
           3,  2,  2,  3,  5,  8, 10, 12,
           2,  2,  3,  4,  5, 12, 12, 11,
           3,  3,  3,  5,  8, 11, 14, 11,
           3,  3,  4,  6, 10, 17, 16, 12,
           4,  4,  7, 11, 14, 22, 21, 15,
           5,  7, 11, 13, 16, 21, 23, 18,
          10, 13, 16, 17, 21, 24, 24, 20,
          14, 18, 19, 20, 22, 20, 21, 20,
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
           3,  4,  5,  9, 20, 20, 20, 20,
           4,  4,  5, 13, 20, 20, 20, 20,
           5,  5, 11, 20, 20, 20, 20, 20,
           9, 13, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
          20, 20, 20, 20, 20, 20, 20, 20,
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
          [1, 2],
          [
            [3, [4, 5]],
            [
              [6, 7],
              [17, [[0, 18], [35]]],
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
          [1, [2, 17]],
          [
            [
              [3, 5],
              [33, 49],
            ],
            [
              [81, [0, 4]],
              [
                [8, [18, 20]],
                [[34, 65], [82]],
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
      57, 175, 54, 197, 22, 174, 199, 47, 148, 89, 86, 99, 33, 181, 153, 34,
      146, 221, 143, 199, 72, 204, 222, 197, 145, 31, 234, 177, 16, 20, 2, 238,
      67, 184, 28, 94, 14, 244, 15, 17, 163, 142, 208, 166, 243, 20, 110, 149,
      11, 46, 160, 70, 28, 56, 43, 207, 139, 4, 27, 187, 223, 75, 121, 35, 38,
      152, 207, 83, 23, 181, 93, 40, 82, 41, 132, 56, 113, 95, 178, 122, 158,
      225, 143, 173, 127,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
