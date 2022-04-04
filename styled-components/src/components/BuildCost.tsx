import React from "react";
import styled from "styled-components";
import InfoIcon from "../components/InfoIcon";
import { color } from "../styles/constants";

interface IProps {
    compact?: boolean;
}

const Block = styled.div<IProps>`
    display: flex;

    ${({ compact }) => compact ? `
        flex-direction: column;
    ` : `
        justify-content: space-between;
    `}
`;

const Cost = styled.div<IProps>`
    display: flex;

    ${({ compact }) => compact ? `
        padding: 17px 0;
    ` : `
    `}
`;

const CostIcon = styled.div<IProps>`
    ${({ compact }) => compact ? `
        display: flex;
        align-items: flex-end;
    ` : `
    `}
`;

const CostContent = styled.div<IProps>`
    ${({ compact }) => compact ? `
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        width: calc(100% - 38px);
        margin-left: 14px;
    ` : `
        margin-left: 10px;
    `}
`;

const CostTitle = styled.div<IProps>`
    color: ${color.grey2};

    ${({ compact }) => compact ? `
        font-weight: 600;
        font-size: 1.2em;
    ` : `
        font-size: 1.3em;
    `}
`;

const CostValue = styled.div<IProps>`
    display: flex;
    position: relative;
    align-items: flex-end;

    ${({ compact }) => compact ? `
        width: 220px;
        justify-content: flex-end;
        padding: 0 20px 0 0;
    ` : `
        padding: 20px 0 0 15px;
    `}
`;

const CostCurrency = styled.span<IProps>`
    font-weight: 700;
    display: inline-block;
    align-self: flex-start;

    ${({ compact }) => compact ? `
        font-size: 1.5em;
    ` : `
        font-size: 1.2em;
    `}
`;

const CostNumber = styled.span`
    font-size: 2.4em;
    line-height: 38px;
`;

const CostPrefix = styled.span`
    font-size: 1.3em;
    margin-left: 5px;
`;

const CostOperation = styled.span<IProps>`
    position: absolute;
    bottom: -5px;
    color: ${color.grey2};
    font-size: 2.5em;
    font-weight: 700;

    ${({ compact }) => compact ? `
        left: -30px;
    ` : `
        left: -60px;
    `}
`;

const TotalCost = styled(Cost)`
    position: relative;

    ${({ compact }) => compact ? `
        &::after {
            content: "";
            position: absolute;
            width: 50%;
            height: 3px;
            background-color: #e6e5db;
            top: 0;
            right: 0;
        }
    ` : `
    `}
`;

const TotalCostNumber = styled(CostNumber)`
    font-weight: 600;
`;

const BuildCost: React.FC<IProps> = ({ compact }) => {
    return (
        <Block compact={compact}>
            <Cost compact={compact}>
                <CostIcon compact={compact}>
                    <InfoIcon theme="blue" />
                </CostIcon>
                <CostContent compact={compact}>
                    <CostTitle compact={compact}>U.S. avg. contractor cost:</CostTitle>
                    <CostValue compact={compact}>
                        <CostCurrency compact={compact}>$</CostCurrency>
                        <CostNumber>150</CostNumber>
                        <CostPrefix>/per sq. foot</CostPrefix>
                    </CostValue>
                </CostContent>
            </Cost>
            <Cost compact={compact}>
                <CostIcon compact={compact}>
                    <InfoIcon theme="blue" />
                </CostIcon>
                <CostContent compact={compact}>
                    <CostTitle compact={compact}>Your square footage:</CostTitle>
                    <CostValue compact={compact}>
                        <CostOperation compact={compact}>x</CostOperation>
                        <CostNumber>1,720</CostNumber>
                        <CostPrefix>sq. feet</CostPrefix>
                    </CostValue>
                </CostContent>
            </Cost>
            <TotalCost compact={compact}>
                <CostIcon compact={compact}>
                    <InfoIcon theme="blue" />
                </CostIcon>
                <CostContent compact={compact}>
                    <CostTitle compact={compact}>Rebuild estimate:</CostTitle>
                    <CostValue compact={compact}>
                        <CostOperation compact={compact}>=</CostOperation>
                        <CostCurrency compact={compact}>$</CostCurrency>
                        <TotalCostNumber>258,000</TotalCostNumber>
                    </CostValue>
                </CostContent>
            </TotalCost>
        </Block>
    );
};

export default BuildCost;
