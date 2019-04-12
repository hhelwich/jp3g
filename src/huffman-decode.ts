import { DHT, HuffmanTree } from './jpeg'
import { getHiLow } from './decode'
import { InvalidJpegError } from './InvalidJpegError'

/**
 * Build a huffman tree from The counts of huffman codes starting with length
 * 1 and the 1-byte symbols sorted by huffman code.
 */
export const getHuffmanTree = ({
  counts,
  symbols,
}: {
  counts: number[]
  symbols: number[]
}): HuffmanTree => {
  let transferNodes: HuffmanTree[] = []
  let symbolsEnd = symbols.length
  if (counts.reduce((a, b) => a + b, 0) !== symbolsEnd) {
    throw new InvalidJpegError('Invalid huffman table')
  }
  for (let i = counts.length - 1; i >= 0; i -= 1) {
    const count = counts[i]
    const nodes: HuffmanTree = (<HuffmanTree>(
      symbols.slice(symbolsEnd - count, symbolsEnd)
    )).concat(transferNodes)
    transferNodes = []
    for (let j = 0; j < nodes.length; j += 2) {
      transferNodes.push(nodes.slice(j, j + 2))
    }
    symbolsEnd -= count
  }
  if (transferNodes.length > 1) {
    throw new InvalidJpegError('Invalid huffman table')
  }
  return transferNodes[0] || []
}

/**
 * Decode DHT segment
 */
export const decodeDHT = (data: Uint8Array): DHT => {
  // First byte is ignored (length of the segment)
  const [cls, id] = getHiLow(data[2])
  // Get count of Huffman codes of length 1 to 16
  const counts = Array.from(data.subarray(3, 19))
  // Get the symbols sorted by Huffman code
  const symbolCount = counts.reduce((sum, count) => sum + count, 0)
  if (symbolCount + 19 !== data.length) {
    throw new InvalidJpegError('Invalid segment length')
  }
  const symbols = Array.from(data.subarray(19, 19 + symbolCount))
  const tree = getHuffmanTree({ counts, symbols })
  return {
    type: 'DHT',
    cls,
    id,
    tree,
  }
}
