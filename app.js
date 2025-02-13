import { html } from "rhu/html.js";
import { AmbientLight, BufferAttribute, BufferGeometry, DirectionalLight, Group, Mesh, MeshBasicMaterial, Texture, Vector3 } from "three";
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
const geometry = new BufferGeometry();
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, -1.0, 0.0,
    1.0, 1.0, 0.0,
    -1.0, 1.0, 0.0
]);
const uvs = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 0.0,
    1.0, 1.0,
    0.0, 1.0
]);
geometry.setAttribute('position', new BufferAttribute(vertices, 3));
geometry.setAttribute('uv', new BufferAttribute(uvs, 2));
const wrapper = html `<canvas m-id="canvas" style="display: none;" width="800" height="600"></canvas>`;
const ctx = wrapper.canvas.getContext("2d");
const texture = new Texture(wrapper.canvas);
const material = new MeshBasicMaterial({ map: texture, transparent: true });
const mesh = new Mesh(geometry, material);
group.add(mesh);
mesh.scale.set(1, 600 / 800, 1);
group.scale.set(0.5, 0.5, 1);
const pos = { x: 0, y: 0 };
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
    ctx.clearRect(0, 0, wrapper.canvas.width, wrapper.canvas.height);
    ctx.save();
    ctx.translate(wrapper.canvas.width / 2 + pos.x, wrapper.canvas.height / 2 + pos.y);
    ctx.beginPath();
    ctx.arc(0, 0, 60, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fill();
    ctx.restore();
    pos.x += 100 * dt;
    pos.y += 100 * dt;
    if (pos.x > wrapper.canvas.width / 2) {
        pos.x = -wrapper.canvas.width / 2;
    }
    if (pos.y > wrapper.canvas.height / 2) {
        pos.y = -wrapper.canvas.height / 2;
    }
    texture.needsUpdate = true;
};
