export const add64 = (x: number) => (input: number[]) => {
  const output: number[] = []
  for (let i = 0; i < 64; i += 1) {
    output[i] = input[i] + x
  }
  return output
}

export const center = add64(-128)
