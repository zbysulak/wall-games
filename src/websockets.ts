import { getBinaryData, getBinaryDataArr } from "./websocketUtils.js"

export async function getCurtainWebSocket(ip: string): Promise<{
  sendArray(array: number[][][]): void
  sendCanvas(ctx: CanvasRenderingContext2D): void
}> {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(ip)
    ws.onopen = () => {
      console.log("WebSocket connection established")
      resolve({
        sendArray(array: number[][][]) {
          ws.send(getBinaryDataArr(array))
        },
        sendCanvas(ctx: CanvasRenderingContext2D) {
          ws.send(getBinaryData(ctx))
        }
      })
    }
    ws.onerror = (e) => {
      console.error(e)
      reject(e)
    }
  })
}
