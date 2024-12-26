import Color from "color"

export function emptyArray(): number[][][] {
  return Array.from({ length: 20 }, () =>
    Array.from({ length: 20 }, () => Array(3).fill(0))
  )
}

export const width = 20
export const height = 20

export function colorToArr(color: string): number[] {
  const rgb = Color(color).rgb().array() // Parse the color and get an RGB array
  return rgb
}
