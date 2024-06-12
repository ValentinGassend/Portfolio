import * as THREE from "three";

class EffectShell {
    constructor(container = document.body, itemsWrapper = null) {
        this.container = container;
        this.itemsWrapper = itemsWrapper;
        this.mouse = {x: 0, y: 0};
        if (!this.container || !this.itemsWrapper) return;
        this.setup();
        this.initEffectShell().then(() => {
            console.log('load finished');
            this.isLoaded = true;
        });
        this.createEventsListeners();
    }

    setup() {
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);

        this.renderer.domElement.style.position = 'fixed';
        this.renderer.domElement.style.top = '50%';
        this.renderer.domElement.style.bottom = '50%';
        this.renderer.domElement.style.pointerEvents = 'none';
        this.renderer.domElement.style.transform = 'translateY(-50%)';
        this.renderer.domElement.style.transformOrigin = 'center';

        this.renderer.domElement.style.zIndex = 110;
        document.body.appendChild(this.renderer.domElement);

        // scene
        this.scene = new THREE.Scene();

        // camera
        this.camera = new THREE.PerspectiveCamera(
            40,
            this.viewport.aspectRatio,
            0.1,
            100
        );
        this.camera.position.set(0, 0, 3);

        // animation loop
        this.renderer.setAnimationLoop(this.render.bind(this));
    }

    render() {
        // called every frame
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
                    // Mettez à jour l'élément HTML avec la texture chargée
                    this.items[index].img.src = textureData.texture.image.src;
                });
                resolve();
            });
        });
    }


    loadTexture(loader, url, index) {
        return new Promise((resolve, reject) => {
            if (!url) {
                resolve({texture: null, index});
                return;
            }

            loader.load(
                url,
                (texture) => {
                    resolve({texture, index});
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
        return {width, height, vFov};
    }
}

export default EffectShell;