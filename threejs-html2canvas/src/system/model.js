import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export const loadModel = (url) => {
    const loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
        loader.load(
            url.toString(),
            (gltf) => {
                resolve(gltf.scene);
            },
            undefined,
            reject
        );
    });
};
