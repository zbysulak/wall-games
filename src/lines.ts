import { emptyArray, height, width } from "./utils"
import Color from "color"

function random(b1: number, b2: number | undefined = undefined) {
  if (b2 === undefined) return Math.floor(randomFloat(0, b1))
  return Math.floor(randomFloat(b1, b2))
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min
}

class Particle {
  private maxVel = 2
  private darken = 0.3
  private x: number
  private y: number
  private readonly vx: number
  private readonly vy: number
  private c: Color

  constructor() {
    this.c = Color.hsl(random(360), 100, 50)

    // Randomly choose a border
    const border = Math.floor(Math.random() * 4)

    // Position on border and velocity pointing inward
    if (border === 0) {
      // Top
      this.x = randomFloat(0, width)
      this.y = 0
      this.vx = randomFloat(-this.maxVel, this.maxVel) // Random horizontal velocity
      this.vy = randomFloat(0.5, this.maxVel) // Velocity pointing downward
    } else if (border === 1) {
      // Bottom
      this.x = randomFloat(0, width)
      this.y = height - 1
      this.vx = randomFloat(-this.maxVel, this.maxVel) // Random horizontal velocity
      this.vy = randomFloat(-this.maxVel, -0.5) // Velocity pointing upward
    } else if (border === 2) {
      // Left
      this.x = 0
      this.y = randomFloat(0, height)
      this.vx = randomFloat(0.5, this.maxVel) // Velocity pointing right
      this.vy = randomFloat(-this.maxVel, this.maxVel) // Random vertical velocity
    } else {
      // Right
      this.x = width - 1
      this.y = randomFloat(0, height)
      this.vx = randomFloat(-this.maxVel, -0.5) // Velocity pointing left
      this.vy = randomFloat(-this.maxVel, this.maxVel) // Random vertical velocity
    }
  }

  finished() {
    return !this.checkBounds(this.x, this.y)
  }

  checkBounds(x: number, y: number) {
    return x >= 0 && x < width && y >= 0 && y < height
  }

  update() {
    this.x += this.vx
    this.y += this.vy
  }

  show(arr: number[][][]) {
    let i = 0
    let line = bresenhamLine(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.x - 5 * this.vx),
      Math.floor(this.y - 5 * this.vy),
      5
    )
    for (let [x, y] of line) {
      if (this.checkBounds(x, y)) {
        const newc = this.c
          .darken(this.darken * i)
          .rgb()
          .array()
          .map((e: number) => Math.floor(e))
        arr[y][x] = newc
        i++
      } else {
        break
      }
    }
  }
}

function bresenhamLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  length: number
): [number, number][] {
  const points: [number, number][] = []

  let dx = Math.abs(x2 - x1)
  let dy = Math.abs(y2 - y1)
  const sx = x1 < x2 ? 1 : -1
  const sy = y1 < y2 ? 1 : -1

  let err = dx - dy

  // Start generating points
  while (points.length < length) {
    points.push([x1, y1]) // Add the current point

    const e2 = 2 * err
    if (e2 > -dy) {
      err -= dy
      x1 += sx // Move in the x direction
    }
    if (e2 < dx) {
      err += dx
      y1 += sy // Move in the y direction
    }
  }

  return points
}

let particles: Particle[] = [new Particle()]

export function getNextArray(): number[][][] {
  const arr = emptyArray()
  for (let i = 0; i < 3; i++) {
    let p = new Particle()
    particles.push(p)
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].show(arr)
    particles[i].update()
    if (particles[i].finished()) {
      particles.splice(i, 1)
    }
  }
  return arr
}
