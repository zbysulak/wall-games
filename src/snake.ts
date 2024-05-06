import {drawNumber} from "./numbers.js";
import {sendCanvas} from "./websockets.js";

interface Position {
    x: number
    y: number
}

export default class Snake {
    private ctx: CanvasRenderingContext2D
    private pixelSize: number;

    // Constants
    private readonly gridSize: number;
    private readonly CANVAS_SIZE = 20;
    private readonly INITIAL_SNAKE_LENGTH = 5;
    private readonly MOVE_INTERVAL = 150; // milliseconds

    // Variables
    private snake: Position[] = [];
    private food: Position = {x: 0, y: 0};
    private direction = 'r';
    // @ts-ignore it is set in start function, called by constructor
    private gameLoop: number;
    private hue = 0;
    private score = 0;

    constructor(canvas: HTMLCanvasElement, {snakeWidth = 1} = {}) {
        this.ctx = <CanvasRenderingContext2D>canvas.getContext("2d");
        this.pixelSize = snakeWidth
        if (this.pixelSize != 1 && this.pixelSize != 2)
            throw new Error("invalid pixel size")
        this.gridSize = this.CANVAS_SIZE / this.pixelSize;
        document.addEventListener("keydown", (e) => this.changeDirection(e));
        this.start()
    }

    restart(){
        this.direction = 'r'
        this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
        clearInterval(this.gameLoop)
        this.start()
    }

    private start(){
        this.score = 0
        this.createSnake()
        this.createFood()
        this.gameLoop = setInterval(() => this.moveSnake(), this.MOVE_INTERVAL);
    }

    private createSnake() {
        const startX = Math.floor(this.gridSize / 2);
        const startY = Math.floor(this.gridSize / 2);
        this.snake = []
        for (let i = 0; i < this.INITIAL_SNAKE_LENGTH; i++) {
            this.snake.push({x: startX - i, y: startY});
        }
    }

    private createFood() {
        this.food.x = Math.floor(Math.random() * this.gridSize);
        this.food.y = Math.floor(Math.random() * this.gridSize);
    }

    private draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);

        // Draw snake
        this.snake.forEach((segment, index) => {
            // Calculate hue based on snake length
            const segmentHue = (this.hue + index * 10) % 360;
            this.ctx.fillStyle = `hsl(${segmentHue}, 100%, 50%)`;
            this.ctx.fillRect(segment.x * this.pixelSize, segment.y * this.pixelSize, this.pixelSize, this.pixelSize);
        });

        // Draw food
        this.ctx.fillStyle = `hsl(${(this.hue + 180) % 360}, 100%, 50%)`;
        this.ctx.fillRect(this.food.x * this.pixelSize, this.food.y * this.pixelSize, this.pixelSize, this.pixelSize);
    }

    private async moveSnake() {
        // Move snake head
        let newX = this.snake[0].x;
        let newY = this.snake[0].y;
        switch (this.direction) {
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
        if (newX < 0 || newX >= this.gridSize || newY < 0 || newY >= this.gridSize || this.isCollision(newX, newY)) {
            clearInterval(this.gameLoop);
            this.ctx.clearRect(0, 0, this.CANVAS_SIZE, this.CANVAS_SIZE);
            drawNumber(this.ctx, this.score, 3, 7)
        } else {
            // Check if snake eats food
            if (newX === this.food.x && newY === this.food.y) {
                this.createFood();
                this.score++
            } else {
                this.snake.pop(); // Remove last segment if not eating food
            }

            // Add new head segment
            this.snake.unshift({x: newX, y: newY});

            this.hue = (this.hue + 10) % 360; // Update hue for next draw
            this.draw();
        }
        await sendCanvas(this.ctx)
    }

    // Check if there's a collision with snake body
    private isCollision(x: number, y: number) {
        return this.snake.some(segment => segment.x === x && segment.y === y);
    }

    // Change snake direction
    private changeDirection(event: KeyboardEvent) {
        if ((event.code == 'a' || event.code == 'ArrowLeft') && this.direction != 'r') {
            this.direction = 'l'
        } else if ((event.code == 'd' || event.code == 'ArrowRight') && this.direction != 'l') {
            this.direction = 'r'
        } else if ((event.code == 'w' || event.code == 'ArrowUp') && this.direction != 'd') {
            this.direction = 'u'
        } else if ((event.code == 's' || event.code == 'ArrowDown') && this.direction != 'u') {
            this.direction = 'd'
        }
    }
}