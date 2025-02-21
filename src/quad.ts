import { html } from "rhu/html.js";
import { BufferAttribute, BufferGeometry, Group, Mesh, MeshBasicMaterial, Object3D, Texture } from "three";

const geometry = new BufferGeometry();
const vertices = new Float32Array([
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    1.0,  1.0, 0.0,

    -1.0, -1.0, 0.0,
    1.0,  1.0, 0.0,
    -1.0,  1.0, 0.0
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

export class QuadCanvas {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly texture: Texture;

    readonly root: Object3D;

    public render?: (ctx: CanvasRenderingContext2D, dt: number) => void;

    constructor(width: number, height: number, render?: QuadCanvas["render"]) {
        this.render = render;

        const wrapper = html<{ canvas: HTMLCanvasElement }>`<canvas m-id="canvas" style="display: none;" width="${width.toString()}" height="${height.toString()}"></canvas>`;
        this.ctx = wrapper.canvas.getContext("2d")!;
        this.texture = new Texture(wrapper.canvas);

        const material = new MeshBasicMaterial({ map: this.texture, transparent: true });
        const mesh = new Mesh(geometry, material);
        mesh.scale.set(1, height / width, 1);
        
        this.root = new Group();
        this.root.add(mesh);
    }

    public update(dt: number) {
        if (this.render !== undefined) {
            this.render(this.ctx, dt);
        }

        this.texture.needsUpdate = true;
    }
}