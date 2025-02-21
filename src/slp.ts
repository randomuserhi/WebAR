import { Group, Vector3 } from "three";
import { PlaneTrack } from "./ar.js";
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

const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.fillRect(0, 0, w, h);
});
quad.root.scale.set(0.31, 0.31, 1);

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