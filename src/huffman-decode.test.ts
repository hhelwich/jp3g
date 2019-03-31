import { getHuffmanTree } from './huffman-decode'
import { DHT } from './jpeg'
import { getHuffmanCodeCounts16 } from './huffman-encode'

const huffman0 = {
  counts: [0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 125],
  symbols: [
    1,
    2,
    3,
    0,
    4,
    17,
    5,
    18,
    33,
    49,
    65,
    6,
    19,
    81,
    97,
    7,
    34,
    113,
    20,
    50,
    129,
    145,
    161,
    8,
    35,
    66,
    177,
    193,
    21,
    82,
    209,
    240,
    36,
    51,
    98,
    114,
    130,
    9,
    10,
    22,
    23,
    24,
    25,
    26,
    37,
    38,
    39,
    40,
    41,
    42,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    131,
    132,
    133,
    134,
    135,
    136,
    137,
    138,
    146,
    147,
    148,
    149,
    150,
    151,
    152,
    153,
    154,
    162,
    163,
    164,
    165,
    166,
    167,
    168,
    169,
    170,
    178,
    179,
    180,
    181,
    182,
    183,
    184,
    185,
    186,
    194,
    195,
    196,
    197,
    198,
    199,
    200,
    201,
    202,
    210,
    211,
    212,
    213,
    214,
    215,
    216,
    217,
    218,
    225,
    226,
    227,
    228,
    229,
    230,
    231,
    232,
    233,
    234,
    241,
    242,
    243,
    244,
    245,
    246,
    247,
    248,
    249,
    250,
  ],
  tree: [
    [1, 2],
    [
      [3, [0, 4]],
      [
        [17, [5, 18]],
        [
          [33, [49, 65]],
          [
            [[6, 19], [81, 97]],
            [
              [[7, 34], [113, [20, 50]]],
              [
                [[129, 145], [161, [8, 35]]],
                [
                  [[66, 177], [193, [21, 82]]],
                  [
                    [[209, 240], [[36, 51], [98, 114]]],
                    [
                      [
                        [
                          [
                            [[130, [9, 10]], [[22, 23], [24, 25]]],
                            [[[26, 37], [38, 39]], [[40, 41], [42, 52]]],
                          ],
                          [
                            [[[53, 54], [55, 56]], [[57, 58], [67, 68]]],
                            [[[69, 70], [71, 72]], [[73, 74], [83, 84]]],
                          ],
                        ],
                        [
                          [
                            [[[85, 86], [87, 88]], [[89, 90], [99, 100]]],
                            [
                              [[101, 102], [103, 104]],
                              [[105, 106], [115, 116]],
                            ],
                          ],
                          [
                            [
                              [[117, 118], [119, 120]],
                              [[121, 122], [131, 132]],
                            ],
                            [
                              [[133, 134], [135, 136]],
                              [[137, 138], [146, 147]],
                            ],
                          ],
                        ],
                      ],
                      [
                        [
                          [
                            [
                              [[148, 149], [150, 151]],
                              [[152, 153], [154, 162]],
                            ],
                            [
                              [[163, 164], [165, 166]],
                              [[167, 168], [169, 170]],
                            ],
                          ],
                          [
                            [
                              [[178, 179], [180, 181]],
                              [[182, 183], [184, 185]],
                            ],
                            [
                              [[186, 194], [195, 196]],
                              [[197, 198], [199, 200]],
                            ],
                          ],
                        ],
                        [
                          [
                            [
                              [[201, 202], [210, 211]],
                              [[212, 213], [214, 215]],
                            ],
                            [
                              [[216, 217], [218, 225]],
                              [[226, 227], [228, 229]],
                            ],
                          ],
                          [
                            [
                              [[230, 231], [232, 233]],
                              [[234, 241], [242, 243]],
                            ],
                            [[[244, 245], [246, 247]], [[248, 249], [250]]],
                          ],
                        ],
                      ],
                    ],
                  ],
                ],
              ],
            ],
          ],
        ],
      ],
    ],
  ],
}

describe('huffman', () => {
  it('maps [counts, symbols] <-> tree', () => {
    const { counts, symbols, tree } = huffman0
    expect(getHuffmanTree(counts, symbols)).toEqual(tree)
    expect(getHuffmanCodeCounts16(tree)).toEqual({ counts, symbols })
  })
})
