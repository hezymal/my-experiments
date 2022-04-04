export const color = {
    grey1: "#0a0c0e",
    grey2: "#555a5e",
    grey3: "#8d9193",
    grey4: "#e9ebeb",
    milk1: "#f9f8f4",
    blue1: "rgb(87, 76, 250)",
};

export const border = {
    variant1: "2px solid rgb(223, 222, 209)",
    variant2: `3px solid ${color.blue1}`,
    variant3: "2px solid rgb(132, 132, 132)",
    variant4: `2px solid ${color.blue1}`,
    radius: {
        variant1: "15px",
    },
};

export const shadow = {
    variant1: "0 0 30px rgba(0, 0, 0, 0.15)",
};

export const screen = {
    mobile: 560,
    desktop: 960,
};

export const mediaQuery = {
    mobile: `@media (max-width: ${screen.desktop - 1}px)`,
    desktop: `@media (min-width: ${screen.desktop}px)`,
};
