import {drawNumber} from "./numbers.js";
import {sendCanvas} from "./websockets.js";

// Constants
const GRID_SIZE = 20;
const PIXEL_SIZE = 1;
const CANVAS_SIZE = 20;
const INITIAL_SNAKE_LENGTH = 5;
const MOVE_INTERVAL = 150; // milliseconds

// Variables
let snake: Position[] = [];
let food: Position = {x: 0, y: 0};
let direction = 'r';
let gameLoop: number;
let hue = 0;
let score = 0;

// Initialize game
async function init() {
    createSnake();
    createFood();
    gameLoop = setInterval(moveSnake, MOVE_INTERVAL);
    document.addEventListener("keydown", changeDirection);
}

interface Position {
    x: number
    y: number
}

// Create initial snake
function createSnake() {
    const startX = Math.floor(GRID_SIZE / 2);
    const startY = Math.floor(GRID_SIZE / 2);
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
        snake.push({x: startX - i, y: startY});
    }
}

// Create food at random position
function createFood() {
    food.x = Math.floor(Math.random() * GRID_SIZE);
    food.y = Math.floor(Math.random() * GRID_SIZE);
}

// Draw snake and food
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw snake
    snake.forEach((segment, index) => {
        // Calculate hue based on snake length
        const segmentHue = (hue + index * 10) % 360;
        ctx.fillStyle = `hsl(${segmentHue}, 100%, 50%)`;
        ctx.fillRect(segment.x * PIXEL_SIZE, segment.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
    });

    // Draw food
    ctx.fillStyle = "#f00";
    ctx.fillRect(food.x * PIXEL_SIZE, food.y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
}

// Move snake
async function moveSnake() {
    // Move snake head
    let newX = snake[0].x;
    let newY = snake[0].y;
    switch (direction) {
        case 'l':
            newX--;
            break;
        case 'u':
            newY--;
            break;
        case 'r':
            newX++;
            break;
        case 'd':
            newY++;
            break;
    }

    // Check collision with walls or self
    if (newX < 0 || newX >= GRID_SIZE || newY < 0 || newY >= GRID_SIZE || isCollision(newX, newY)) {
        clearInterval(gameLoop);
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        drawNumber(ctx, score, 3, 7)
    } else {
        // Check if snake eats food
        if (newX === food.x && newY === food.y) {
            createFood();
            score++
        } else {
            snake.pop(); // Remove last segment if not eating food
        }

        // Add new head segment
        snake.unshift({x: newX, y: newY});

        hue = (hue + 1) % 360; // Update hue for next draw
        draw();
    }
    await sendCanvas(ctx)
}

// Check if there's a collision with snake body
function isCollision(x: number, y: number) {
    return snake.some(segment => segment.x === x && segment.y === y);
}

// Change snake direction
function changeDirection(event: KeyboardEvent) {
    if ((event.code == 'a' || event.code == 'ArrowLeft') && direction != 'r') {
        direction = 'l'
    } else if ((event.code == 'd' || event.code == 'ArrowRight') && direction != 'l') {
        direction = 'r'
    } else if ((event.code == 'w' || event.code == 'ArrowUp') && direction != 'd') {
        direction = 'u'
    } else if ((event.code == 's' || event.code == 'ArrowDown') && direction != 'u') {
        direction = 'd'
    }
}

let ctx: CanvasRenderingContext2D
export default function initializeGame(canvas: HTMLCanvasElement) {
// Initialize canvas and context
    ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
    init()
}