export const throwError = (message: string) => {
  throw Error(message)
}

export const throwUnsupported = (something: string) => {
  throwError(`Unsupported ${something}`)
}

export const throwInvalidJPEG = () => {
  throwError('Invalid JPEG')
}
