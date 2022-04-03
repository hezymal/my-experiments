import React, { useState } from "react";

export const App = () => {
    const [counter, setCounter] = useState(0);

    const handleButtonClick = () => {
        setCounter((c) => c + 1);
    };

    return <button onClick={handleButtonClick}>Counter: {counter}</button>;
};
