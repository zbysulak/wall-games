import { configDotenv } from "../node_modules/dotenv/lib/main.js"
import { getNextArray } from "../src/fire.js"
import { emptyArray } from "../src/utils.js"
import { getCurtainWebSocket } from "./../src/websocketsNode.js"
configDotenv()

const args = process.argv.slice(2)
let ip = process.env.WS_IP!

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
getCurtainWebSocket(ip).then((ws) => {
  const interval = 1000 / 5
  const intervalId = setInterval(() => {
    let a = getNextArray()
    ws.sendArray(a)
  }, interval)
  process.on("SIGINT", () => {
    console.log("\nReceived Ctrl+C. Exiting...")
    clearInterval(intervalId)
    ws.sendArray(emptyArray())
    process.exit(0) // The process will exit only after all intervals are done
  })
})
