import { colorToArr, emptyArray, height, width } from "./utils.js"

let particles: Particle[] = []

function random(min: number, max: number) {
  return Math.floor(randomFloat(min, max))
}

function randomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function randomRedishColor() {
  return colorToArr(
    `rgb(${random(200, 255)}, ${random(0, 150)}, ${random(0, 10)})`
  )
}

class Particle {
  private x: number
  private y: number
  private readonly vx: number
  private readonly vy: number
  private d: number

  constructor() {
    this.x = random(0, width)
    this.y = height
    this.vx = randomFloat(-1, 1)
    this.vy = randomFloat(-3, -1)
    this.d = width / 10
  }

  finished() {
    return this.d < 0.1
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.d -= randomFloat(0.1, 0.2)
  }

  show(arr: number[][][]) {
    const color = randomRedishColor()
    for (let x = -this.d; x < this.d; x++) {
      for (let y = -this.d; y < this.d; y++) {
        if (
          this.x + x < 0 ||
          this.x + x >= width ||
          this.y + y < 0 ||
          this.y + y >= height
        )
          continue
        if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) > this.d) continue
        arr[Math.floor(this.y + y)][Math.floor(this.x + x)] = color
      }
    }
  }

  showCtx(ctx: CanvasRenderingContext2D) {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.d, 0, Math.PI * 2)
    ctx.fillStyle = `rgb(${random(200, 255)}, ${random(0, 150)}, ${random(
      0,
      10
    )})`
    ctx.fill()
  }
}

export function getNextArray(): number[][][] {
  const arr = emptyArray()
  next((p) => {
    p.show(arr)
  })
  return arr
}

export function getNextContext(ctx: CanvasRenderingContext2D) {
  next((p) => {
    p.showCtx(ctx)
  })
}

function next(visitor: (p: Particle) => void) {
  for (let i = 0; i < 5; i++) {
    let p = new Particle()
    particles.push(p)
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    visitor(particles[i])
    particles[i].update()
    if (particles[i].finished()) {
      particles.splice(i, 1)
    }
  }
}
