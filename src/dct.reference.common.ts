const { SQRT2 } = Math

export const C = (u: number) => (u === 0 ? 1 / SQRT2 : 1)

const add64 = (x: number) => (input: number[]) => {
  const output: number[] = []
  for (let i = 0; i < 64; i += 1) {
    output[i] = input[i] + x
  }
  return output
}
