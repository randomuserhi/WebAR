import { AmbientLight, DirectionalLight } from "three";
import { AR, PlaneTrack } from "./ar.js";
import * as backprop from "./backprop.js";
import * as flappy from "./flappy.js";
import * as neuron from "./neuron.js";
import * as slp from "./slp.js";

const w = 940;
const h = w * 3/4; // NOTE(randomuserhi): AR js requires 4/3 ratio

const app = new AR(w, h);
app.camera.position.set(0, 0, 0);
app.scene.add(new AmbientLight(0xFFFFFF, 0.2));

const light = new DirectionalLight(0xFFFFFF, 1.5);
light.position.set(0, 10, 10);
light.target.translateZ(-1000);
light.target.translateY(-500);
app.scene.add(light);

const neuronPlane = new PlaneTrack(app, neuron.markers as any);
const slpPlane = new PlaneTrack(app, slp.markers as any);
const backpropPlane = new PlaneTrack(app, backprop.markers as any);
const flappyPlane = new PlaneTrack(app, flappy.markers as any);

app.scene.add(neuron.tracker);
app.scene.add(slp.tracker);
app.scene.add(backprop.tracker);
app.scene.add(flappy.tracker);

app.render = (dt) => {
    neuron.update(neuronPlane, dt);
    slp.update(slpPlane, dt);
    backprop.update(backpropPlane, dt);
    flappy.update(flappyPlane, dt);
};
