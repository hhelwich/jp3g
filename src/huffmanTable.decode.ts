import { DHT, DHT_TABLE, HuffmanTree } from './jpeg'
import { getHiLow } from './common.decode'
import { InvalidJpegError } from './InvalidJpegError'
import { array } from './util'

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
      array(symbols, symbolsEnd - count, symbolsEnd)
    )).concat(transferNodes)
    transferNodes = []
    for (let j = 0; j < nodes.length; j += 2) {
      transferNodes.push(array(nodes, j, j + 2))
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
  const { length } = data
  let offset = 0
  const tables: DHT_TABLE[] = []
  do {
    if (length - offset < 17) {
      throw new InvalidJpegError('Invalid segment length')
    }
    const [cls, id] = getHiLow(data[offset++])
    // Get count of Huffman codes of length 1 to 16
    const counts = array(data.subarray(offset, offset + 16))
    offset += 16
    // Get the symbols sorted by Huffman code
    const symbolCount = counts.reduce((sum, count) => sum + count, 0)
    if (symbolCount > length - offset) {
      throw new InvalidJpegError('Invalid segment length')
    }
    const symbols = array(data.subarray(offset, offset + symbolCount))
    offset += symbolCount
    const tree = getHuffmanTree({ counts, symbols })
    tables.push({
      cls,
      id,
      tree,
    })
  } while (offset !== length)
  return {
    type: DHT,
    tables,
  }
}
