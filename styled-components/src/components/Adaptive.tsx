import React from "react";
import useAdaptive from "../hooks/useAdaptive";

interface IProps {
    desktop: () => JSX.Element;
    mobile: () => JSX.Element;
}

const Adaptive: React.FC<IProps> = ({ desktop, mobile }) => {
    const { isMobile } = useAdaptive();

    if (!isMobile) {
        return desktop();
    } else {
        return mobile();
    }
};

export default Adaptive;
