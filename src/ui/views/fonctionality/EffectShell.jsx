import * as THREE from "three";

class EffectShell {
    constructor(container = document.body, itemsWrapper = null, sharedData = null) {
        this.container = container;
        this.itemsWrapper = itemsWrapper;
        this.sharedData = sharedData;
        this.mouse = {x: 0, y: 0};

        if (!this.container || !this.itemsWrapper) return;

        this.setup();
        this.initEffectShell().then(() => {
            this.isLoaded = true;
        });
        this.createEventsListeners();
    }

    setup() {
        if (!this.sharedData) {
            this.sharedData = {
                renderer: new THREE.WebGLRenderer({ antialias: true, alpha: true }),
                scene: new THREE.Scene(),
                camera: new THREE.PerspectiveCamera(40, 16/9, 0.1, 100),
            };
            this.sharedData.renderer.setSize(window.innerWidth, window.innerHeight);
            this.sharedData.renderer.setPixelRatio(window.devicePixelRatio);
            this.sharedData.renderer.domElement.classList.add('webgl-canvas');
            document.body.appendChild(this.sharedData.renderer.domElement);
            this.sharedData.camera.position.set(0, 0, 3);
            this.sharedData.renderer.setAnimationLoop(this.render.bind(this));
        } else {
            this.renderer = this.sharedData.renderer;
            this.scene = this.sharedData.scene;
            this.camera = this.sharedData.camera;
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    get viewport() {
        let width = this.container.offsetWidth;
        let height = this.container.parentElement.offsetHeight;
        let aspectRatio = width / height;
        return {
            width,
            height,
            aspectRatio,
        };
    }

    onWindowResize() {
        this.camera.aspect = this.viewport.aspectRatio;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.viewport.width, this.viewport.height);
    }

    get itemsElements() {
        const items = [...this.itemsWrapper.querySelectorAll('.ProjectListItem')];
        return items.map((item, index) => ({
            element: item,
            img: item.querySelector('img') || null,
            index: index,
        }));
    }

    initEffectShell() {
        let promises = [];
        this.items = this.itemsElements;
        const THREEtextureLoader = new THREE.TextureLoader();
        this.items.forEach((item, index) => {
            promises.push(
                this.loadTexture(
                    THREEtextureLoader,
                    item.img ? item.img.src : null,
                    index
                )
            );
        });
        return new Promise((resolve, reject) => {
            Promise.all(promises).then((textures) => {
                textures.forEach((textureData, index) => {
                    this.items[index].texture = textureData.texture;
                    this.items[index].img.src = textureData.texture.image.src;
                });
                resolve();
            });
        });
    }

    loadTexture(loader, url, index) {
        return new Promise((resolve, reject) => {
            if (!url) {
                resolve({ texture: null, index });
                return;
            }
            loader.load(
                url,
                (texture) => {
                    resolve({ texture, index });
                },
                undefined,
                (error) => {
                    console.error('An error happened.', error);
                    reject(error);
                }
            );
        });
    }

    createEventsListeners() {
        this.items.forEach((item, index) => {
            item.element.addEventListener(
                'mouseover',
                this._onMouseOver.bind(this, index),
                false
            );
        });

        this.container.addEventListener(
            'mousemove',
            this._onMouseMove.bind(this),
            false
        );
        this.itemsWrapper.addEventListener(
            'mouseleave',
            this._onMouseLeave.bind(this),
            false
        );
    }

    _onMouseLeave(event) {
        this.isMouseOver = false;
        this.onMouseLeave(event);
    }

    _onMouseMove(event) {
        this.mouse.x = (event.x / this.viewport.width) * 2 - 1;
        this.mouse.y = -(event.y / this.viewport.height) * 2 + 1;
        this.onMouseMove(event);
    }

    _onMouseOver(index, event) {
        this.onMouseOver(index, event);
    }

    get viewSize() {
        let distance = this.camera.position.z;
        let vFov = (this.camera.fov * Math.PI) / 180;
        let height = 2 * Math.tan(vFov / 2) * distance;
        let width = height * this.viewport.aspectRatio;
        return { width, height, vFov };
    }
}

export default EffectShell;
