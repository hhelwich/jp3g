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
    frameType: 2,
    precision: 8,
    width: 8,
    height: 8,
    components: [
      { id: 1, h: 1, v: 1, qId: 0 },
      { id: 2, h: 1, v: 1, qId: 1 },
      { id: 3, h: 1, v: 1, qId: 1 },
    ],
  },
  { type: 'DHT', tables: [{ cls: 0, id: 0, tree: [5] }] },
  { type: 'DHT', tables: [{ cls: 0, id: 1, tree: [5] }] },
  {
    type: 'SOS',
    components: [
      { id: 1, dcId: 0, acId: 0 },
      { id: 2, dcId: 1, acId: 0 },
      { id: 3, dcId: 1, acId: 0 },
    ],
    specStart: 0,
    specEnd: 0,
    ah: 0,
    al: 1,
    // prettier-ignore
    data: new Uint8Array([
      53, 21, 191,
    ]),
  },
  { type: 'DHT', tables: [{ cls: 1, id: 0, tree: [5, [2, [4]]] }] },
  {
    type: 'SOS',
    components: [{ id: 1, dcId: 0, acId: 0 }],
    specStart: 1,
    specEnd: 5,
    ah: 0,
    al: 2,
    // prettier-ignore
    data: new Uint8Array([
      61, 104, 47, 63,
    ]),
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [4, [0, 1]],
          [
            [
              [2, 7],
              [19, 49],
            ],
            [[113, 161], [225]],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [{ id: 3, dcId: 0, acId: 1 }],
    specStart: 1,
    specEnd: 63,
    ah: 0,
    al: 1,
    // prettier-ignore
    data: new Uint8Array([
      153, 1, 144, 115, 69, 73, 241, 174, 221, 127,
    ]),
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, [2, 4]],
          [
            [129, [0, 3]],
            [[7, 49], [240]],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [{ id: 2, dcId: 0, acId: 1 }],
    specStart: 1,
    specEnd: 63,
    ah: 0,
    al: 1,
    // prettier-ignore
    data: new Uint8Array([
      24, 237, 46, 220, 11, 165, 51, 198, 53, 95,
    ]),
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 0,
        tree: [
          [1, [2, 3]],
          [
            [4, 17],
            [[0, 19], [193]],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [{ id: 1, dcId: 0, acId: 0 }],
    specStart: 6,
    specEnd: 63,
    ah: 0,
    al: 2,
    // prettier-ignore
    data: new Uint8Array([
      125, 18, 166, 29, 86, 11, 113, 194, 123, 89,
    ]),
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
            [17, 33],
            [49, [0, [65]]],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [{ id: 1, dcId: 0, acId: 0 }],
    specStart: 1,
    specEnd: 63,
    ah: 2,
    al: 1,
    // prettier-ignore
    data: new Uint8Array([
      184, 144, 5, 102, 65, 166, 53, 183, 206,
    ]),
  },
  {
    type: 'SOS',
    components: [
      { id: 1, dcId: 0, acId: 0 },
      { id: 2, dcId: 0, acId: 0 },
      { id: 3, dcId: 0, acId: 0 },
    ],
    specStart: 0,
    specEnd: 0,
    ah: 1,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      255, 0,
    ]),
  },
  {
    type: 'DHT',
    tables: [
      {
        cls: 1,
        id: 1,
        tree: [
          [1, 33],
          [
            [17, 49],
            [81, [0, [65]]],
          ],
        ],
      },
    ],
  },
  {
    type: 'SOS',
    components: [{ id: 3, dcId: 0, acId: 1 }],
    specStart: 1,
    specEnd: 63,
    ah: 1,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      175, 84, 65, 100, 196, 135, 178, 214, 32, 249, 223,
    ]),
  },
  {
    type: 'DHT',
    tables: [{ cls: 1, id: 1, tree: [1, [17, [49, [81, [0]]]]] }],
  },
  {
    type: 'SOS',
    components: [{ id: 2, dcId: 0, acId: 1 }],
    specStart: 1,
    specEnd: 63,
    ah: 1,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      239, 230, 132, 229, 40, 247, 129, 237, 187, 239,
    ]),
  },
  { type: 'DHT', tables: [{ cls: 1, id: 0, tree: [1, [17, [0, [33]]]] }] },
  {
    type: 'SOS',
    components: [{ id: 1, dcId: 0, acId: 0 }],
    specStart: 1,
    specEnd: 63,
    ah: 1,
    al: 0,
    // prettier-ignore
    data: new Uint8Array([
      110, 165, 84, 135, 94, 128, 23, 12, 144, 90, 27,
    ]),
  },
  { type: 'EOI' },
]

export default jpeg
