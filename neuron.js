import { Group, Vector3 } from "three";
import { loadImage } from "./animlib/animlib.js";
import { QuadCanvas } from "./quad.js";
export const markers = [
    "data/pattern-8.patt",
    "data/pattern-9.patt",
    "data/pattern-10.patt",
    "data/pattern-11.patt"
];
const testimg = await loadImage("neuron/main.png");
let t = 0;
const w = 640;
const h = 1000;
const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = `#000000`;
    ctx.fillRect(0, 0, w, h);
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(1 / 6, 1 / 6);
    ctx.drawImage(testimg, -testimg.width / 2, -testimg.height / 2);
    ctx.restore();
    t += dt;
});
quad.root.scale.set(0.55, 0.55, 1);
export const tracker = new Group();
tracker.add(quad.root);
const offset = new Vector3(0, 0, 0);
export function update(plane, dt) {
    const bounds = plane.getBoundsSmooth(dt);
    if (bounds === undefined) {
        tracker.visible = false;
        t = 0;
        return;
    }
    tracker.visible = true;
    tracker.position.set(0, 0, -3);
    quad.update(dt);
}
