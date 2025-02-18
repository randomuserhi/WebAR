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

const markers = [
    "data/letterA.patt",
    "data/letterB.patt",
    "data/letterC.patt",
    "data/letterD.patt"
];

const plane = new PlaneTrack(app, markers as any);

const tracker = new Group();
app.scene.add(tracker);

const quad = new QuadCanvas((ctx, dt) => {
    
});
tracker.add(quad.root);

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
    tracker.scale.set(scale, scale, scale);
    
    quad.update(dt);
};
