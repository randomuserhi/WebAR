import { Group, MeshStandardMaterial, Vector3 } from "three";
import { Text } from "troika-three-text";
import { PlaneTrack } from "./ar.js";
import { Bezier } from "./bezier.js";
import { meanSquaredError, NeuralNetwork } from "./nn.js";
import { QuadCanvas } from "./quad.js";

export const markers = [
    "data/pattern-4.patt",
    "data/pattern-5.patt",
    "data/pattern-6.patt",
    "data/pattern-7.patt"
];

let t = 0;

// 1.17 aspect ratio

const w = 855;
const h = 1000;

const material = new MeshStandardMaterial({ color: 0xffffff, depthTest: false, depthWrite: false });

const x2 = new Text(undefined, material);
x2.font = "./fonts/cambria/cambria.ttf";
x2.fontSize = 0.125;
x2.textAlign = "center";
x2.anchorX = "center";
x2.anchorY = "middle";
x2.color = 0xffffff;
x2.position.set(-0.08, 0.77, 0);
x2.renderOrder = 1;
x2.frustumCulled = false;

x2.text = "0.0";

const x1 = new Text(undefined, material);
x1.font = "./fonts/cambria/cambria.ttf";
x1.fontSize = 0.125;
x1.textAlign = "center";
x1.anchorX = "center";
x1.anchorY = "middle";
x1.color = 0xffffff;
x1.position.set(-0.575, 0.77, 0);
x1.renderOrder = 1;
x1.frustumCulled = false;

x1.text = "0.0";

const w1 = new Text(undefined, material);
w1.font = "./fonts/cambria/cambria.ttf";
w1.fontSize = 0.075;
w1.textAlign = "center";
w1.anchorX = "center";
w1.anchorY = "middle";
w1.color = 0xffffff;
w1.position.set(-0.575, 0.42, 0);
w1.renderOrder = 1;
w1.frustumCulled = false;

w1.text = "0.0";

const w1dir = new Text(undefined, material);
w1dir.font = "./fonts/cambria/cambria.ttf";
w1dir.fontSize = 0.1;
w1dir.textAlign = "center";
w1dir.anchorX = "center";
w1dir.anchorY = "middle";
w1dir.color = 0xffffff;
w1dir.position.set(-0.575 + 0.15, 0.42, 0);
w1dir.renderOrder = 1;
w1dir.frustumCulled = false;

w1dir.text = "↑↓";

const w2 = new Text(undefined, material);
w2.font = "./fonts/cambria/cambria.ttf";
w2.fontSize = 0.075;
w2.textAlign = "center";
w2.anchorX = "center";
w2.anchorY = "middle";
w2.color = 0xffffff;
w2.position.set(-0.08, 0.42, 0);
w2.renderOrder = 1;
w2.frustumCulled = false;

w2.text = "0.0";

const w2dir = new Text(undefined, material);
w2dir.font = "./fonts/cambria/cambria.ttf";
w2dir.fontSize = 0.1;
w2dir.textAlign = "center";
w2dir.anchorX = "center";
w2dir.anchorY = "middle";
w2dir.color = 0xffffff;
w2dir.position.set(-0.08 + 0.15, 0.42, 0);
w2dir.renderOrder = 1;
w2dir.frustumCulled = false;

w2dir.text = "↑↓";

const b = new Text(undefined, material);
b.font = "./fonts/cambria/cambria.ttf";
b.fontSize = 0.125;
b.textAlign = "center";
b.anchorX = "center";
b.anchorY = "middle";
b.color = 0xffffff;
b.position.set(-0.3275, -0.75, 0);
b.renderOrder = 1;
b.frustumCulled = false;

b.text = "0.0";

const bdir = new Text(undefined, material);
bdir.font = "./fonts/cambria/cambria.ttf";
bdir.fontSize = 0.15;
bdir.textAlign = "center";
bdir.anchorX = "center";
bdir.anchorY = "middle";
bdir.color = 0xffffff;
bdir.position.set(-0.1, -0.75, 0);
bdir.frustumCulled = false;
bdir.renderOrder = 1;

bdir.text = "↑↓";

const y = new Text(undefined, material);
y.font = "./fonts/cambria/cambria.ttf";
y.fontSize = 0.125;
y.textAlign = "center";
y.anchorX = "center";
y.anchorY = "middle";
y.color = 0xffffff;
y.position.set(0.6, -0.75, 0);
y.renderOrder = 1;
y.frustumCulled = false;

y.text = "0.0";

const info = new Text(undefined, material);
info.font = "./fonts/cambria/cambria.ttf";
info.fontSize = 0.125;
info.textAlign = "center";
info.anchorX = "middle";
info.anchorY = "top";
info.color = 0xffffff;
info.position.set(0.3, 0.7, 0);
info.renderOrder = 1;
info.frustumCulled = false;

info.text = `Iteration: 1
Y = 0.0`;

const quad = new QuadCanvas(w, h, (ctx, dt) => {
    ctx.clearRect(0, 0, w, h);

    ctx.save();
    ctx.translate(390, 170);
    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(62, 17, 58)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(180, 170);
    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(62, 17, 58)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(285, 820);
    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(62, 17, 58)`;
    ctx.fill();
    ctx.strokeStyle = `rgba(142, 217, 115, 1)`;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.restore();

    ctx.save();
    ctx.translate(390, 320);
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(71, 175, 122)`;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(180, 320);
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(71, 175, 122)`;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(680, 820);
    ctx.beginPath();
    ctx.arc(0, 0, 65, 0, 2 * Math.PI);
    ctx.fillStyle = `rgb(62, 17, 58)`;
    ctx.fill();
    ctx.strokeStyle = `rgb(151, 52, 123)`;
    ctx.lineWidth = 7;
    ctx.stroke();
    ctx.restore();
});
quad.root.scale.set(0.55, 0.55, 1);
quad.root.add(x1, w1, x2, w2, b, y, info, w1dir, w2dir, bdir);
quad.root.renderOrder = 0;
quad.update(0);

export const tracker = new Group();
tracker.add(quad.root);

const offset = new Vector3(0, 0, 0);

const net = new NeuralNetwork([2, 1]);
const error = new Array(net.numOutputs);
const derivations = new Array(net.numOutputs);
const inputs = net.inputs;
const outputs = net.outputs;
let _w1 = 0;
let _w2 = 0;
let _b = 0;
const vals = {
    x1: 0,
    x2: 0,
    w1: 0,
    w2: 0,
    b: 0,
    y: 0,
};
let cost;
let deltas;
let iter = 0;
let target = 0;
function reset() {
    iter = 0;
    target = Math.randomRange(0, 1);
    inputs[0] = Math.randomRange(0, 1);
    inputs[1] = Math.randomRange(0, 1);
    net.randAll(() => Math.randomRange(0, 1));

    updateText();
}

function updateText() {
    x1.text = `${Math.round(net.nodes[0][0] * 100) / 100}`;
    x2.text = `${Math.round(net.nodes[0][1] * 100) / 100}`;

    w1.text = `${Math.round(net.weights[0][0] * 100) / 100}`;
    w2.text = `${Math.round(net.weights[0][1] * 100) / 100}`;

    b.text = `${Math.round(net.bias[0][0] * 100) / 100}`;

    y.text = `${Math.round(outputs[0] * 100) / 100}`;

    info.text = `Iteration: ${iter}
Y = ${Math.round(target * 100) / 100}`;
}

const bezier = Bezier(.75,.01,.21,1);
export function update(plane: PlaneTrack, dt: number) {
    const bounds = plane.getBoundsSmooth(dt);
    if (bounds === undefined) {
        tracker.visible = false;
        t = 0;
        reset();
        return;
    }

    tracker.visible = true;
    tracker.position.copy(bounds.center).add(offset);
    tracker.quaternion.copy(bounds.rotation);
    const scale = bounds.size.x;
    tracker.scale.set(scale, scale, 1);

    if (Math.abs(outputs[0] - target) > 0.001) {
        if (t <= 0) {
            iter += 1;

            _w1 = net.weights[0][0];
            _w2 = net.weights[0][1];
            _b = net.bias[0][0];

            net.feedforward();
            updateText();
        
            cost = meanSquaredError(net, [target], { error, derivations });
            deltas = net.backprop(cost.derivations);
            net.fit(deltas, 0.2);

            t = 2;
        } else if (t <= 1.5) {
            const _t = bezier(1 - Math.clamp01(t / 1.5));

            updateText();

            const _w1dir = net.weights[0][0] - _w1;
            const _w2dir = net.weights[0][1] - _w2;
            const _bdir = net.bias[0][0] - _b;

            w1dir.text = `${Math.abs(_w1dir) > 0.001 ? _w1dir > 0 ? "↑" : "↓" : ""}`;
            w2dir.text = `${Math.abs(_w2dir) > 0.001 ? _w2dir > 0 ? "↑" : "↓" : ""}`;
            bdir.text = `${Math.abs(_bdir) > 0.001 ? _bdir > 0 ? "↑" : "↓" : ""}`;

            w1.text = `${Math.round((_w1 + _w1dir * _t) * 100) / 100}`;
            w2.text = `${Math.round((_w2 + _w2dir * _t) * 100) / 100}`;
            b.text = `${Math.round((_b + _bdir * _t) * 100) / 100}`;
        } else {
            w1dir.text = ``;
            w2dir.text = ``;
            bdir.text = ``;
        }

        t -= dt;
    }
    
}