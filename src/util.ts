export const identity = <T>(a: T) => a

export const range = (length: number) => {
  const result: number[] = []
  for (let i = 0; i < length; i += 1) {
    result.push(i)
  }
  return result
}

export const zeros = (size: number): number[] => Array(size).fill(0)
