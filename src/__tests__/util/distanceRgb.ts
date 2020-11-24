const { abs, atan2, cos, exp, hypot, PI, sin, sqrt } = Math

type XYZ = [X: number, Y: number, Z: number]
type Lab = [L: number, a: number, b: number]

/**
 * Scale byte to 0...1.
 */
const unscaleByte = (x: number) => x / 255

/**
 * Invert sRGB gamma function.
 */
const invertGamma = (u: number) =>
  u <= 0.04045 ? u / 12.92 : ((u + 0.055) / 1.055) ** 2.4

const f = (w: number) =>
  w > 216 / 24389 ? w ** (1 / 3) : (841 / 108) * w + 4 / 29

/**
 * White point used in sRGB.
 */
const whiteD65: XYZ = [0.9505, 1, 1.089]

/**
 * Convert sRGB to Lab color.
 */
const rgbToLab = (white: XYZ) => ([R, G, B]: number[]): Lab => {
  R = invertGamma(unscaleByte(R))
  G = invertGamma(unscaleByte(G))
  B = invertGamma(unscaleByte(B))
  const X = 0.4124564 * R + 0.3575761 * G + 0.1804375 * B
  const Y = 0.2126729 * R + 0.7151522 * G + 0.072175 * B
  const Z = 0.0193339 * R + 0.119192 * G + 0.9503041 * B
  const l = f(Y / white[1])
  const L = 116 * l - 16
  const a = 500 * (f(X / white[0]) - l)
  const b = 200 * (l - f(Z / white[2]))
  return [L, a, b]
}

const degrees = (radians: number) => radians * (180 / PI)
const radians = (degrees: number) => degrees * (PI / 180)

/**
 * Returns a mod b
 */
const mod = (b: number) => (a: number) => ((a % b) + b) % b

const mod360 = mod(360)

const h = (b: number, a: number) => mod360(degrees(atan2(b, a)))

const sc7 = (c: number) => sqrt(c ** 7 / (c ** 7 + 25 ** 7))

const cosRad = (x: number) => cos(radians(x))

/**
 * Return CIEDE2000 color difference between two sRGB colors which components
 * are expected in the range 0 to 255.
 */
export const distanceRgb = (rgb1: number[], rgb2: number[]) => {
  let [l1, a1, b1] = rgbToLab(whiteD65)(rgb1)
  let [l2, a2, b2] = rgbToLab(whiteD65)(rgb2)
  let c1 = hypot(a1, b1)
  let c2 = hypot(a2, b2)
  const fc7 = (1 - sc7((c1 + c2) / 2)) / 2
  a1 += a1 * fc7
  a2 += a2 * fc7
  const h1 = h(b1, a1)
  const h2 = h(b2, a2)
  let hd = 0
  let hs = h1 + h2
  if (c1 * c2 !== 0) {
    hd = h2 - h1
    if (hd > 180) {
      hd -= 360
    } else if (hd < -180) {
      hd += 360
    }
    const dh = abs(h1 - h2)
    if (dh <= 180) {
      hs /= 2
    } else if (dh > 180 && hs < 360) {
      hs = (hs + 360) / 2
    } else if (dh > 180 && hs >= 360) {
      hs = (hs - 360) / 2
    }
  }
  c1 = hypot(a1, b1)
  c2 = hypot(a2, b2)
  const ml = (l1 + l2) / 2
  const mc = (c1 + c2) / 2
  const t =
    1 -
    0.17 * cosRad(hs - 30) +
    0.24 * cosRad(2 * hs) +
    0.32 * cosRad(3 * hs + 6) -
    0.2 * cosRad(4 * hs - 63)
  const sl = 1 + (0.015 * (ml - 50) ** 2) / sqrt(20 + (ml - 50) ** 2)
  const sc = 1 + 0.045 * mc
  const sh = 1 + 0.015 * mc * t
  const rt = -2 * sc7(mc) * sin(radians(60 * exp(-(((hs - 275) / 25) ** 2))))
  const dl = (l2 - l1) / sl
  const dc = (c2 - c1) / sc
  const dh = (2 * sqrt(c1 * c2) * sin(radians(hd) / 2)) / sh
  return sqrt(dl ** 2 + dc ** 2 + dh ** 2 + rt * dc * dh)
}
