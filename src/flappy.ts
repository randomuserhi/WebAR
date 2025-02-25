import { Group, Vector3 } from "three";
import { PlaneTrack } from "./ar.js";
import { QuadCanvas } from "./quad.js";

export const markers = [
    "data/pattern-12.patt",
    "data/pattern-13.patt",
    "data/pattern-14.patt",
    "data/pattern-19.patt"
];

let t = 0;

const w = 1000;
const h = 1000;

/* START FLAPPY CODE */
import { mutate, NeuralNetwork } from "./nn.js";

class Agent {
    nn: NeuralNetwork;
    fitness: number = 0;

    constructor(layers: number[]) {
        this.nn = new NeuralNetwork(layers);
        this.nn.randAll(() => Math.random() * 2 - 1);
    }
}

export class Bird {
    static width: number = 75;
    static height: number = 75;
    static jump: number = 550;

    static x: number = 400;
    y: number;
    vely: number;

    cooldown: number;
    
    dead: boolean;
}

export class Pipe {
    static width: number = 150;
    static gap: number = 250;

    x: number = 0;
    y: number = 0;

    constructor() {
        
    }
}

export class FlappyEnvironment {
    static offset: number = 100;
    static speed: number = 175;
    static spacing: number = 500;
    static pipeTimer: number = 3;
    static tickSpeed: number = 0.0167;
    static gravity: number = 1250;

    population: Agent[];

    birds: Bird[];
    pipes: Pipe[];

    timer: number;

    pipeTimer: number;

    readonly width: number;
    readonly height: number;

    constructor(width: number, height: number, population: number, layers: number[]) {
        this.width = width;
        this.height = height;
        
        this.population = new Array(population);
        this.birds = new Array(population);
        for (let i = 0; i < population; ++i) {
            this.population[i] = new Agent(layers);
            this.birds[i] = new Bird();
        }
    
        this.pipes = [];

        this.reset();
    }

    public reset() {
        for (let i = 0; i < this.birds.length; ++i) {
            this.birds[i].y = this.height / 2;
            this.birds[i].vely = 0; 
            this.birds[i].dead = false;
            this.birds[i].cooldown = 0;

            this.population[i].fitness = 0;
        }

        this.pipes = [];

        this.timer = 0;
        this.pipeTimer = 0;
    }

    public tick(dt: number) {
        this.timer += dt;
        while (this.timer > FlappyEnvironment.tickSpeed) {
            this.timer -= FlappyEnvironment.tickSpeed;
            this.manualTick();
        }
    }

    public manualTick() {
        const dt = FlappyEnvironment.tickSpeed;
        
        this.pipeTimer -= dt;
        
        if (this.pipeTimer <= 0) {
            this.pipeTimer = FlappyEnvironment.pipeTimer;
            
            const pipe = new Pipe();
            pipe.x = this.width + Pipe.width / 2;
            const offset = FlappyEnvironment.offset + Pipe.gap / 2;
            pipe.y = Math.random() * (this.height - 2 * offset) + offset;
            this.pipes.push(pipe);
        }
        
        let currentPipe: Pipe | undefined = undefined;
        let dist = Infinity;

        const pipes = [];
        for (let i = 0; i < this.pipes.length; ++i) {
            this.pipes[i].x -= FlappyEnvironment.speed * dt;
            
            const d = this.pipes[i].x + Pipe.width / 2 - (Bird.x - Bird.width / 2);
            if (d > 0 && d < dist) {
                currentPipe = this.pipes[i];
                dist = d;
            }

            if (this.pipes[i].x > -Pipe.width / 2) {
                pipes.push(this.pipes[i]);
            }
        }
        this.pipes = pipes;

        let alive = false;
        for (let i = 0; i < this.birds.length; ++i) {
            if (this.birds[i].dead) continue;
            
            alive = true;

            const d = ((currentPipe ? currentPipe.y : this.height / 2) - this.birds[i].y) / this.height;
            this.population[i].fitness += (1 + Math.abs(d)) * dt;

            this.birds[i].cooldown -= dt;

            const input = this.population[i].nn.inputs;
            input[0] = d;

            const output = this.population[i].nn.feedforward();

            if (output[0] > 0 && this.birds[i].cooldown <= 0) {
                this.birds[i].vely = Bird.jump;
                this.birds[i].cooldown = 0.05;
            }

            this.birds[i].vely -= FlappyEnvironment.gravity * dt;
            this.birds[i].y -= this.birds[i].vely * dt; 

            if (this.birds[i].y < Bird.height / 2 || this.birds[i].y + Bird.height / 2 > this.height) {
                this.birds[i].dead = true;
            }

            if (currentPipe !== undefined) {
                if ((Bird.x + Bird.width / 2 > currentPipe.x - Pipe.width / 2 && Bird.x + Bird.width / 2 < currentPipe.x + Pipe.width / 2) ||
                    (Bird.x - Bird.width / 2 > currentPipe.x - Pipe.width / 2 && Bird.x - Bird.width / 2 < currentPipe.x + Pipe.width / 2)) {
                    if ((this.birds[i].y + Bird.height / 2 > currentPipe.y + Pipe.gap / 2) ||
                        (this.birds[i].y - Bird.height / 2 < currentPipe.y - Pipe.gap / 2)) {
                        this.birds[i].dead = true;
                    }
                }
            }
        }

        if (alive === false) {
            if (this.population.length > 1) {
                this.population.sort((a, b) => b.fitness - a.fitness);
                
                for (let i = this.population.length / 2; i < this.population.length; ++i) {
                    const j = Math.round(Math.random() * this.population.length / 2);
                    mutate(this.population[j].nn, this.population[i].nn, (a) => {
                        const r = Math.random();
                        if (r < 0.01) {
                            return Math.random() * 2 - 1;
                        } else {
                            return a + (Math.random() * 2 - 1) * 0.01;
                        }
                    });
                }
            }

            this.reset();
        }
    }
}
/* END FLAPPY CODE */

const env = new FlappyEnvironment(w, h, 1, [1, 2, 3, 2, 1]);
    
const nn = env.population[0].nn;

nn.weights[0] = [-0.6078, 0.1518];
nn.weights[1] = [0.5503, -0.8983, -0.5413, -0.8216, -0.9900, 0.5926];
nn.weights[2] = [0.7684, -0.3767, -0.3287, -0.3118, 0.1947, -0.5268];
nn.weights[3] = [0.3661, 0.1295];

nn.bias[0] = [0.9693, 0.3689];
nn.bias[1] = [0.7039, -0.6909, -0.1367];
nn.bias[2] = [-0.6538, 0.7277];
nn.bias[3] = [-0.082];

const magnitudes: number[][] = [];
for (let i = 0; i < nn.nodes.length; ++i) {
    const mag: number[] = [];
    for (let j = 0; j < nn.nodes[i].length; ++j) {
        mag.push(0);
    }
    magnitudes.push(mag);
}

const quad = new QuadCanvas(w, h, (ctx, dt) => {
    //ctx.fillStyle = "rgb(255, 255, 255)";
    //ctx.fillRect(0, 0, w, h);
    ctx.clearRect(0, 0, w, h);

    env.tick(dt);

    for (let i = 0; i < env.birds.length; ++i) {
        const bird = env.birds[i];
        if (bird.dead) continue;

        ctx.save();
        ctx.translate(Bird.x, bird.y);

        ctx.beginPath();
        ctx.arc(0, 0, Bird.height/2, 0, 2 * Math.PI);
        ctx.fillStyle = "#000000";
        ctx.fill();

        ctx.restore();
    }

    for (const pipe of env.pipes) {
        ctx.save();
        ctx.translate(pipe.x, pipe.y);

        ctx.fillStyle = "#000000";
        ctx.fillRect(-Pipe.width / 2, -pipe.y, Pipe.width, pipe.y - Pipe.gap / 2);
        ctx.fillRect(-Pipe.width / 2, Pipe.gap / 2, Pipe.width, env.height - pipe.y + Pipe.gap / 2);

        ctx.restore();
    }

    ctx.save();
    ctx.translate(100, h - 100);

    for (let i = 0; i < nn.weights.length; ++i) {
        for (let j = 0; j < nn.nodes[i].length; ++j) {
            for (let k = 0; k < nn.nodes[i+1].length; ++k) {
                const val = nn.weights[i][j * nn.nodes[i+1].length + k];

                ctx.beginPath();
                ctx.moveTo(i * 100, j * -50);
                ctx.lineTo((i+1) * 100, k * -50);
                ctx.lineWidth = 4;
                ctx.strokeStyle = `rgba(${(val < 0) ? 255 * Math.min(1, Math.max(0, Math.abs(val))) : 0}, ${(val > 0) ? 255 * Math.min(1, Math.max(0, Math.abs(val))) : 0}, 0, 1)`;
                ctx.stroke();       
            }    
        }
    }

    for (let i = 0; i < nn.nodes.length; ++i) {
        for (let j = 0; j < nn.nodes[i].length; ++j) {
            if (Math.abs(nn.nodes[i][j]) > magnitudes[i][j]) {
                magnitudes[i][j] = Math.abs(nn.nodes[i][j]);
            }   

            const val = nn.nodes[i][j] / magnitudes[i][j];

            ctx.beginPath();
            ctx.arc(i * 100, j * -50, 20, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(${(val < 0) ? 255 * Math.min(1, Math.max(0, Math.abs(val))) : 0}, ${(val > 0) ? 255 * Math.min(1, Math.max(0, Math.abs(val))) : 0}, 0, 1)`;
            ctx.fill();
        }
    }

    ctx.restore();
});
quad.root.scale.set(0.55, 0.55, 1);

export const tracker = new Group();
tracker.add(quad.root);

const offset = new Vector3(0, 0, 0);

export function update(plane: PlaneTrack, dt: number) {
    const bounds = plane.getBoundsSmooth(dt);
    if (bounds === undefined) {
        tracker.visible = false;
        t = 0;
        return;
    }

    tracker.visible = true;
    tracker.position.copy(bounds.center).add(offset);
    tracker.quaternion.copy(bounds.rotation);
    const scale = bounds.size.x;
    tracker.scale.set(scale, scale, 1);

    quad.update(dt);
}