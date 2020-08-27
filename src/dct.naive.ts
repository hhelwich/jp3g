const { cos, PI, SQRT2 } = Math

// See: https://en.wikipedia.org/wiki/JPEG#Discrete_cosine_transform

const a = (u: number) => (u === 0 ? 1 / SQRT2 : 1)

const G = (g: number[], u: number, v: number) => {
  let sum = 0
  for (let x = 0; x < 8; x += 1) {
    for (let y = 0; y < 8; y += 1) {
      sum +=
        g[x * 8 + y] *
        cos(((2 * x + 1) * u * PI) / 16) *
        cos(((2 * y + 1) * v * PI) / 16)
    }
  }
  return 0.25 * a(u) * a(v) * sum
}
export const dct = (g: number[]) => {
  let result: number[] = []
  for (let u = 0; u < 8; u += 1) {
    for (let v = 0; v < 8; v += 1) {
      result[u * 8 + v] = G(g, u, v)
    }
  }
  return result
}
