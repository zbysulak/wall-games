import { getNextContext } from "./fire.js"
import { height, width } from "./utils.js" // it won't work because browser doesn't support nodeJs modules (color in this example)
import { getCurtainWebSocket } from "./websockets.js"

let canvas = <HTMLCanvasElement>document.getElementById("canvas")
let ctx = <CanvasRenderingContext2D>canvas.getContext("2d")

getCurtainWebSocket("ws://10.0.0.35/ws").then((ws) => {
  setInterval(() => draw(), 1000 / 10)

  function draw() {
    ctx.clearRect(0, 0, width, height)
    getNextContext(ctx)
    ws.sendCanvas(ctx)
  }
})
