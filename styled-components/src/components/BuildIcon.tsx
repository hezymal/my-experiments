import React from "react";
import { color } from "../styles/constants";

interface IProps {
    className?: string;
    theme?: "default" | "blue";
}

const BuildIcon: React.FC<IProps> = ({ className, theme = "default" }) => {
    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 70 640 470"
            width="1em"
            height="0.7em"
            stroke={theme === "blue" ? color.grey1 : color.grey3}
        >
            <g strokeWidth="9px">
                <path
                    d="M174.56 79.72L455.71 79.72L636.06 313.5L349.62 313.5L174.56 79.72Z"
                    opacity="1"
                    fill={theme === "blue" ? color.blue1 : color.grey3}
                    fillOpacity="1"
                    stroke={theme === "blue" ? color.blue1 : color.grey3}
                    strokeOpacity="1"
                />
                <path
                    d="M174.56 79.72L38.73 247"
                    opacity="1"
                    fillOpacity="0"
                    stroke={theme === "blue" ? color.blue1 : color.grey3}
                    strokeOpacity="1"
                />
                <path
                    d="M3.06 538.46L52.93 538.46L52.93 273.21L174.56 125.79"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M217.47 255.83L217.47 332.12L164.5 332.12L164.5 255.83L217.47 255.83Z"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M84.71 513.99L150.16 513.99L150.16 387.17L84.71 387.17L84.71 513.99Z"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M52.93 513.99L84.71 513.99"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M326.63 387.17L326.63 487.6L184.44 487.6L184.44 387.17L326.63 387.17Z"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M630.11 538.46L617.65 538.46L52.93 538.46"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M616.4 332.12L616.4 538.46"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
                <path
                    d="M351.5 332.12L351.5 538.46"
                    opacity="1"
                    fillOpacity="0"
                    strokeOpacity="1"
                />
            </g>
        </svg>
    );
};

export default BuildIcon;
