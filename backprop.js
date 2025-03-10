import { Group, Vector3 } from "three";
import { QuadCanvas } from "./quad.js";
export const markers = [
    "data/pattern-4.patt",
    "data/pattern-5.patt",
    "data/pattern-6.patt",
    "data/pattern-7.patt"
];
let t = 0;
const w = 855;
const h = 1000;
const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.fillRect(0, 0, w, h);
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
    tracker.position.copy(bounds.center).add(offset);
    tracker.quaternion.copy(bounds.rotation);
    const scale = bounds.size.x;
    tracker.scale.set(scale, scale, 1);
    quad.update(dt);
}
