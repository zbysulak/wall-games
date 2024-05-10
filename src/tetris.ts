import {drawNumber} from "./numbers.js";

const canvas = <HTMLCanvasElement>document.getElementById("tetrisCanvas");
const ctx = <CanvasRenderingContext2D>canvas.getContext("2d");

const ROWS = 20;
const COLS = 10;
const BLOCK_SIZE = 1;
const SPEED = 500;
const COLORS = ["hsl(0,100%,50%)", "hsl(60,100%,50%)", "hsl(120,100%,50%)", "hsl(180,100%,50%)", "hsl(240,100%,50%)", "hsl(300,100%,50%)"];
const TETROMINOS = [
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ], // I
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]], // T
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]], // L
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]], // J
    [[1, 1], [1, 1]], // O
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]], // Z
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]]  // S
];

class Tetromino {
    colorIdx: number;
    shape: number[][];

    constructor(shape: number[][], colorIdx: number) {
        this.colorIdx = colorIdx;
        this.shape = shape;
    }
}

const grid: number[][] = [];
let currentTetromino = getRandomTetromino();
let nextTetromino = getRandomTetromino();
let currentRow = currentTetromino.shape[0].every(e => e == 0) ? -1 : 0;
let currentCol = Math.floor(COLS / 2) - Math.floor(currentTetromino.shape[0].length / 2);
let lastTime = 0;
let score = 0;
for (let row = 0; row < ROWS; row++) {
    grid[row] = [];
    for (let col = 0; col < COLS; col++) {
        grid[row][col] = 0;
    }
}

function getRandomTetromino() {
    const index = Math.floor(Math.random() * TETROMINOS.length)
    const color = Math.floor(Math.random() * COLORS.length)
    return new Tetromino(TETROMINOS[index], color);
}

function drawGrid() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "orange"
    ctx.fillRect(10, 0, 1, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const x = col * BLOCK_SIZE;
            const y = row * BLOCK_SIZE;

            if (grid[row][col] !== 0) {
                ctx.fillStyle = COLORS[grid[row][col]-1];
                ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }

    drawTetromino();
    drawNumber(ctx, score, 12, 14)
    drawNextTetromino();
}

function drawNextTetromino() {
    for (let row = 0; row < nextTetromino.shape.length; row++) {
        for (let col = 0; col < nextTetromino.shape[row].length; col++) {
            const x = col * BLOCK_SIZE;
            const y = row * BLOCK_SIZE;

            ctx.fillStyle = COLORS[nextTetromino.colorIdx];
            if (nextTetromino.shape[row][col] !== 0) {
                ctx.fillRect(12 + 2 * col, 1 + 2 * row, 2, 2);
            }
        }
    }
}

function drawTetromino() {
    ctx.fillStyle = COLORS[currentTetromino.colorIdx];
    for (let row = 0; row < currentTetromino.shape.length; row++) {
        for (let col = 0; col < currentTetromino.shape[row].length; col++) {
            if (currentTetromino.shape[row][col]) {
                const x = (currentCol + col) * BLOCK_SIZE;
                const y = (currentRow + row) * BLOCK_SIZE;
                ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
            }
        }
    }
}

function moveTetromino(dx: number, dy: number) {
    if (!checkCollision(currentTetromino.shape, currentRow + dy, currentCol + dx)) {
        currentRow += dy;
        currentCol += dx;
    }
}

function rotateTetromino() {
    const rotatedTetromino = [];
    for (let col = 0; col < currentTetromino.shape[0].length; col++) {
        const newRow = [];
        for (let row = currentTetromino.shape.length - 1; row >= 0; row--) {
            newRow.push(currentTetromino.shape[row][col]);
        }
        rotatedTetromino.push(newRow);
    }

    if (!checkCollision(rotatedTetromino, currentRow, currentCol)) {
        currentTetromino.shape = rotatedTetromino;
    }
}

function checkCollision(tetromino: number[][], row: number, col: number) {
    for (let r = 0; r < tetromino.length; r++) {
        for (let c = 0; c < tetromino[r].length; c++) {
            if (tetromino[r][c] && (grid[row + r] && grid[row + r][col + c]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function updateGrid() {
    for (let row = 0; row < currentTetromino.shape.length; row++) {
        for (let col = 0; col < currentTetromino.shape[row].length; col++) {
            if (currentTetromino.shape[row][col]) {
                grid[currentRow + row][currentCol + col] = currentTetromino.colorIdx + 1;
            }
        }
    }
    clearLines();
    currentTetromino = nextTetromino
    nextTetromino = getRandomTetromino();
    currentRow = currentTetromino.shape[0].every(e => e == 0) ? -1 : 0;
    currentCol = Math.floor(COLS / 2) - Math.floor(currentTetromino.shape[0].length / 2);
}

function clearLines() {
    let lines = 0;
    for (let row = ROWS - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== 0)) {
            grid.splice(row, 1);
            grid.unshift(Array(COLS).fill(0));
            lines++;
        }
    }
    switch (lines) {
        case 1:
            score++
            return
        case 2:
            score += 3
            return
        case 3:
            score += 5
            return
        case 4:
            score += 8
    }
}

document.addEventListener("keydown", function (event) {
    switch (event.key) {
        case "ArrowLeft":
            moveTetromino(-1, 0);
            break;
        case "ArrowRight":
            moveTetromino(1, 0);
            break;
        case "ArrowDown":
            moveTetromino(0, 1);
            break;
        case "ArrowUp":
            rotateTetromino();
            break;
    }
});

function draw() {
    drawGrid();
    requestAnimationFrame(update);
}

function update(time = 0) {
    const deltaTime = time - lastTime;
    if (deltaTime > SPEED) {
        lastTime = time;
        moveTetromino(0, 1);
        if (checkCollision(currentTetromino.shape, currentRow + 1, currentCol)) {
            updateGrid();
        }
    }
    draw();
}

draw();