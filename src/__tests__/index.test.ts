import jp3g from '..'
import {
  promisify,
  getExpectedImageData,
  getExpectedJpeg,
  getJpegBuffer,
  getJpegArrayBuffers,
} from './util/testUtil'
import { fakeBlob, workerMock } from './util/fakeBrowserApi'
import { decodeJpeg } from '../jpeg.decode'

describe('index', () => {
  it('has version', () => {
    expect(jp3g.version).toMatch(/^\d+\.\d+\.\d+$/)
  })
  const jpegData = getJpegBuffer('8x8')
  describe('toObject', () => {
    it('decodes ArrayBuffer to JPEG object', async () => {
      const jpegArrayBuffer = new Uint8Array(jpegData).buffer
      const jpeg = await jp3g(jpegArrayBuffer).toObject()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('decodes node.js Uint8Array to JPEG object', async () => {
      const jpeg = await jp3g(new Uint8Array(jpegData)).toObject()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('decodes node.js Buffer to JPEG object', async () => {
      const jpeg = await jp3g(jpegData).toObject()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('decodes Blob to JPEG object', async () => {
      const jpeg = await jp3g(fakeBlob(jpegData)).toObject()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('fails on Blob reading error', async () => {
      const jpeg = jp3g(fakeBlob(Error('oops'))).toObject()
      await expect(jpeg).rejects.toThrow('oops')
    })
    it('returns JPEG object used for construction', async () => {
      const jpeg0 = await jp3g(jpegData).toObject()
      const jpeg = await jp3g(jpeg0).toObject()
      expect(jpeg).toBe(jpeg0)
    })
    it('can be used with callback', async () => {
      const jpeg = await promisify(jp3g(jpegData).toObject)()
      expect(jpeg).toEqual(await getExpectedJpeg('8x8'))
    })
    it('does run in main thread if worker count is not set', async () => {
      workerMock.reset()
      await jp3g(jpegData).toObject()
      expect(workerMock.operations).toEqual([])
    })
    it('does not copy any buffers when decode in worker', async () => {
      workerMock.reset()
      jp3g.setWorkerCount(1)
      const jpeg = await jp3g(jpegData).toObject()
      // Input buffer should not be copied
      expect(workerMock.operations.length).toBe(1)
      const { inputTransfer, outputTransfer } = workerMock.operations[0]
      expect(inputTransfer?.length).toBe(1)
      expect(inputTransfer?.[0]).toBe(jpegData.buffer)
      // Output buffers should not be copied
      const outputBuffers = getJpegArrayBuffers(jpeg)
      expect(outputBuffers.length).toBe(3)
      expect(outputTransfer?.length).toBe(3)
      expect(outputTransfer?.[0]).toBe(outputBuffers[0])
      expect(outputTransfer?.[1]).toBe(outputBuffers[1])
      expect(outputTransfer?.[2]).toBe(outputBuffers[2])
      // Revert
      jp3g.setWorkerCount(0)
    })
  })
  describe('toBuffer', () => {
    it('wraps ArrayBuffer in Uint8Array', async () => {
      const arrayBuffer = new Uint8Array(jpegData).buffer
      const jpegBuffer = await jp3g(arrayBuffer).toBuffer()
      expect(jpegBuffer.buffer).toBe(arrayBuffer)
    })
    it('is identity for direct Uint8Array', async () => {
      const uint8Array = new Uint8Array(jpegData)
      const jpegBuffer = await jp3g(uint8Array).toBuffer()
      expect(jpegBuffer).toBe(uint8Array)
    })
    it('is identity for node.js Buffer', async () => {
      const jpegBuffer = await jp3g(jpegData).toBuffer()
      expect(jpegBuffer).toBe(jpegData)
    })
    it('reads Blob to memory', async () => {
      const jpegBuffer = await jp3g(fakeBlob(jpegData)).toBuffer()
      expect(jpegBuffer).toEqual(new Uint8Array(jpegData))
    })
    it('fails on Blob reading error', async () => {
      const jpegBuffer = jp3g(fakeBlob(Error('oops'))).toBuffer()
      await expect(jpegBuffer).rejects.toThrow('oops')
    })
    it('encodes jpeg object', async () => {
      const jpeg = decodeJpeg(jpegData)
      const jpegBuffer = await jp3g(jpeg).toBuffer()
      expect(jpegBuffer).toEqual(new Uint8Array(jpegData))
    })
    it('can be used with callback', async () => {
      const jpeg = await promisify(jp3g(jpegData).toBuffer)()
      expect(jpeg).toBe(jpegData)
    })
    it('does not copy any buffers when encode in worker', async () => {
      workerMock.reset()
      jp3g.setWorkerCount(1)
      const jpeg = await getExpectedJpeg('8x8')
      const buffer = await jp3g(jpeg).toBuffer()
      // Input buffer should not be copied
      expect(workerMock.operations.length).toBe(1)
      const { inputTransfer, outputTransfer } = workerMock.operations[0]
      const inputBuffers = getJpegArrayBuffers(jpeg)
      expect(inputBuffers.length).toBe(3)
      expect(inputTransfer?.length).toBe(3)
      expect(inputTransfer?.[0]).toBe(inputBuffers[0])
      expect(inputTransfer?.[1]).toBe(inputBuffers[1])
      expect(inputTransfer?.[2]).toBe(inputBuffers[2])
      // Output buffers should not be copied
      expect(outputTransfer?.length).toBe(1)
      expect(outputTransfer?.[0]).toBe(buffer.buffer)
      // Revert
      jp3g.setWorkerCount(0)
    })
  })
  describe('toImageData', () => {
    it('returns ImageData for JPEG in ArrayBuffer', async () => {
      const arrayBuffer = new Uint8Array(jpegData).buffer
      const imageData = await jp3g(arrayBuffer).toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
    it('returns ImageData for JPEG in direct Uint8Array', async () => {
      const uint8Array = new Uint8Array(jpegData)
      const imageData = await jp3g(uint8Array).toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
    it('returns ImageData for JPEG in node.js Buffer', async () => {
      const imageData = await jp3g(jpegData).toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
    it('returns ImageData for JPEG in Blob', async () => {
      const imageData = await jp3g(fakeBlob(jpegData)).toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
    it('fails on Blob reading error', async () => {
      const imageData = jp3g(fakeBlob(Error('oops'))).toImageData()
      await expect(imageData).rejects.toThrow('oops')
    })
    it('can be used with callback', async () => {
      const imageData = await promisify(jp3g(jpegData).toImageData)()
      expect(imageData).toEqual(await getExpectedImageData('8x8'))
    })
    it('does not copy any buffers when decode image data in worker', async () => {
      workerMock.reset()
      jp3g.setWorkerCount(1)
      const jpeg = await getExpectedJpeg('8x8')
      const imageData = await jp3g(jpeg).toImageData()
      // Input buffer should not be copied
      expect(workerMock.operations.length).toBe(1)
      const { inputTransfer, outputTransfer } = workerMock.operations[0]
      const inputBuffers = getJpegArrayBuffers(jpeg)
      expect(inputBuffers.length).toBe(3)
      expect(inputTransfer?.length).toBe(3)
      expect(inputTransfer?.[0]).toBe(inputBuffers[0])
      expect(inputTransfer?.[1]).toBe(inputBuffers[1])
      expect(inputTransfer?.[2]).toBe(inputBuffers[2])
      // Output buffers should not be copied
      expect(outputTransfer?.length).toBe(1)
      expect(outputTransfer?.[0]).toBe(imageData.data.buffer)
      // Revert
      jp3g.setWorkerCount(0)
    })
  })
  describe('scale', () => {
    xit('can scale down by 1 / 8', async () => {
      const imageData = await jp3g(jpegData)
        .scale(1 / 8)
        .toImageData()
      expect(imageData).toEqual(await getExpectedImageData('8x8-scaled-1-8'))
    })
  })
})
