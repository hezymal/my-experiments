import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import replace from "@rollup/plugin-replace";

export default {
    input: "src/front/index.js",
    output: {
        file: "dist/front/index.js",
        format: "iife",
        sourcemap: true,
    },
    plugins: [
        babel({
            presets: ["@babel/preset-react"],
        }),
        commonjs(),
        nodeResolve(),
        replace(
            {
                "process.env.NODE_ENV": JSON.stringify("development"),
            },
            { preventAssignment: true }
        ),
    ],
};
