import snake from "./snake.js"

const canvas = <HTMLCanvasElement>document.getElementById("gameCanvas");
let s = new snake(canvas, {snakeWidth: 2, walls: false})
document.addEventListener("keyup", ev => {
    if (ev.code == "Space")
        s.restart()
})