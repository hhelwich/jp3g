import { DHT, Marker, HuffmanTree } from './jpeg'
import { setUint16, setHiLow } from './common.encode'

/**
 * Populate a map of symbols by code lengths for a given huffman tree node and
 * all its children
 */
const getHuffmanNodeCodeCounts = (
  node: HuffmanTree | number | undefined,
  codeLength: number,
  symbolsOfLengths: (number[] | undefined)[]
) => {
  if (typeof node === 'number') {
    let symbolsOfLength = symbolsOfLengths[codeLength]
    if (symbolsOfLength == null) {
      symbolsOfLength = symbolsOfLengths[codeLength] = []
    }
    symbolsOfLength.push(node)
  } else if (node != null) {
    getHuffmanNodeCodeCounts(node[0], codeLength + 1, symbolsOfLengths)
    getHuffmanNodeCodeCounts(node[1], codeLength + 1, symbolsOfLengths)
  }
}

/**
 * Return counts of huffman codes starting with length 1 and the 1-byte symbols
 * sorted by huffman code for a given huffman tree
 */
export const getHuffmanCodeCounts = (huffmanTable: HuffmanTree) => {
  const symbolsOfLengths: number[][] = []
  const counts: number[] = []
  const symbols: number[] = []
  getHuffmanNodeCodeCounts(huffmanTable, -1, symbolsOfLengths)
  for (let i = 0; i < symbolsOfLengths.length; i += 1) {
    const symbolsOfLength = symbolsOfLengths[i]
    if (symbolsOfLength == null) {
      counts[i] = 0
    } else {
      counts[i] = symbolsOfLength.length
      symbols.push(...symbolsOfLength)
    }
  }
  return { counts, symbols }
}

const assureHuffmanCounts16 = (counts: number[]) => {
  let i = counts.length
  if (i > 16) {
    throw Error(`Exceeded maximum code length`)
  }
  for (; i < 16; i += 1) {
    counts.push(0)
  }
}

/**
 * Returns the number of symbols in the given huffman node and its children
 */
const getHuffmanNodeSize = (node: HuffmanTree | number | undefined): number =>
  node == null
    ? 0
    : typeof node === 'number'
    ? 1
    : getHuffmanNodeSize(node[0]) + getHuffmanNodeSize(node[1])

/**
 * Returns the number of bytes needed to encode the given DHT segment
 */
export const getDhtLength = ({ tables }: DHT) =>
  tables.reduce((len, { tree }) => len + getHuffmanNodeSize(tree) + 17, 4)

export const encodeDHT = (segment: DHT, offset: number, buffer: Uint8Array) => {
  buffer[offset++] = 0xff
  buffer[offset++] = Marker.DHT
  offset = setUint16(buffer, offset, getDhtLength(segment) - 2)
  for (const { cls, id, tree } of segment.tables) {
    buffer[offset++] = setHiLow(cls, id)
    const { counts, symbols } = getHuffmanCodeCounts(tree)
    assureHuffmanCounts16(counts)
    buffer.set(counts, offset)
    offset += 16
    buffer.set(symbols, offset)
    offset += symbols.length
  }
  return offset
}
