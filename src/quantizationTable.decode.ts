import { DQT, QuantizationTable, zigZag } from './jpeg'
import { getHiLow, getUint16 } from './common.decode'

const getUint8or16 = (size: 0 | 1) =>
  size ? getUint16 : (data: Uint8Array, offset: number) => data[offset]

export const decodeDQT = (data: Uint8Array): DQT => {
  const tables: DQT['tables'] = []
  let offset = 0
  const { length } = data
  do {
    if (length - offset < 1) {
      throw Error('invalid segment length')
    }
    // The 4 low-order bits are the table identifier (0, 1, 2, or 3).
    // The 4 high-order bits specify the quanization value size
    // (0 = 1 byte, 1 = 2 bytes).
    const [size, id] = <[0 | 1, 0 | 1 | 2 | 3]>getHiLow(data[offset++])
    if (id < 0 || id > 3) {
      throw Error('invalid quantization table identifier')
    }
    if (size < 0 || size > 1) {
      throw Error('invalid quantization value size')
    }
    const bytes = <1 | 2>(size + 1)
    if (bytes * 64 > length - offset) {
      throw Error('invalid segment length')
    }
    const tableData: QuantizationTable = new (size ? Uint16Array : Uint8Array)(
      64
    )
    const getUint = getUint8or16(size)
    for (let i = 0; i < 64; i += 1) {
      tableData[zigZag[i]] = getUint(data, i * bytes + offset)
    }
    tables.push({ id, data: tableData })
    offset += bytes * 64
  } while (offset !== length)
  return {
    type: DQT,
    tables,
  }
}
