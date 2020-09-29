import fs from 'fs'

export const readImageFile = (name: string) =>
  new Uint8Array(fs.readFileSync(`src/__tests__/images/${name}.jpg`))
