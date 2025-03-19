import { Group, Vector3 } from "three";
import { Anim, drawImage, loadImage, Section } from "./animlib/animlib.js";
import { PlaneTrack } from "./ar.js";
import { QuadCanvas } from "./quad.js";

export const markers = [
    "data/pattern-8.patt",
    "data/pattern-9.patt",
    "data/pattern-10.patt",
    "data/pattern-11.patt"
];

const assetScale = 1/3;

const reference = await loadImage("neuron/full.png");

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

let t = 0;

// 1.56 aspect ratio

const w = 1280;
const h = 2000;

const anim = new Anim([
    new Section(0, 5, (t) => {
        console.log(`0-5: ${t}`);
    }),
    new Section(0, 10, (t) => {
        console.log(`0-10: ${t}`);
    })
]);

const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.clearRect(0, 0, w, h);

    //ctx.fillStyle = `rgba(0, 0, 0, ${Math.min(t, 0.4)})`;
    ctx.fillStyle = `#000000`;
    ctx.fillRect(0, 0, w, h);
    
    anim.exec(t);

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

    t += dt;
});
quad.root.scale.set(0.55, 0.55, 1);

export const tracker = new Group();
tracker.add(quad.root);

const offset = new Vector3(0, 0, 0);

export function update(plane: PlaneTrack, dt: number) {
    const bounds = plane.getBoundsSmooth(dt);
    if (bounds === undefined) {
        //tracker.visible = false;
        //t = 0;
        //return;
    }

    /*tracker.visible = true;
    tracker.position.copy(bounds.center).add(offset);
    tracker.quaternion.copy(bounds.rotation);
    const scale = bounds.size.x;
    tracker.scale.set(scale, scale, 1);*/

    tracker.visible = true;
    tracker.position.set(0, 0, -3);

    quad.update(dt);
}