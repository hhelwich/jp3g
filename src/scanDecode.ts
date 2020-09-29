import { Jpeg, SOF } from './jpeg'
import { InvalidJpegError } from './InvalidJpegError'

export const prepareScanDecode = (sof: SOF) => {
  const maxH = Math.max(...sof.components.map(component => component.h))
  const maxV = Math.max(...sof.components.map(component => component.v))
  const mcusPerLine = Math.ceil(sof.width / 8 / maxH)
  const mcusPerColumn = Math.ceil(sof.height / 8 / maxV)
  const components = sof.components.map(({ id, h, v, qId }) => {
    const blocksPerLine = Math.ceil((Math.ceil(sof.width / 8) * h) / maxH)
    const blocksPerColumn = Math.ceil((Math.ceil(sof.height / 8) * v) / maxV)
    const blocksPerLineForMcu = mcusPerLine * h
    const blocksPerColumnForMcu = mcusPerColumn * v
    const blocksBufferSize =
      64 * blocksPerColumnForMcu * (blocksPerLineForMcu + 1)
    return {
      id,
      h,
      v,
      qId,
      blocksBufferSize,
      blocksPerLine,
      blocksPerColumn,
    }
  })
  return {
    maxH,
    maxV,
    mcusPerLine,
    mcusPerColumn,
    components,
  }
}

export const decodeScan = (jpeg: Jpeg) => {
  const sofs = jpeg.filter((segment): segment is SOF => segment.type === 'SOF')
  if (sofs.length !== 1) {
    throw new InvalidJpegError('Should have exactly one SOF')
  }
  const [sof] = sofs
  const hMax = Math.max(...sof.components.map(component => component.h))
  const vMax = Math.max(...sof.components.map(component => component.v))
  // For any component, the number of pixels a data unit spans is
  const dataUnitSizes = sof.components.map(({ h, v }) => ({
    x: (8 * hMax) / h,
    y: (8 * vMax) / v,
  }))
  const interleaved = sof.components.length > 1
  if (sof.components.length === 0) {
    throw new InvalidJpegError('No components found')
  }
  // data unit: An 8 × 8 block of samples of one component
  // horizontal sampling factor: The relative number of horizontal data units of a particular component with respect
  //   to the number of horizontal data units in the other components.
  // vertical sampling factor: The relative number of vertical data units of a particular component with respect to
  //   the number of vertical data units in the other components in the frame.
  // minimum coded unit; MCU: The smallest group of data units that is coded.
  const mcuSizes = interleaved
    ? {
        //the MCU contains one or more data units from each component
        x: (sof.width + 8 * hMax - 1) / (8 * hMax),
        y: (sof.height + 8 * hMax - 1) / (8 * hMax),
      }
    : {
        // image data is non-interleaved => the MCU is defined to be one data unit.
        x: sof.width + dataUnitSizes[0].x - 1,
        y: sof.height + dataUnitSizes[0].y - 1,
      }
  console.log(mcuSizes)
}
