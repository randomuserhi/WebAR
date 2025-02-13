import { AmbientLight, DirectionalLight, Group, Mesh, Vector3 } from "three";
import { AR, PlaneTrack } from "./ar.js";
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
const plane = new PlaneTrack(app, markers);
const tracker = new Group();
app.scene.add(tracker);
const group = new Group();
import { MeshPhongMaterial, MeshStandardMaterial, SphereGeometry } from "three";
import { DynamicSplineGeometry } from "./spline.js";
const sphereGeometry = new SphereGeometry(1);
const nodeMaterial = new MeshPhongMaterial({ color: 0xcccccc });
const weightMaterial = new MeshStandardMaterial({ color: 0xff0000 });
const sphere0 = new Mesh(sphereGeometry, nodeMaterial);
const sphere1 = new Mesh(sphereGeometry, nodeMaterial);
const sphere2 = new Mesh(sphereGeometry, nodeMaterial);
group.add(sphere0, sphere1, sphere2);
const spline0 = new Mesh(new DynamicSplineGeometry(0.07, 6, 50, true), weightMaterial);
const spline1 = new Mesh(new DynamicSplineGeometry(0.07, 6, 50, true), weightMaterial);
group.add(spline0, spline1);
sphere0.position.set(-3, 3, 0);
sphere1.position.set(-3, -3, 0);
sphere2.position.set(3, 0, 0);
spline0.renderOrder = -1;
spline1.renderOrder = -1;
spline0.geometry.morph([new Vector3(-3, 3, 0), new Vector3(3, 0, 0)]);
spline1.geometry.morph([new Vector3(-3, -3, 0), new Vector3(3, 0, 0)]);
group.scale.set(0.05, 0.05, 0.05);
tracker.add(group);
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
};
