import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import styled from "styled-components";
import { color } from "../styles/constants";

interface IProps {
    theme?: 'default' | 'blue';
}

const Container = styled.div<IProps>`
    width: 24px;
    height: 24px;
    line-height: 20px;
    text-align: center;
    border: 2px solid ${({ theme }) => theme === 'blue' ? color.blue1 : color.grey1};
    border-radius: 50%;
    color: ${({ theme }) => theme === 'blue' ? color.blue1 : color.grey1};
    font-size: 0.8em;
`;

const InfoIcon: React.FC<IProps> = ({ theme = 'default' }) => {
    return (
        <Container theme={theme}>
            <FontAwesomeIcon icon="info" />
        </Container>
    );
};

export default InfoIcon;
