import * as THREE from 'three';

class SharedEffectManager {
    constructor() {
        if (SharedEffectManager.instance) {
            return SharedEffectManager.instance;
        }

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.domElement.classList.add('webgl-canvas');

        document.body.appendChild(this.renderer.domElement);

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(0, 0, 3);

        this.animationFrameId = null;

        this.startAnimationLoop();

        SharedEffectManager.instance = this;
    }

    startAnimationLoop() {
        const animate = () => {
            this.renderer.render(this.scene, this.camera);
            this.animationFrameId = requestAnimationFrame(animate);
        };
        animate();
    }

    stopAnimationLoop() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    resize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

const sharedEffectManager = new SharedEffectManager();

export default sharedEffectManager;
