import { AmbientLight, BoxGeometry, Color, DoubleSide, Group, Mesh, MeshNormalMaterial, PerspectiveCamera, Scene, WebGLRenderer } from "three";
import { ready } from "./three.api.js";

console.log(ready);

let scene: Scene;
let camera: PerspectiveCamera;
let renderer: WebGLRenderer;

let arToolkitSource: any;
let arToolkitContext: any;

const w = 924;
const h = 693;

initialize();
animate();

function initialize() {
    scene = new Scene();

    const ambientLight = new AmbientLight(0xcccccc, 0.5);
    scene.add(ambientLight);
				
    camera = new PerspectiveCamera();
    scene.add(camera);

    renderer = new WebGLRenderer({
        antialias : true,
        alpha: true
    });
    renderer.setClearColor(new Color('lightgrey'), 0);
    renderer.setSize( w, h );
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0px';
    renderer.domElement.style.left = '0px';
    document.body.appendChild( renderer.domElement );
	
    ////////////////////////////////////////////////////////////
    // setup arToolkitSource
    ////////////////////////////////////////////////////////////

    arToolkitSource = new THREEx.ArToolkitSource({
        sourceType : 'webcam',
        sourceWidth : w * 2,
        sourceHeight: h * 2,
        displayWidth : w,
        displayHeight: h,
    });

    function onResize() {
        arToolkitSource.onResize();	
        arToolkitSource.copySizeTo(renderer.domElement);	
        if ( arToolkitContext.arController !== null ) {
            arToolkitSource.copySizeTo(arToolkitContext.arController.canvas);	
        }	
    }

    arToolkitSource.init(function onReady(){
        onResize();
    });
	
    // handle resize event
    window.addEventListener('resize', function(){
        onResize();
    });
	
    ////////////////////////////////////////////////////////////
    // setup arToolkitContext
    ////////////////////////////////////////////////////////////	

    // create atToolkitContext
    arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono'
    });
	
    // copy projection matrix to camera when initialization complete
    arToolkitContext.init( function onCompleted(){
        camera.projectionMatrix.copy( arToolkitContext.getProjectionMatrix() );
    });

    ////////////////////////////////////////////////////////////
    // setup markerRoots
    ////////////////////////////////////////////////////////////

    // build markerControls
    const markers = [
        "data/letterA.patt",
        "data/letterB.patt",
        "data/letterC.patt",
        "data/letterD.patt"
    ];

    for (const marker of markers) {
        const markerRoot = new Group();
        scene.add(markerRoot);

        new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
            type: "pattern", patternUrl: marker
        });

        const geometry1	= new BoxGeometry(1,1,1);
        const material1	= new MeshNormalMaterial({
            transparent: true,
            opacity: 0.5,
            side: DoubleSide
        }); 
        
        const mesh = new Mesh(geometry1, material1);
        mesh.position.y = 0.5;
        
        markerRoot.add(mesh);
    }
}


function update() {
    // update artoolkit on every frame
    if (arToolkitSource.ready !== false)
        arToolkitContext.update( arToolkitSource.domElement );
}


function render() {
    renderer.render(scene, camera);
}


function animate() {
    requestAnimationFrame(animate);
    update();
    render();
}