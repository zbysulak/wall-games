import {initialize, sendCanvas} from "./websockets.js";

let canvas = <HTMLCanvasElement>document.getElementById("canvas")
let ctx = <CanvasRenderingContext2D>canvas.getContext("2d")
const w = canvas.width
const h = canvas.height

let particles: Particle[] = [];

setInterval(() => draw(), 1000 / 10)

initialize()

function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < 5; i++) {
        let p = new Particle();
        particles.push(p);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].show();
        particles[i].update();
        if (particles[i].finished()) {
            particles.splice(i, 1);
        }
    }
    sendCanvas(ctx)
}

function random(min: number, max: number) {
    return Math.floor(randomFloat(min, max))
}

function randomFloat(min: number, max: number) {
    return Math.random() * (max - min) + min
}

class Particle {
    private x: number;
    private y: number;
    private readonly vx: number;
    private readonly vy: number;
    //private alpha: number;
    private d: number;

    constructor() {
        this.x = random(0, w);
        this.y = h;
        this.vx = randomFloat(-1, 1);
        this.vy = randomFloat(-3, -1);
        //this.alpha = 255;
        this.d = w / 10;
    }

    finished() {
        return /*this.alpha < 0 ||*/ this.d < 0.1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        //this.alpha -= 50;
        this.d -= randomFloat(0.1, 0.2);
    }

    show() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.d, 0, Math.PI * 2)
        ctx.fillStyle = `rgb(${random(200, 255)}, ${random(0, 150)}, ${random(0, 10)})`
        ctx.fill()
    }
}