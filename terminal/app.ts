import { configDotenv } from "dotenv"
import { getNextArray as nextFireArray } from "../src/fire.js"
import { getNextArray as nextLinesArray } from "../src/lines.js"
import { getNextArray as nextPerlinArray } from "../src/perlin.js"
import { emptyArray } from "../src/utils.js"
import { getCurtainWebSocket } from "./../src/websocketsNode.js"
import { findIpByMacAddress } from "./wlanService.js"
configDotenv()

async function getEspAddress(): Promise<string> {
  let ip = process.env.WS_IP
  if (!ip) {
    ip = await findIpByMacAddress(process.env.ESP_MAC!)
  }
  return `ws://${ip}${process.env.WS_PATH}`
}

const args = process.argv.slice(2)

const mode: string = args.length == 0 ? "fire" : args[0]
/*
const readline = require("readline")

// Create an interface to read input from stdin
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false // Disable prompt, to read raw keypresses
})

// Listen for keypresses
rl.on("line", (input: string) => {
  console.log(`You typed: ${input}`)
})

// Capture individual keypress events
process.stdin.setRawMode(true) // Enable raw mode for direct keypress detection
process.stdin.resume() // Start reading from stdin

process.stdin.on("data", (key) => {
  if (key.toString() === "\u0003") {
    // Check for Ctrl+C (exit)
    console.log("Ctrl+C detected. Exiting...")
    process.exit()
  } // Check for arrow key sequences
  if (key.length === 3) {
    if (key[0] === 27) {
      // 27 is the escape character '\u001b'
      const direction = String.fromCharCode(key[2]) // Convert the byte to a character
      switch (direction) {
        case "A":
          console.log("Up Arrow")
          break
        case "B":
          console.log("Down Arrow")
          break
        case "C":
          console.log("Right Arrow")
          break
        case "D":
          console.log("Left Arrow")
          break
      }
    }
  } else {
    console.log(`Key pressed: ${key}`)
  }
})
*/

getEspAddress().then((ip) => {
  getCurtainWebSocket(ip).then((ws) => {
    let nextFnc: () => number[][][]
    switch (mode) {
      case "fire":
        nextFnc = nextFireArray
        break
      case "lines":
        nextFnc = nextLinesArray
        break
      case "perlin":
        nextFnc = nextPerlinArray
        break
    }

    const interval = 1000 / 5
    const intervalId = setInterval(() => {
      let a = nextFnc()
      ws.sendArray(setBrighttness(a, 10))
    }, interval)
    process.on("SIGINT", () => {
      console.log("\nReceived Ctrl+C. Exiting...")
      clearInterval(intervalId)
      ws.sendArray(emptyArray())
      process.exit(0) // The process will exit only after all intervals are done
    })
  })
})

function setBrighttness(array: number[][][], brightness: number): number[][][] {
  const multiplier = brightness / 100
  return array.map((row) =>
    row.map((cell) => cell.map((v) => Math.floor(v * multiplier)))
  )
}
