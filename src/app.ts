import { AmbientLight, DirectionalLight, Group, Vector3 } from "three";
import { AR, PlaneTrack } from "./ar.js";
import { QuadCanvas } from "./quad.js";

const w = 924;
const h = 693;

const app = new AR(w, h);
app.camera.position.set(0, 0, 0);
app.scene.add(new AmbientLight(0xFFFFFF, 0.2));

const light = new DirectionalLight(0xFFFFFF, 1.5);
light.position.set(0, 10, 10);
light.target.translateZ(-1000);
light.target.translateY(-500);
app.scene.add(light);

// Single layer perceptron
/*const markers = [
    "data/pattern-0.patt",
    "data/pattern-1.patt",
    "data/pattern-2.patt",
    "data/pattern-3.patt"
];*/

// Backprop
/*const markers = [
    "data/pattern-4.patt",
    "data/pattern-5.patt",
    "data/pattern-6.patt",
    "data/pattern-7.patt"
];*/

// neuron
const markers = [
    "data/pattern-8.patt",
    "data/pattern-9.patt",
    "data/pattern-10.patt",
    "data/pattern-11.patt"
];

// flappy bird
/*const markers = [
    "data/pattern-12.patt",
    "data/pattern-13.patt",
    "data/pattern-14.patt",
    "data/pattern-19.patt"
];*/

const plane = new PlaneTrack(app, markers as any);

const tracker = new Group();
app.scene.add(tracker);

const quad = new QuadCanvas((ctx, dt) => {
    ctx.fillRect(0, 0, 800, 600);
});
tracker.add(quad.root);
quad.root.scale.set(0.1, 0.1, 1);

const offset = new Vector3(0, 0, 0);
app.render = (dt) => {
    const bounds = plane.getBoundsSmooth(dt);
    if (bounds === undefined) {
        tracker.visible = false;
        return;
    }

    tracker.visible = true;
    tracker.position.copy(bounds.center).add(offset);
    tracker.quaternion.copy(bounds.rotation);
    const scale = bounds.size.x;
    tracker.scale.set(scale, scale, 1);

    quad.update(dt);
};
