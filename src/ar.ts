import { Clock, Matrix4, Object3D, PerspectiveCamera, Quaternion, Scene, Vector2, Vector3, WebGLRenderer } from "three";
import { ready } from "./three.api.js";

console.log(`THREE is ${ready ? "ready" : "not ready"}.`);

interface Bounds {
    center: Vector3;
    rotation: Quaternion;
    size: Vector3;
}

export class ImageTrack {
    private root: Object3D;

    constructor(ar: AR, image: string) {
        this.root = new Object3D();
        this.root.matrixAutoUpdate = false;
        ar.scene.add(this.root);

        new THREEx.ArMarkerControls(ar.arToolkitContext, this.root, {
            type: "nft", descriptorsUrl: image,
        });
    }

    public getBounds(): Bounds | undefined {
        const image = this.root.visible ? this.root : undefined;

        if (image) {
            return {
                center: this.root.position,
                rotation: this.root.quaternion,
                size: this.root.scale
            }; 
        } else return undefined;
    }

    private smooth = {
        center: new Vector3(0, 0, 0),
        rotation: new Quaternion(0, 0, 0, 1),
        size: new Vector3(0, 0, 0),
        temp2: new Vector2(),
        temp3: new Vector3(),
        visible: 0,
    };
    public getBoundsSmooth(dt: number): Bounds | undefined {
        const bounds = this.getBounds();
        const { center, rotation, size, temp2, temp3 } = this.smooth;   
        if (bounds === undefined) {
            if (this.smooth.visible > 0) {
                this.smooth.visible = Math.max(0, this.smooth.visible - dt);
                return this.smooth;
            } else return undefined;
        }

        this.smooth.visible = Math.min(0.5, this.smooth.visible + dt);

        if (temp2.subVectors(size, bounds.size).lengthSq() > 4) {
            size.copy(bounds.size);
        } else {
            size.lerp(bounds.size, 5 * dt);
        }
        if (temp3.subVectors(center, bounds.center).lengthSq() > 4) {
            center.copy(bounds.center);
        } else {
            center.lerp(bounds.center, 10 * dt);
        }

        rotation.slerp(bounds.rotation, 2.5 * dt);

        return this.smooth;
    }
}

export class PlaneTrack {
    private roots: Object3D[];
    
    constructor(ar: AR, markers: [topLeft: string, topRight: string, bottomLeft: string, bottomRight: string]) {
        this.roots = [];
        
        for (const marker of markers) {
            const markerRoot = new Object3D();
            markerRoot.matrixAutoUpdate = false;
            ar.scene.add(markerRoot);
            
            // Debug
            //markerRoot.add(new Mesh(new BoxGeometry(), new MeshNormalMaterial()));

            new THREEx.ArMarkerControls(ar.arToolkitContext, markerRoot, {
                type: "pattern", patternUrl: marker
            });

            this.roots.push(markerRoot);
        }
    }

    private static FUNC_getBounds = {
        center: new Vector3(0, 0, 0),
        rotation: new Quaternion(),
        tempRot: new Quaternion(),
        mat: new Matrix4(),
        normal: new Vector3(0, 0, 0),
        tempNorm: new Vector3(0, 0, 0),
        tempXaxis: new Vector3(0, 0, 0),
        tempYaxis: new Vector3(0, 0, 0),
        xaxis: new Vector3(0, 0, 0),
        yaxis: new Vector3(0, 0, 0),
        size: new Vector3(0, 0),
    };
    public getBounds(): Bounds | undefined {
        const { center, xaxis, yaxis, normal, mat, rotation, tempRot, tempXaxis, tempYaxis, size } = PlaneTrack.FUNC_getBounds;      

        const tl = this.roots[0].visible ? this.roots[0] : undefined;
        const tr = this.roots[1].visible ? this.roots[1] : undefined;
        const bl = this.roots[2].visible ? this.roots[2] : undefined;
        const br = this.roots[3].visible ? this.roots[3] : undefined;

        if (tl && tr && bl && br) {
            center.addVectors(tl.position, tr.position);
            center.add(bl.position);
            center.add(br.position);
            center.divideScalar(4);

            size.set(0, 0, 1);

            xaxis.subVectors(br.position, bl.position);
            size.x += xaxis.length();
            yaxis.subVectors(tl.position, bl.position);
            size.y += yaxis.length();
            
            xaxis.normalize();
            yaxis.normalize();
            yaxis.copy(tempYaxis.copy(yaxis).sub(tempXaxis.copy(xaxis).multiplyScalar(xaxis.dot(yaxis))));
            normal.crossVectors(xaxis, yaxis).normalize();
            mat.makeBasis(xaxis, yaxis, normal);

            rotation.setFromRotationMatrix(mat);

            xaxis.subVectors(tr.position, tl.position);
            size.x += xaxis.length();
            yaxis.subVectors(tr.position, br.position);
            size.y += yaxis.length();

            xaxis.normalize();
            yaxis.normalize();
            yaxis.copy(tempYaxis.copy(yaxis).sub(tempXaxis.copy(xaxis).multiplyScalar(xaxis.dot(yaxis))));
            normal.crossVectors(xaxis, yaxis).normalize();
            mat.makeBasis(xaxis, yaxis, normal);

            rotation.slerp(tempRot.setFromRotationMatrix(mat), 0.5);

            size.divideScalar(2);

            return PlaneTrack.FUNC_getBounds;
        } else if (tl && tr && br) {
            center.addVectors(tl.position, br.position);
            center.divideScalar(2);

            xaxis.subVectors(tr.position, tl.position);
            yaxis.subVectors(tr.position, br.position);
            size.set(xaxis.length(), yaxis.length(), 1);

            xaxis.normalize();
            yaxis.normalize();
            yaxis.copy(tempYaxis.copy(yaxis).sub(tempXaxis.copy(xaxis).multiplyScalar(xaxis.dot(yaxis))));
            normal.crossVectors(xaxis, yaxis).normalize();
            mat.makeBasis(xaxis, yaxis, normal);

            rotation.setFromRotationMatrix(mat);

            return PlaneTrack.FUNC_getBounds;
        } else if (tr && br && bl) {
            center.addVectors(tr.position, bl.position);
            center.divideScalar(2);

            xaxis.subVectors(br.position, bl.position);
            yaxis.subVectors(tr.position, br.position);
            size.set(xaxis.length(), yaxis.length(), 1);

            xaxis.normalize();
            yaxis.normalize();
            yaxis.copy(tempYaxis.copy(yaxis).sub(tempXaxis.copy(xaxis).multiplyScalar(xaxis.dot(yaxis))));
            normal.crossVectors(xaxis, yaxis).normalize();
            mat.makeBasis(xaxis, yaxis, normal);

            rotation.setFromRotationMatrix(mat);

            return PlaneTrack.FUNC_getBounds;
        } else if (br && bl && tl) {
            center.addVectors(tl.position, br.position);
            center.divideScalar(2);

            xaxis.subVectors(br.position, bl.position);
            yaxis.subVectors(tl.position, bl.position);
            size.set(xaxis.length(), yaxis.length(), 1);

            xaxis.normalize();
            yaxis.normalize();
            yaxis.copy(tempYaxis.copy(yaxis).sub(tempXaxis.copy(xaxis).multiplyScalar(xaxis.dot(yaxis))));
            normal.crossVectors(xaxis, yaxis).normalize();
            mat.makeBasis(xaxis, yaxis, normal);

            rotation.setFromRotationMatrix(mat);

            return PlaneTrack.FUNC_getBounds;
        } else if (tr && tl && bl) {
            center.addVectors(tr.position, bl.position);
            center.divideScalar(2);

            xaxis.subVectors(tr.position, tl.position);
            yaxis.subVectors(tl.position, bl.position);
            size.set(xaxis.length(), yaxis.length(), 1);

            xaxis.normalize();
            yaxis.normalize();
            yaxis.copy(tempYaxis.copy(yaxis).sub(tempXaxis.copy(xaxis).multiplyScalar(xaxis.dot(yaxis))));
            normal.crossVectors(xaxis, yaxis).normalize();
            mat.makeBasis(xaxis, yaxis, normal);

            rotation.setFromRotationMatrix(mat);

            return PlaneTrack.FUNC_getBounds;
        } else return undefined;
    }

    private smooth = {
        center: new Vector3(0, 0, 0),
        rotation: new Quaternion(0, 0, 0, 1),
        size: new Vector3(0, 0, 0),
        temp2: new Vector2(),
        temp3: new Vector3(),
        visible: 0,
    };
    public getBoundsSmooth(dt: number): Bounds | undefined {
        const bounds = this.getBounds();
        const { center, rotation, size, temp2, temp3 } = this.smooth;   
        if (bounds === undefined) {
            if (this.smooth.visible > 0) {
                this.smooth.visible = Math.max(0, this.smooth.visible - dt);
                return this.smooth;
            } else return undefined;
        }

        this.smooth.visible = Math.min(0.1, this.smooth.visible + dt);

        if (temp2.subVectors(size, bounds.size).lengthSq() > 4) {
            size.copy(bounds.size);
        } else {
            size.lerp(bounds.size, 5 * dt);
        }
        if (temp3.subVectors(center, bounds.center).lengthSq() > 4) {
            center.copy(bounds.center);
        } else {
            center.lerp(bounds.center, 10 * dt);
        }

        rotation.slerp(bounds.rotation, 2.5 * dt);

        return this.smooth;
    }
}

export class AR {
    readonly scene: Scene;
    readonly renderer: WebGLRenderer; 
    readonly camera: PerspectiveCamera;
    readonly clock: Clock;
    readonly dt: number;

    private readonly arToolkitSource: any;
    public readonly arToolkitContext: any;

    render?: (dt: number) => void;

    constructor(width: number, height: number, sourceWidth?: number, sourceHeight?: number) {
        this.scene = new Scene();
        this.renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.top = "0px";
        this.renderer.domElement.style.left = "0px";
        document.body.appendChild(this.renderer.domElement);

        this.camera = new PerspectiveCamera();
        this.scene.add(this.camera);

        this.arToolkitSource = new THREEx.ArToolkitSource({
            sourceType : "webcam",
            sourceWidth : sourceWidth ? sourceWidth : width,
            sourceHeight: sourceHeight ? sourceHeight : height,
            displayWidth : width,
            displayHeight: height,
        });
        this.arToolkitSource.init(() => this.resize());
        window.addEventListener("resize", () => this.resize());

        this.arToolkitContext = new THREEx.ArToolkitContext({
            cameraParametersUrl: "data/camera_para.dat",
            detectionMode: "mono",
        });
        
        this.arToolkitContext.init(() => {
            this.camera.projectionMatrix.copy(this.arToolkitContext.getProjectionMatrix());

            // use a resize to fullscreen mobile devices
            setTimeout(() => {
                this.resize();
            }, 2000);
        });

        this.clock = new Clock();
        this.renderer.setAnimationLoop(() => {
            (this as any).dt = this.clock.getDelta();
            if (this.arToolkitSource.ready !== false) {
                this.arToolkitContext.update(this.arToolkitSource.domElement);
            }

            if (this.render !== undefined) this.render(this.dt);

            this.renderer.render(this.scene, this.camera);
        });
    }

    private resize() {
        this.arToolkitSource.onResizeElement();
        this.arToolkitSource.copyElementSizeTo(this.renderer.domElement);
        if (this.arToolkitContext.arController !== null) {
            this.arToolkitSource.copyElementSizeTo(this.arToolkitContext.arController.canvas);
        }
    }
}