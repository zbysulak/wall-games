export function getBinaryData(ctx: CanvasRenderingContext2D): Uint8Array {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
  const { data } = imageData
  const binaryImageData: number[] = []

  if (ctx.canvas.width != 20 || ctx.canvas.height != 20) {
    throw new Error("cant send canvas this big")
  }
  // Iterate over columns, right to left
  for (let x = ctx.canvas.width - 1; x >= 0; x--) {
    for (let y = 0; y < ctx.canvas.height; y++) {
      const i = (y * ctx.canvas.width + x) * 4 // Index of the current pixel
      binaryImageData.push(data[i]) // Red
      binaryImageData.push(data[i + 1]) // Green
      binaryImageData.push(data[i + 2]) // Blue
    }
  }
  // Convert to Uint8Array
  return new Uint8Array(binaryImageData)
}

export function getBinaryDataArr(array: number[][][]): Uint8Array {
  if (array.length != 20 || array[0].length != 20) {
    throw new Error("cant send canvas this big")
  }

  const binaryImageData: number[] = []

  for (let x = 19; x >= 0; x--) {
    for (let y = 0; y < 20; y++) {
      binaryImageData.push(array[y][x][0]) // Red
      binaryImageData.push(array[y][x][1]) // Green
      binaryImageData.push(array[y][x][2]) // Blue
    }
  }

  return new Uint8Array(binaryImageData)
}
