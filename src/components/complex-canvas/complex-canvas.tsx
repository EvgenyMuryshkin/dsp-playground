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
    showWaves: boolean;
}

export class ComplexCanvas extends Component<IProps> {
    scene: THREE.Scene | null = null;
    camera: THREE.PerspectiveCamera | null = null;
    renderer: THREE.WebGLRenderer | null = null;
    orbitControls: OrbitControls | null = null;

    // The X axis is red (real value)
    // The Y axis is green (imag value)
    // The Z axis is blue (time value)
    axesHelper = new THREE.AxesHelper(2);
    geometries: BufferGeometry[] = [];

    container: HTMLDivElement | null = null;

    public constructor(props: IProps) {
        super(props);
        this.init();
    }

    init() {
        this.scene = new THREE.Scene();

        const aspectRation = 1024 / 600; // window.innerWidth / window.innerHeight
        this.camera = new THREE.PerspectiveCamera(75, aspectRation, 1, 10000);

        this.camera.translateY(20);
        this.camera.lookAt(0, 0, 0);
        this.camera.translateX(-Math.PI / 2);

        this.renderer = new THREE.WebGLRenderer();
        //this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);

        this.createSignal();

        this.requestAnimation();
    }

    componentDidUpdate() {
        this.createSignal();
    }

    createSignal() {
        const { scene, camera } = this;
        if (!scene || !camera) return;

        const { signal, samplingRate, duration, stretch, showWaves } = this.props;
        if (!signal) return;

        scene.clear();

        this.geometries.forEach(g => g.dispose());
        this.geometries = [];

        scene.add(this.axesHelper);

        const signalPoints = [];
        const dt = 1 / samplingRate;

        for (const t of Generate.range(0, duration * samplingRate)) {
            const value = Sampling.signalValue(signal, dt * t);
            const nextValue = Sampling.signalValue(signal, dt * (t + 1));
            signalPoints.push(...[
                value.r, value.i, dt * t * stretch,
                nextValue.r, nextValue.i, dt * (t + 1) * stretch
            ])
        }

        const _lineGeometry = new BufferGeometry();
        _lineGeometry.setAttribute('position', new Float32BufferAttribute(signalPoints, 3));

        const line = new Line(
            _lineGeometry,
            new LineBasicMaterial({
                color: 0xff0000,
                toneMapped: false
            }));

        scene.add(line);

        if (showWaves) {
            signal.Waves.forEach(wave => {
                const wavePoints = [];
                for (const t of Generate.range(0, duration * samplingRate)) {
                    const value = Sampling.waveValue(wave, dt * t);
                    const nextValue = Sampling.waveValue(wave, dt * (t + 1));
                    wavePoints.push(...[
                        value.r, value.i, dt * t * stretch,
                        nextValue.r, nextValue.i, dt * (t + 1) * stretch
                    ])
                }

                const waveGeometry = new BufferGeometry();
                waveGeometry.setAttribute('position', new Float32BufferAttribute(wavePoints, 3));

                const waveLine = new Line(
                    waveGeometry,
                    new LineBasicMaterial({
                        color: 0x00ff00,
                        toneMapped: false
                    }));

                scene.add(waveLine);
                this.geometries.push(waveGeometry);
            });
        }

        this.geometries.push(_lineGeometry);
    }

    fps = 0;
    rendersDate = new Date();

    requestAnimation() {
        requestAnimationFrame(this.animate.bind(this));
    }

    animate() {
        const { container, renderer, scene, camera, orbitControls } = this;

        this.requestAnimation();

        if (!container) return;

        orbitControls?.update();

        if (renderer && scene && camera) {

            renderer.render(scene, camera);
            this.fps++;

            const now = new Date();
            if ((now.getTime() - this.rendersDate.getTime()) > 1000) {
                this.rendersDate = now;
                //console.log(`FPS: `, this.fps);
                this.fps = 0;
            }
        }
    }

    onContainerCreated(d: HTMLDivElement | null) {
        this.container = d;

        if (d && this.renderer?.domElement) {
            this.renderer.setSize(d.offsetWidth, d.offsetHeight);
            this.container?.appendChild?.(this.renderer.domElement);
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