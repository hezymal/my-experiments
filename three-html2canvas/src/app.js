import html2canvas from "html2canvas";
import {
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Color,
    Texture,
    WebGLRenderer,
    Scene,
    AmbientLight,
    PerspectiveCamera,
} from "three";

const LANG_EN = "en";

const CAMERA_POSITION_Z = 1;

const PLANE_POSITION_Z = 0;
const PLANE_PUSH_BACK_POSITION_Z = PLANE_POSITION_Z - 0.5;
const PLANE_MOVE_SPEED = 0.02;
const PLANE_ROTATION_SPEED = 0.04;

const ANIMATION_STAGE_NONE = null;
const ANIMATION_STAGE_PUSH_BACK = "push-back";
const ANIMATION_STAGE_TURN_HALFWAY = "turn-halfway";
const ANIMATION_STAGE_LOAD_NEXT_LANG = "load-next-lang";
const ANIMATION_STAGE_LOADING_NEXT_LANG = "loading-next-lang";
const ANIMATION_STAGE_TURN_TO_END = "turn-to-end";
const ANIMATION_STAGE_PUSH_FRONT = "push-front";

const INACTIVE_FORM_INDEX = 1;
const CANVAS_INDEX = INACTIVE_FORM_INDEX + 1;
const ACTIVE_FORM_INDEX = CANVAS_INDEX + 1;

const COLOR_WHITE = new Color(0xffffff);

const setImageSource = (image, src) => {
    return new Promise((resolve) => {
        image.onload = () => {
            resolve();
        };
        image.src = src;
    });
};

class App {
    constructor() {
        this.initialize = this.initialize.bind(this);
        this.initializeForms = this.initializeForms.bind(this);
        this.initializePlane = this.initializePlane.bind(this);
        this.update = this.update.bind(this);
        this.updateAnimation = this.updateAnimation.bind(this);
        this.changeLang = this.changeLang.bind(this);
        this.loadNextLang = this.loadNextLang.bind(this);
        this.run = this.run.bind(this);
        this.render = this.render.bind(this);
        this.frameRequest = this.frameRequest.bind(this);
    }

    async initialize() {
        this.renderer = new WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.domElement.style.zIndex = CANVAS_INDEX;
        document.body.appendChild(this.renderer.domElement);

        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new PerspectiveCamera(15, aspect, 0.1, 1000);
        this.camera.position.z = CAMERA_POSITION_Z;

        this.scene = new Scene();
        this.scene.background = COLOR_WHITE;
        this.scene.add(new AmbientLight(COLOR_WHITE));

        this.currentLang = LANG_EN;
        this.nextLang = null;
        this.animationStage = ANIMATION_STAGE_NONE;

        this.initializeForms();
        await this.initializePlane();
    }

    initializeForms() {
        this.forms = {};

        const forms = document.querySelectorAll("form");
        for (const form of forms) {
            const formLang = form.getAttribute("data-lang");
            if (formLang === this.currentLang) {
                form.style.zIndex = ACTIVE_FORM_INDEX;
            } else {
                form.style.zIndex = INACTIVE_FORM_INDEX;
            }

            const buttons = form.querySelectorAll("button");
            for (const button of buttons) {
                button.onclick = () => {
                    const buttonLang = button.getAttribute("data-lang");
                    this.changeLang(buttonLang);
                };
            }

            this.forms[formLang] = form;
        }
    }

    async initializePlane() {
        const form = this.forms[this.currentLang];
        const screenshot = await html2canvas(form);

        this.image = document.createElement("img");
        this.texture = new Texture(this.image);
        await setImageSource(this.image, screenshot.toDataURL());
        this.texture.needsUpdate = true;

        const imageRatio = this.image.width / this.image.height;
        const ratioImageAndWindow = this.image.height / window.innerHeight;
        const cameraFovInRadians = ((this.camera.fov / 2) * Math.PI) / 180;
        const distanceBetweenCameraAndPlane = Math.abs(
            CAMERA_POSITION_Z - PLANE_POSITION_Z
        );
        const planeSize =
            Math.tan(cameraFovInRadians) * distanceBetweenCameraAndPlane * 2;

        const geometry = new PlaneGeometry(imageRatio, 1);
        const material = new MeshBasicMaterial({ map: this.texture });
        this.plane = new Mesh(geometry, material);
        this.plane.scale.x = planeSize * ratioImageAndWindow;
        this.plane.scale.y = planeSize * ratioImageAndWindow;
        this.plane.position.z = PLANE_POSITION_Z;
        this.scene.add(this.plane);
    }

    update() {
        if (this.animationStage) {
            this.updateAnimation();
        }
    }

    updateAnimation() {
        if (this.animationStage === ANIMATION_STAGE_PUSH_BACK) {
            if (this.plane.position.z > PLANE_PUSH_BACK_POSITION_Z) {
                this.plane.position.z -= PLANE_MOVE_SPEED;
                this.forms[this.currentLang].style.zIndex = INACTIVE_FORM_INDEX;
            } else {
                this.plane.position.z = PLANE_PUSH_BACK_POSITION_Z;
                this.animationStage = ANIMATION_STAGE_TURN_HALFWAY;
            }

            return;
        }

        if (this.animationStage === ANIMATION_STAGE_TURN_HALFWAY) {
            if (this.plane.rotation.y < Math.PI / 2) {
                this.plane.rotation.y += PLANE_ROTATION_SPEED;
            } else {
                this.plane.rotation.y = Math.PI + Math.PI / 2;
                this.animationStage = ANIMATION_STAGE_LOAD_NEXT_LANG;
            }

            return;
        }

        if (this.animationStage === ANIMATION_STAGE_LOAD_NEXT_LANG) {
            this.animationStage = ANIMATION_STAGE_LOADING_NEXT_LANG;
            this.loadNextLang().then(() => {
                this.animationStage = ANIMATION_STAGE_TURN_TO_END;
            });

            return;
        }

        if (this.animationStage === ANIMATION_STAGE_TURN_TO_END) {
            if (this.plane.rotation.y < Math.PI * 2) {
                this.plane.rotation.y += PLANE_ROTATION_SPEED;
            } else {
                this.plane.rotation.y = 0;
                this.animationStage = ANIMATION_STAGE_PUSH_FRONT;
            }

            return;
        }

        if (this.animationStage === ANIMATION_STAGE_PUSH_FRONT) {
            if (this.plane.position.z < PLANE_POSITION_Z) {
                this.plane.position.z += PLANE_MOVE_SPEED;
            } else {
                this.animationStage = ANIMATION_STAGE_NONE;
                this.plane.position.z = PLANE_POSITION_Z;
                this.forms[this.nextLang].style.zIndex = ACTIVE_FORM_INDEX;
                this.currentLang = this.nextLang;
                this.nextLang = null;
            }

            return;
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    frameRequest() {
        this.update();
        this.render();
        requestAnimationFrame(this.frameRequest);
    }

    async run() {
        await this.initialize();
        requestAnimationFrame(this.frameRequest);
    }

    changeLang(lang) {
        if (this.currentLang === lang) {
            return;
        }

        this.animationStage = ANIMATION_STAGE_PUSH_BACK;
        this.nextLang = lang;
    }

    async loadNextLang() {
        const form = this.forms[this.nextLang];
        const canvas = await html2canvas(form);
        await setImageSource(this.image, canvas.toDataURL());
        this.texture.needsUpdate = true;
    }
}

const app = new App();
app.run();
