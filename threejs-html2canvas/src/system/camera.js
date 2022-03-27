import { PerspectiveCamera } from "three";

export const createCamera = (screen) => {
    const aspect = screen.width / screen.height;
    const camera = new PerspectiveCamera(15, aspect, 0.1, 1000);
    return camera;
};
