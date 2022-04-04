import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { border, color } from "../styles/constants";

interface IProps {
    type: 'submit' | 'reset';
    icon?: 'check';
    theme?: "default" | "primary";
    compact?: boolean;
}

const Block = styled.button<IProps>`
    cursor: pointer;
    border-radius: 10px;
    white-space: nowrap;

    ${({ theme }) => theme === "primary" ? `
        border: ${border.variant4};
        background-color: ${color.blue1};
        color: white;
    ` : `
        border: ${border.variant3};
        background-color: white;
        color: ${color.grey2};
    `}

    ${({ compact }) => compact ? `
        width: 250px;
        height: 66px;
        line-height: 64px;
        font-size: 1.4em;
    ` : `
        width: 372px;
        height: 74px;
        line-height: 72px;
        font-size: 1.6em;
    `}
`;

const Icon = styled.span`
    margin-right: 10px;
`;

const Button: React.FC<IProps> = ({ theme = "default", icon, children, ...tail }) => {
    return (
        <Block theme={theme} {...tail}>
            {icon && <Icon><FontAwesomeIcon icon={icon} /></Icon>}
            {children}
        </Block>
    );
};

export default Button;
