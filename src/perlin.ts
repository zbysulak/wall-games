import { emptyArray, height, width } from "./utils"
import Color from "color"
import { Noise } from "noisejs"

const noise = new Noise()
let xOffset = 0
let yOffset = 0
let counter = 0
let multiplier = 1

function perlin360(x: number, y: number) {
  const p = noise.perlin2(x / 10, y / 10)
  return (Math.floor(p * 180) + 180 + counter * 3) % 360
}

function perlin(x: number) {
  return noise.perlin2(0.15647, x / 122467)
}

export function getNextArray(): number[][][] {
  const arr = emptyArray()
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      arr[y][x] = Color.hsv(
        perlin360(x * multiplier + xOffset, y * multiplier + yOffset),
        100,
        100
      )
        .rgb()
        .array()
    }
  }
  xOffset += perlin(counter) * 5
  yOffset += perlin(counter + 324454) * 5
  counter++
  return arr
}
