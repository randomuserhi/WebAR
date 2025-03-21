import { Group, Vector3 } from "three";
import { Anim, drawImage, loadImage, Section } from "./animlib/animlib.js";
import { PlaneTrack } from "./ar.js";
import { Bezier } from "./bezier.js";
import { QuadCanvas } from "./quad.js";

export const markers = [
    "data/pattern-8.patt",
    "data/pattern-9.patt",
    "data/pattern-10.patt",
    "data/pattern-11.patt"
];

const assetScale = 1/3;

const body = await loadImage("neuron/body.png");
const nucleus_back = await loadImage("neuron/nucleus_back.png");
const nucleus_rim = await loadImage("neuron/nucleus_rim.png");
const nucleus_dna_strands = await loadImage("neuron/nucleus_dna_strands.png");
const nucleus_dna = await loadImage("neuron/nucleus_dna.png");
const nucleus_highlight = await loadImage("neuron/nucleus_highlight.png");
const sponge_yellow_0 = await loadImage("neuron/sponge_yellow_0.png");
const sponge_yellow_1 = await loadImage("neuron/sponge_yellow_1.png");
const sponge_blue = await loadImage("neuron/sponge_blue.png");
const head_rim = await loadImage("neuron/head_rim.png");
const mitochondria_0 = await loadImage("neuron/mitochondria_0.png");
const mitochondria_1 = await loadImage("neuron/mitochondria_1.png");

const green_cap_front = await loadImage("neuron/green_cap_front.png");
const green_cap_back = await loadImage("neuron/green_cap_back.png");
const green_1 = await loadImage("neuron/green_1.png");
const green_2 = await loadImage("neuron/green_2.png");
const green_3 = await loadImage("neuron/green_3.png");
const green_4 = await loadImage("neuron/green_4.png");
const green_receptor_front = await loadImage("neuron/green_receptor_front.png");
const green_receptor_back = await loadImage("neuron/green_receptor_back.png");

const red_cap_front = await loadImage("neuron/red_cap_front.png");
const red_cap_back = await loadImage("neuron/red_cap_back.png");
const red_1 = await loadImage("neuron/red_1.png");
const red_2 = await loadImage("neuron/red_2.png");
const red_3 = await loadImage("neuron/red_3.png");
const red_4 = await loadImage("neuron/red_4.png");

const ion = await loadImage("neuron/ion.png");
const ion_dark = await loadImage("neuron/ion_dark.png");

const cell_wall = await loadImage("neuron/cell_wall.png");

let t = 0;

// 1.56 aspect ratio

const w = 1280;
const h = 2000;

const sections: Section<CanvasRenderingContext2D>[] = [];
{
    const particles: {
        start: [number, number]
        vel: [number, number]
        startRot: number;
        velRot: number;
        scale: number;
        color: string;
    }[] = [
        {
            start: [300, 350],
            vel: [100, 50],
            startRot: 50,
            velRot: 90,
            scale: 1,
            color: `160, 32, 126`
        },
        {
            start: [350, 250],
            vel: [50, 100],
            startRot: 20,
            velRot: -50,
            scale: 0.75,
            color: `80, 22, 74`
        },
        {
            start: [300, 450],
            vel: [100, 20],
            startRot: 30,
            velRot: -150,
            scale: 0.75,
            color: `80, 22, 74`
        },
        {
            start: [500, 370],
            vel: [70, 70],
            startRot: 10,
            velRot: 120,
            scale: 0.9,
            color: `160, 32, 126`
        },
    ];
    for (const particle of particles) {
        sections.push(new Section(0, 8, (t, ctx, bezier) => {
            ctx.save();
            ctx.translate(particle.start[0] + (particle.vel[0] * bezier(t)), particle.start[1] + (particle.vel[1] * bezier(t)));
            ctx.rotate(bezier(t) * Math.deg2rad * particle.velRot + particle.startRot * Math.deg2rad);
            ctx.scale(particle.scale, particle.scale);
        
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.lineWidth = 25;
            ctx.lineCap = "round";
            ctx.strokeStyle = `rgba(${particle.color}, ${(t < 0.5 ? Math.clamp01(t / 0.1) : Math.clamp01((1 - t) / 0.1))})`;
            ctx.stroke();

            ctx.restore();
        }, () => {
            const bezier = Bezier(0,.53,.69,.82);
            return bezier;
        }));
    }
}
sections.push(new Section(1, 8, (t, ctx) => {
    ctx.globalAlpha = (t < 0.5 ? Math.clamp01(t / 0.1) : Math.clamp01((1 - t) / 0.1));

    ctx.beginPath();
    ctx.moveTo(470, 500);
    ctx.lineTo(920, 100);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(470, 500);
    ctx.lineTo(1050, 450);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.save();
    ctx.translate(1050, 250);
    ctx.rotate(0);
    ctx.scale(0.5, 0.5);

    // Create clip region
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 400, 0, 2 * Math.PI);
    ctx.restore();

    // clip
    ctx.clip();

    ctx.fillStyle = `rgb(6, 27, 36)`;
    ctx.fillRect(-400, -400, 800, 800);

    drawImage(ctx, red_cap_back, -60, -90);
    drawImage(ctx, red_1, -50, -90);

    {
        const particle = {
            end: [-145, 100],
            vel: [-50, -120],
            endRot: 45,
            velRot: 70,
            scale: 1.4,
            color: `160, 32, 126`
        };

        ctx.save();
        ctx.translate(particle.end[0] + (particle.vel[0] * (1 - t)), particle.end[1] + (particle.vel[1] * (1 - t)));
        ctx.rotate((1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad);
        ctx.scale(particle.scale, particle.scale);
        
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${particle.color}, 1)`;
        ctx.stroke();

        ctx.restore();
    }

    {
        const particle = {
            end: [-130, 0],
            vel: [10, -50],
            endRot: 20,
            velRot: 50,
            scale: 1,
            color: `80, 22, 74`
        };
    
        ctx.save();
        ctx.translate(particle.end[0] + (particle.vel[0] * (1 - t)), particle.end[1] + (particle.vel[1] * (1 - t)));
        ctx.rotate((1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad);
        ctx.scale(particle.scale, particle.scale);
            
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${particle.color}, 1)`;
        ctx.stroke();
    
        ctx.restore();
    }

    drawImage(ctx, red_2, -60, -100);

    {
        const particle = {
            end: [130, -70],
            vel: [-20, -50],
            endRot: -70,
            velRot: 90,
            scale: 1.4,
            color: `160, 32, 126`
        };
    
        ctx.save();
        ctx.translate(particle.end[0] + (particle.vel[0] * (1 - t)), particle.end[1] + (particle.vel[1] * (1 - t)));
        ctx.rotate((1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad);
        ctx.scale(particle.scale, particle.scale);
            
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${particle.color}, 1)`;
        ctx.stroke();
    
        ctx.restore();
    }

    {
        const particle = {
            end: [40, -110],
            vel: [-20, -70],
            endRot: 40,
            velRot: 100,
            scale: 1,
            color: `128, 34, 117`
        };

        ctx.save();
        ctx.translate(particle.end[0] + (particle.vel[0] * (1 - t)), particle.end[1] + (particle.vel[1] * (1 - t)));
        ctx.rotate((1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad);
        ctx.scale(particle.scale, particle.scale);
        
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${particle.color}, 1)`;
        ctx.stroke();

        ctx.restore();
    }

    drawImage(ctx, red_3, -60, -110);

    {
        const particle = {
            end: [-75, -115],
            vel: [50, -150],
            endRot: 110,
            velRot: -50,
            scale: 1.4,
            color: `160, 32, 126`
        };

        ctx.save();
        ctx.translate(particle.end[0] + (particle.vel[0] * (1 - t)), particle.end[1] + (particle.vel[1] * (1 - t)));
        ctx.rotate((1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad);
        ctx.scale(particle.scale, particle.scale);
        
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${particle.color}, 1)`;
        ctx.stroke();

        ctx.restore();
    }

    {
        const particle = {
            end: [-35, 30],
            vel: [-50, -50],
            endRot: -70,
            velRot: -20,
            scale: 2,
            color: `213, 37, 154`
        };

        ctx.save();
        ctx.translate(particle.end[0] + (particle.vel[0] * (1 - t)), particle.end[1] + (particle.vel[1] * (1 - t)));
        ctx.rotate((1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad);
        ctx.scale(particle.scale, particle.scale);
        
        ctx.beginPath();
        ctx.moveTo(-10, 0);
        ctx.lineTo(10, 0);
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
        ctx.strokeStyle = `rgba(${particle.color}, 1)`;
        ctx.stroke();

        ctx.restore();
    }

    drawImage(ctx, red_4, -65, -120);
    drawImage(ctx, red_cap_front, -75, -215);

    drawImage(ctx, green_cap_back, 30, 95);
    drawImage(ctx, green_1, 20, 90);
    drawImage(ctx, green_receptor_back, -5, 80);
    drawImage(ctx, green_2, 25, 100);
    drawImage(ctx, green_3, 33, 110);
    drawImage(ctx, green_receptor_front, 10, 116);
    drawImage(ctx, green_4, 37, 122);
    drawImage(ctx, green_cap_front, 60, 220);

    ctx.beginPath();
    ctx.arc(0, 0, 400, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.restore();

    ctx.globalAlpha = 1;
}));
{
    const particles: {
        start: [number, number]
        vel: [number, number]
        startRot: number;
        velRot: number;
        scale: number;
        img: ImageBitmap;
    }[] = [
        {
            start: [900, 250],
            vel: [-100, 350],
            startRot: 50,
            velRot: -180,
            scale: 0.6,
            img: ion
        },
        {
            start: [700, 390],
            vel: [50, 110],
            startRot: 50,
            velRot: 90,
            scale: 0.3,
            img: ion
        },
        {
            start: [900, 500],
            vel: [-50, 50],
            startRot: 50,
            velRot: 150,
            scale: 0.3,
            img: ion
        },
    ];
    for (const particle of particles) {
        sections.push(new Section(8, 16, (t, ctx, bezier) => {
            ctx.globalAlpha = (t < 0.5 ? Math.clamp01(t / 0.1) : Math.clamp01((1 - t) / 0.1));
            drawImage(
                ctx, 
                particle.img, 
                particle.start[0] + (particle.vel[0] * bezier(t)), 
                particle.start[1] + (particle.vel[1] * bezier(t)),
                bezier(t) * Math.deg2rad * particle.velRot + particle.startRot * Math.deg2rad,
                particle.scale);
            ctx.globalAlpha = 1;
        }, () => {
            const bezier = Bezier(.06,.21,.29,.42);
            return bezier;
        }));
    }
}
sections.push(new Section(9, 16, (t, ctx) => {
    ctx.globalAlpha = (t < 0.5 ? Math.clamp01(t / 0.1) : Math.clamp01((1 - t) / 0.1));

    ctx.beginPath();
    ctx.moveTo(800, 560);
    ctx.lineTo(330, 855);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(800, 560);
    ctx.lineTo(600, 1090);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.save();
    ctx.translate(w / 2 - 200, h / 2);
    ctx.rotate(0);
    ctx.scale(0.5, 0.5);

    // Create clip region
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, 370, 0, 2 * Math.PI);
    ctx.restore();

    // clip
    ctx.clip();

    drawImage(ctx, cell_wall, 10, 0);

    {
        const particle = {
            end: [50, -120],
            vel: [-50, -150],
            scale: 1.5,
            img: ion_dark
        };
        
        drawImage(
            ctx, 
            particle.img, 
            particle.end[0] + (particle.vel[0] * (1 - t)), 
            particle.end[1] + (particle.vel[1] * (1 - t)),
            0,
            particle.scale);
    }

    {
        const particle = {
            end: [-200, -220],
            vel: [-100, -200],
            scale: 1,
            img: ion_dark
        };
        
        drawImage(
            ctx, 
            particle.img, 
            particle.end[0] + (particle.vel[0] * (1 - t)), 
            particle.end[1] + (particle.vel[1] * (1 - t)),
            0,
            particle.scale);
    }

    {
        const particle = {
            end: [10, 400],
            vel: [50, -50],
            endRot: -60,
            velRot: -20,
            scale: 2,
            img: ion
        };
        
        drawImage(
            ctx, 
            particle.img, 
            particle.end[0] + (particle.vel[0] * (1 - t)), 
            particle.end[1] + (particle.vel[1] * (1 - t)),
            (1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad,
            particle.scale);
    }

    {
        const particle = {
            end: [100, 150],
            vel: [-50, -150],
            endRot: 60,
            velRot: 60,
            scale: 1,
            img: ion
        };
        
        drawImage(
            ctx, 
            particle.img, 
            particle.end[0] + (particle.vel[0] * (1 - t)), 
            particle.end[1] + (particle.vel[1] * (1 - t)),
            (1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad,
            particle.scale);
    }

    {
        const particle = {
            end: [-50, 0],
            vel: [50, -250],
            endRot: 60,
            velRot: 100,
            scale: 1.3,
            img: ion
        };
        
        drawImage(
            ctx, 
            particle.img, 
            particle.end[0] + (particle.vel[0] * (1 - t)), 
            particle.end[1] + (particle.vel[1] * (1 - t)),
            (1 - t) * Math.deg2rad * particle.velRot + particle.endRot * Math.deg2rad,
            particle.scale);
    }

    ctx.beginPath();
    ctx.arc(0, 0, 370, 0, 2 * Math.PI);
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 10;
    ctx.stroke();

    ctx.restore();

    ctx.globalAlpha = 1;
}));
{
    const particles: {
        start: [number, number]
        vel: [number, number]
        startRot: number;
        velRot: number;
        scale: number;
        color: string;
    }[] = [
        {
            start: [300 - 50, 350 + 1300],
            vel: [-100, 50],
            startRot: 50,
            velRot: 90,
            scale: 1,
            color: `160, 32, 126`
        },
        {
            start: [350 - 50, 250 + 1300],
            vel: [-50, 100],
            startRot: 20,
            velRot: -50,
            scale: 0.75,
            color: `80, 22, 74`
        },
        {
            start: [300 - 50, 450 + 1300],
            vel: [-100, 20],
            startRot: 30,
            velRot: -150,
            scale: 0.75,
            color: `80, 22, 74`
        },
        {
            start: [370 - 50, 370 + 1300],
            vel: [-70, 70],
            startRot: 10,
            velRot: 120,
            scale: 0.9,
            color: `160, 32, 126`
        },
    ];
    for (const particle of particles) {
        sections.push(new Section(16, 24, (t, ctx, bezier) => {
            ctx.save();
            ctx.translate(particle.start[0] + (particle.vel[0] * bezier(t)), particle.start[1] + (particle.vel[1] * bezier(t)));
            ctx.rotate(bezier(t) * Math.deg2rad * particle.velRot + particle.startRot * Math.deg2rad);
            ctx.scale(particle.scale, particle.scale);
        
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.lineWidth = 25;
            ctx.lineCap = "round";
            ctx.strokeStyle = `rgba(${particle.color}, ${(t < 0.5 ? Math.clamp01(t / 0.1) : Math.clamp01((1 - t) / 0.1))})`;
            ctx.stroke();

            ctx.restore();
        }, () => {
            const bezier = Bezier(0,.53,.69,.82);
            return bezier;
        }));
    }
}

const anim = new Anim<CanvasRenderingContext2D>(sections);

const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.clearRect(0, 0, w, h);

    /*//ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(t, 0.4)})`;
    ctx.fillStyle = `#000000`;
    ctx.fillRect(0, 0, w, h);*/

    ctx.save();
    ctx.translate(w / 2, h / 2);

    // Reconstruction
    const timescale = 0.5;

    ctx.save();
    
    drawImage(ctx, body, 34, 0, 0, assetScale);

    ctx.save();
    ctx.translate(Math.cos(1 * t * timescale) * 5, Math.sin(1 * t * timescale) * 1.5);
    drawImage(ctx, mitochondria_0, -32, -333, Math.cos(0.5 * t * timescale) * Math.deg2rad * 5, assetScale);
    ctx.restore();

    ctx.save();
    ctx.translate(Math.sin(1 * t * timescale + Math.PI * 1.4) * 5, Math.cos(0.7 * t * timescale + Math.PI) * 3);
    drawImage(ctx, sponge_blue, 32, -430, Math.cos(0.7 * t * timescale) * Math.deg2rad * 3, assetScale);
    ctx.restore();

    ctx.save();
    ctx.translate(Math.sin(0.7 * t * timescale + Math.PI) * 4 + 5, -Math.cos(1 * t * timescale + Math.PI * 1.4) * 4 - 7);
    drawImage(ctx, sponge_yellow_1, 95, -387, Math.sin(1 * t * timescale) * Math.deg2rad * 3, assetScale);
    ctx.restore();

    ctx.save();
    ctx.translate(Math.cos(0.7 * t * timescale + Math.PI) * 3, Math.sin(0.7 * t * timescale + Math.PI) * 5);
    drawImage(ctx, nucleus_back, 68, -342, 0, assetScale);
    drawImage(ctx, nucleus_dna_strands, 61, -342, Math.sin(1 * t * timescale) * Math.deg2rad * 10, assetScale);
    drawImage(ctx, nucleus_rim, 68, -342, 0, assetScale);
    drawImage(ctx, nucleus_dna, 70, -342, 0, assetScale);
    drawImage(ctx, nucleus_highlight, 80, -340, 0, assetScale);
    ctx.restore();

    ctx.save();
    ctx.translate(Math.cos(1 * t * timescale + Math.PI * 0.4) * 5 - 3, Math.sin(0.7 * t * timescale + Math.PI * 0.4) * 3);
    drawImage(ctx, mitochondria_1, 197, -365, Math.sin(1 * t * timescale) * Math.deg2rad * 2, assetScale);
    ctx.restore();
    
    ctx.save();
    ctx.translate(Math.sin(1 * t * timescale + Math.PI * 1.4) * 3, Math.cos(1 * t * timescale + Math.PI) * 3);
    drawImage(ctx, sponge_yellow_0, 95, -307, Math.sin(1 * t * timescale) * Math.deg2rad * 1.5, assetScale);
    ctx.restore();

    drawImage(ctx, head_rim, 123, -306, 0, assetScale);
    
    ctx.restore();
    // End Reconstruction

    ctx.restore();

    anim.exec(t, ctx);

    t += dt;
});
quad.root.scale.set(0.55, 0.55, 1);

export const tracker = new Group();
tracker.add(quad.root);

const offset = new Vector3(0, 0, 0);

export function update(plane: PlaneTrack, dt: number, filter: HTMLDivElement) {
    const bounds = plane.getBoundsSmooth(dt);
    if (bounds === undefined) {
        filter.style.background = "rgba(0, 0, 0, 1)";
        //tracker.visible = false;
        //t = 0;
        //return;
    }
    
    /*tracker.visible = true;
    tracker.position.copy(bounds.center).add(offset);
    tracker.quaternion.copy(bounds.rotation);
    const scale = bounds.size.x;
    tracker.scale.set(scale, scale, 1);*/

    tracker.position.set(0, 0, -5);
    tracker.visible = true;
    
    filter.style.background = `rgba(0, 0, 0, ${Math.clamp01(t / 0.5) * 0.85})`;

    quad.update(dt);
}