import fs from 'fs'

export const range = (length: number) => {
  const result: number[] = []
  for (let i = 0; i < length; i += 1) {
    result.push(i)
  }
  return result
}

export const readImageFile = (name: string) =>
  new Uint8Array(fs.readFileSync(`src/__tests__/images/${name}.jpg`))
