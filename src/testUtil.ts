import fs from 'fs'

export const range = (length: number) => [...Array(length).keys()]

export const readImageFile = (name: string) =>
  new Uint8Array(fs.readFileSync(`src/__tests__/images/${name}.jpg`))
