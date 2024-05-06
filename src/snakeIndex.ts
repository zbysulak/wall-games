import snake from "./snake.js"

const canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
let s = new snake(canvas, {snakeWidth: 2})