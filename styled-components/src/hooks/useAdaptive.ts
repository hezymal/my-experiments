import { useState } from "react";
import { screen } from "../styles/constants";

const useAdaptive = () => {
    const [isMobile, setIsMobile] = useState(
        window.innerWidth < screen.desktop
    );

    window.addEventListener("resize", () => {
        if (!isMobile && window.innerWidth < screen.desktop) {
            setIsMobile(true);
        }

        if (isMobile && window.innerWidth >= screen.desktop) {
            setIsMobile(false);
        }
    });

    return { isMobile };
};

export default useAdaptive;
