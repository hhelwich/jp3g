export const decenter = (input: number[]) => {
  const output: number[] = []
  for (let i = 0; i < 64; i += 1) {
    output[i] = input[i] + 128
  }
  return output
}
