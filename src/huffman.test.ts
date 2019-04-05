import { getHuffmanTree } from './huffman-decode'
import { getHuffmanCodeCounts } from './huffman-encode'

describe('huffman', () => {
  describe('getHuffmanTree', () => {
    it('returns empty tree for empty symbols and code lengths', () => {
      expect(getHuffmanTree({ counts: [], symbols: [] })).toEqual([])
    })
    it('returns expected tree for single symbol with code length 1', () => {
      expect(getHuffmanTree({ counts: [1], symbols: [42] })).toEqual([42])
    })
    it('returns expected tree for single symbol with code length 4', () => {
      expect(getHuffmanTree({ counts: [0, 0, 0, 1], symbols: [42] })).toEqual([
        [[[42]]],
      ])
    })
    it('ignores trailing zero counts', () => {
      expect(
        getHuffmanTree({ counts: [0, 0, 0, 1, 0, 0, 0], symbols: [42] })
      ).toEqual([[[[42]]]])
    })
    it('throws on wrong symbol count', () => {
      ;[19, 21].forEach(symbolCount => {
        expect(() => {
          getHuffmanTree({
            counts: [0, 1, 1, 2, 3, 5, 8],
            symbols: [...Array(symbolCount).keys()],
          })
        }).toThrow()
      })
    })
    it('can handle full tree', () => {
      getHuffmanTree({ counts: [2], symbols: [0, 1] })
      getHuffmanTree({ counts: [0, 1, 1, 10], symbols: [...Array(12).keys()] })
    })
    it('throws on overfull tree', () => {
      expect(() => {
        getHuffmanTree({ counts: [3], symbols: [0, 1, 2] })
      }).toThrow()
      expect(() => {
        getHuffmanTree({
          counts: [0, 1, 1, 11],
          symbols: [...Array(13).keys()],
        })
      }).toThrow()
    })
    it('returns expected tree for more complex code lengths', () => {
      expect(
        getHuffmanTree({
          counts: [0, 1, 1, 2, 3, 5, 8],
          symbols: [...Array(20).keys()],
        })
      ).toEqual([
        [0, [1, [2, 3]]],
        [
          [
            [[4, 5], [6, [7, 8]]],
            [[[9, 10], [11, [12, 13]]], [[[14, 15], [16, 17]], [[18, 19]]]],
          ],
        ],
      ])
    })
  })
  describe('getHuffmanCodeCounts', () => {
    it('returns empty counts & symbols for empty tree', () => {
      expect(getHuffmanCodeCounts([])).toEqual({ counts: [], symbols: [] })
    })
    it('returns correct counts & symbols for single symbol with code length 1', () => {
      expect(getHuffmanCodeCounts([42])).toEqual({ counts: [1], symbols: [42] })
    })
    it('returns correct counts & symbols for single symbol with code length 4', () => {
      expect(getHuffmanCodeCounts([[[[42]]]])).toEqual({
        counts: [0, 0, 0, 1],
        symbols: [42],
      })
    })
    it('returns expected counts & symbols for more complex tree', () => {
      expect(
        getHuffmanCodeCounts([
          [0, [1, [2, 3]]],
          [
            [
              [[4, 5], [6, [7, 8]]],
              [[[9, 10], [11, [12, 13]]], [[[14, 15], [16, 17]], [[18, 19]]]],
            ],
          ],
        ])
      ).toEqual({
        counts: [0, 1, 1, 2, 3, 5, 8],
        symbols: [...Array(20).keys()],
      })
    })
    it('(getHuffmanCodeCounts ∘ getHuffmanTree) is identity', () => {
      const huffDef = {
        counts: [0, 1, 1, 2, 3, 5, 8],
        symbols: [...Array(20).keys()],
      }
      expect(getHuffmanCodeCounts(getHuffmanTree(huffDef))).toEqual(huffDef)
    })
  })
})