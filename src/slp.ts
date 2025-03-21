import { Group, Vector3 } from "three";
import { Anim, drawImage, loadImage, Section } from "./animlib/animlib.js";
import { PlaneTrack } from "./ar.js";
import { Bezier } from "./bezier.js";
import { QuadCanvas } from "./quad.js";

export const markers = [
    "data/pattern-0.patt",
    "data/pattern-1.patt",
    "data/pattern-2.patt",
    "data/pattern-3.patt"
];

let t = 0;

// 1.72 aspect ratio

const w = 581;
const h = 1000;

(window as any).x = 0;
(window as any).y = 0;
(window as any).r = 10;
(window as any).w = 1;

const x0 = await loadImage("slp/x0.png");
const x1 = await loadImage("slp/x1.png");
const x2 = await loadImage("slp/x2.png");
const b = await loadImage("slp/b.png");

const w0 = await loadImage("slp/w0.png");
const w1 = await loadImage("slp/w1.png");
const w2 = await loadImage("slp/w2.png");

const x0w0 = await loadImage("slp/x0w0.png");
const x1w1 = await loadImage("slp/x1w1.png");
const x2w2 = await loadImage("slp/x2w2.png");

const y_ = await loadImage("slp/y_.png");
const y = await loadImage("slp/y.png");
const y_a = await loadImage("slp/y_a.png");

const ease = Bezier(.47,.01,.48,.99);

const sections: Section<CanvasRenderingContext2D>[] = [
    new Section(0, 1, (t, ctx) => {
        t = ease(t);

        ctx.globalAlpha = Math.clamp01(t);

        ctx.save();
        ctx.translate(370, 130);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x2, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 130);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x1, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(110, 130);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x0, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.globalAlpha = 1;
    }),
    new Section(1, 2, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(370, 130);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x2, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 130);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x1, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(110, 130);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x0, 0, 0, 0, 0.15);
        ctx.restore();
    }),
    new Section(0, 1, (t, ctx) => {
        t = ease(t);

        ctx.globalAlpha = Math.clamp01(t);

        ctx.save();
        ctx.translate(320, 230);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w2, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 250);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w1, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(160, 230);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w0, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.globalAlpha = 1;
    }),
    new Section(1, 2, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(320 + 50 * t, 230 + 20 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w2, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 250);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w1, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(160 - 50 * t, 230 + 20 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w0, 0, 0, 0, 0.1);
        ctx.restore();
    }),
    new Section(2, 3, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(370, 250 - 60 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w2, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 250 - 60 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w1, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(110, 250 - 60 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(71, 175, 122)`;
        ctx.fill();
        drawImage(ctx, w0, 0, 0, 0, 0.1);
        ctx.restore();

        ctx.save();
        ctx.translate(370, 130 + 60 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x2, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 130 + 60 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x1, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(110, 130 + 60 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x0, 0, 0, 0, 0.15);
        ctx.restore();
    }),
    new Section(3, 4.5, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(370 - 130 * t, 190 + 190 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x2w2, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(110 + 130 * t, 190 + 190 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x0w0, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 190 + 190 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, x1w1, 0, 0, 0, 0.15);
        ctx.restore();
    }),
    new Section(4.5, 5.5, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(240, 380);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, y_, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.globalAlpha = Math.clamp01(t);

        ctx.save();
        ctx.translate(420, 380);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, b, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.globalAlpha = 1;
    }),
    new Section(5.5, 6.5, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(420 - 180 * t, 380);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, b, 0, 0, 0, 0.15);
        ctx.restore();

        ctx.save();
        ctx.translate(240, 380);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, y_, 0, 0, 0, 0.15);
        ctx.restore();
    }),
    new Section(6.5, 8, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(240, 380 + 160 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, y, 0, 0, 0, 0.15);
        ctx.restore();
    }),
    new Section(8, 10, (t, ctx) => {
        t = ease(t);

        ctx.save();
        ctx.translate(240, 540 + 380 * t);
        ctx.beginPath();
        ctx.arc(0, 0, 40, 0, 2 * Math.PI);
        ctx.fillStyle = `rgb(62, 17, 58)`;
        ctx.fill();
        ctx.strokeStyle = `rgb(151, 52, 123)`;
        ctx.lineWidth = 5;
        ctx.stroke();
        drawImage(ctx, y_a, 0, 0, 0, 0.15);
        ctx.restore();
    }),
];

const anim = new Anim<CanvasRenderingContext2D>(sections);
const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.clearRect(0, 0, w, h);

    anim.exec(t, ctx);
    
    t += dt;
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