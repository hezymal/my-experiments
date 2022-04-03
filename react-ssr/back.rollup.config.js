import fs from "fs";
import babel from "@rollup/plugin-babel";
import html from "@rollup/plugin-html";

const template = () => {
    return fs.readFileSync("./src/front-template.html");
}

export default {
    input: "src/index.mjs",
    output: {
        file: "dist/index.mjs",
        sourcemap: true,
    },
    plugins: [
        babel({
            presets: ["@babel/preset-react"],
        }),
        html({
            fileName: "front-template.html",
            template,
            title: "ReactJS Server Side Rendering (SSR)",
        }),
    ],
};
