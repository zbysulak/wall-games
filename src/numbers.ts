import { colorToArr } from "./utils"

// Number representation
const numbers = [
  [
    [false, true, true, false],
    [true, false, false, true],
    [true, false, false, true],
    [true, false, false, true],
    [false, true, true, false]
  ],
  [
    [true, true, false],
    [false, true, false],
    [false, true, false],
    [false, true, false],
    [true, true, true]
  ],
  [
    [true, true, true, false],
    [false, false, false, true],
    [false, true, true, false],
    [true, false, false, false],
    [true, true, true, true]
  ],
  [
    [true, true, true, false],
    [false, false, false, true],
    [false, true, true, false],
    [false, false, false, true],
    [true, true, true, false]
  ],
  [
    [true, false, false, false],
    [true, false, true, false],
    [true, true, true, true],
    [false, false, true, false],
    [false, false, true, false]
  ],
  [
    [true, true, true, true],
    [true, false, false, false],
    [true, true, true, false],
    [false, false, false, true],
    [true, true, true, false]
  ],
  [
    [false, true, true, false],
    [true, false, false, false],
    [true, true, true, false],
    [true, false, false, true],
    [false, true, true, false]
  ],
  [
    [true, true, true, true],
    [false, false, false, true],
    [false, false, true, false],
    [false, true, false, false],
    [false, true, false, false]
  ],
  [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, true, false],
    [true, false, false, true],
    [false, true, true, false]
  ],
  [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, true, true],
    [false, false, false, true],
    [false, true, true, false]
  ]
]

// Function to draw the number on canvas
function drawDigit(
  context: CanvasRenderingContext2D,
  number: boolean[][],
  x: number,
  y: number,
  cellSize: number,
  fillColor: string
) {
  for (let row = 0; row < number.length; row++) {
    for (let col = 0; col < number[row].length; col++) {
      if (number[row][col]) {
        context.fillStyle = fillColor
        context.fillRect(
          x + col * cellSize,
          y + row * cellSize,
          cellSize,
          cellSize
        )
      }
    }
  }
}

// Function to draw the number on canvas
function drawDigitArr(
  array: number[][][],
  number: boolean[][],
  x: number,
  y: number,
  cellSize: number,
  fillColor: string
) {
  const color = colorToArr(fillColor)
  for (let row = 0; row < number.length; row++) {
    for (let col = 0; col < number[row].length; col++) {
      if (number[row][col]) {
        for (let x = 0; x < cellSize; x++) {
          for (let y = 0; y < cellSize; y++) {
            array[row + y][col + x] = color
          }
        }
      }
    }
  }
}

// Set cell size and fill color
const cellSize = 1

export function drawNumber(
  ctx: CanvasRenderingContext2D,
  d: number,
  x: number = 0,
  y: number = 0
) {
  if (d > 999) {
    console.error("number is too long")
  }
  const s = d.toString()
  let start = x
  for (let i = 0; i < s.length; i++) {
    let digit = parseInt(s[i])
    drawDigit(ctx, numbers[digit], start, y, cellSize, "#f00")
    start = start + numbers[digit][0].length + 1
  }
}

export function getNumberWidth(d: number): number {
  const s = d.toString()
  let width = -1
  for (let i = 0; i < s.length; i++) {
    let digit = parseInt(s[i])
    width += numbers[digit][0].length + 1
  }
  return width
}

export function drawNumberToArray(
  array: number[][][],
  d: number,
  x: number = 0,
  y: number = 0
) {
  if (d > 999) {
    console.error("number is too long")
  }
  const s = d.toString()
  let start = x
  for (let i = 0; i < s.length; i++) {
    let digit = parseInt(s[i])
    drawDigitArr(array, numbers[digit], start, y, cellSize, "#f00")
    start = start + numbers[digit][0].length + 1
  }
}
