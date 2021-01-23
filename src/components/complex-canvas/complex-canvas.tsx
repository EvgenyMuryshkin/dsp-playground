import { Component } from "react";
import * as THREE from 'three';
import { BufferGeometry, Float32BufferAttribute, Line, LineBasicMaterial } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Generate, Sampling, Signal } from "../../lib";
import "./complex-canvas.scss"

// https://dustinpfister.github.io/2018/04/13/threejs-orbit-controls/
// https://stackoverflow.com/questions/2368784/draw-on-html5-canvas-using-a-mouse
// https://threejs.org/docs/#examples/en/controls/OrbitControls

export interface IProps {
    signal: Signal;
    samplingRate: number;
    duration: number;
    stretch: number;
}

export class ComplexCanvas extends Component<IProps> {
    scene: THREE.Scene | null = null;
    camera: THREE.PerspectiveCamera | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    orbitControls: OrbitControls | null = null;

    container: HTMLDivElement | null = null;

    public constructor(props: IProps) {
        super(props);
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.camera.position.z = 10;

        this.renderer = new THREE.WebGLRenderer();
        //this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        this.createSignal();
    }
    /*
        componentDidMount()
        {
            if (this.renderer?.domElement) {
                ReactDOM.findDOMNode(this)?.appendChild?.(this.renderer.domElement);
                requestAnimationFrame( this.animate.bind(this) );
            }
        }
    */
    componentDidUpdate() {
        this.createSignal();
    }

    createSignal() {
        const { scene, camera } = this;
        if (!scene || !camera) return;

        const { signal, samplingRate, duration, stretch } = this.props;
        if (!signal) return;

        scene.clear();

        // The X axis is red. The Y axis is green. The Z axis is blue.
        var axesHelper = new THREE.AxesHelper(2);
        scene.add(axesHelper);

        const position = [];
        const dt = 1 / samplingRate;
        let cameraPosition = 1;
        for (const t of Generate.range(0, duration * samplingRate)) {
            const value = Sampling.signalValue(signal, dt * t);
            const nextValue = Sampling.signalValue(signal, dt * (t + 1));
            position.push(...[
                value.r, value.i, dt * t * stretch,
                nextValue.r, nextValue.i, dt * (t + 1) * stretch
            ])

            cameraPosition = Math.max(cameraPosition, value.r, value.i, nextValue.r, nextValue.i);
        }
        const _lineGeometry = new BufferGeometry();
        _lineGeometry.setAttribute('position', new Float32BufferAttribute(position, 3));

        const line = new Line(
            _lineGeometry,
            new LineBasicMaterial({
                color: 0xff0000,
                toneMapped: false
            }));

        scene.add(line);

        // fit signal in camera
        //camera.position.z = cameraPosition;
    }

    fps = 0;
    rendersDate = new Date();

    animate() {
        const { renderer, scene, camera, orbitControls } = this;

        orbitControls?.update();
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
            this.fps++;

            if (new Date().getTime() - this.rendersDate.getTime() > 1000) {
                this.rendersDate = new Date();
                console.log(`FPS: `, this.fps);
                this.fps = 0;
            }
        }

        requestAnimationFrame(this.animate.bind(this));
    }

    onContainerCreated(d: HTMLDivElement | null) {
        this.container = d;
        if (d && this.renderer?.domElement) {
            this.renderer.setSize(d.offsetWidth, d.offsetHeight);
            this.container?.appendChild?.(this.renderer.domElement);
            requestAnimationFrame(this.animate.bind(this));
        }

        window.addEventListener("resize", () => {
            const { renderer, camera, container } = this;

            if (renderer && container && camera) {
                const newWidth = container.offsetWidth;
                const newHeight = container.offsetHeight;
                camera.aspect = newWidth / newHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(newWidth, newHeight);
            }
        });
    }

    public render() {
        return (
            <div className="complex-canvas" ref={(d) => this.onContainerCreated(d)} />
        )
    }
}