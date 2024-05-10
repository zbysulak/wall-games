// Create a WebSocket connection
let ws: WebSocket

export async function initialize(timeout: number = 5000) {
    return new Promise((resolve, reject) => {
        ws = new WebSocket('ws://10.0.0.43/ws');

        // Event handler for when the WebSocket connection is established
        ws.onopen = () => {
            console.log('WebSocket connection established');
            clearTimeout(timer);
            resolve(ws)
        };

        // Event handler for incoming messages
        ws.onmessage = (event) => {
            console.log('Received message:', event.data);
        };

        // Event handler for WebSocket errors
        ws.onerror = (error) => {
            reject('WebSocket error: ' + error)
        };

        // Event handler for WebSocket close
        ws.onclose = () => {
            console.log('WebSocket connection closed');
            clearTimeout(timer);
        };

        const timer = setTimeout(() => {
            reject(new Error('WebSocket connection timed out'));
            //ws.close(); // Close the WebSocket connection
        }, timeout);
    });
}

export async function sendCanvas(context: CanvasRenderingContext2D) {
    if (ws == undefined || ws.readyState != ws.OPEN) {
        throw new Error("WebSocket is not initialized")
    }

    if (context.canvas.width != 20 || context.canvas.height != 20) {
        throw new Error("cant send canvas this big")
    }

    const bd = getBinaryData(context)
    console.log("bin",bd)
    ws.send(bd);
}

function getBinaryData(ctx: CanvasRenderingContext2D): Uint8Array {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const {data} = imageData;
    const binaryImageData: number[] = [];

    // Iterate over columns, right to left
    for (let x = ctx.canvas.width - 1; x >= 0; x--) {
        for (let y = 0; y < ctx.canvas.height; y++) {
            const i = (y * ctx.canvas.width + x) * 4; // Index of the current pixel
            binaryImageData.push(data[i]);     // Red
            binaryImageData.push(data[i + 1]); // Green
            binaryImageData.push(data[i + 2]); // Blue
        }
    }
console.log(binaryImageData)
    // Convert to Uint8Array
    return new Uint8Array(binaryImageData);
}