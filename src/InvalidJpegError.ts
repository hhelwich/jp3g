/**
 * Indicates invalid format when parsing JPEG
 */
export class InvalidJpegError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, InvalidJpegError.prototype)
  }
}
