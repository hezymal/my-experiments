import React, { ComponentProps, useState } from "react";
import styled from "styled-components";
import BuildIcon from "./BuildIcon";
import { border, color, shadow } from "../styles/constants";

enum BuildVariant {
    variant1 = "variant1",
    variant2 = "variant2",
    variant3 = "variant3",
}

interface IProps {
    compact?: boolean;
}

interface IVariantsProps {
    compact?: boolean;
}

interface IVariantProps {
    id: string;
    name: string;
    value: BuildVariant;
    checked: boolean;
    compact?: boolean;
    onChange: (newValue: BuildVariant) => void;
}

interface IVariantLabelProps {
    compact?: boolean;
}

interface IVariantIconProps extends ComponentProps<typeof BuildIcon> {
    compact?: boolean;
}

interface IVariantTitleProps {
    compact?: boolean;
}

interface IVariantRadioIconProps {
    compact?: boolean;
}

interface ITooltipProps {
    cursorOffset: number;
    compact?: boolean;
}

interface ITooltipTitleProps {
    compact?: boolean;
}

const Block = styled.div``;

const Variants = styled.div<IVariantsProps>`
    display: flex;
    justify-content: space-between;
    padding: ${({ compact }) => (compact ? "0 24px" : "0 96px")};
`;

const VariantBlock = styled.div`
    position: relative;
`;

const VariantLabel = styled.label<IVariantLabelProps>`
    display: flex;
    flex-wrap: wrap;
    align-content: center;
    justify-content: center;
    font-size: 1.2em;
    border: ${border.variant1};
    border-radius: ${border.radius.variant1};
    background-color: white;
    cursor: pointer;

    ${({ compact }) =>
        compact
            ? `
        width: 162px;
        height: 174px;
    `
            : `
        width: 248px;
        height: 260px;
    `};
`;

const VariantIcon = styled<React.FC<IVariantIconProps>>(BuildIcon)`
    font-size: ${({ compact }) => (compact ? "6em" : "6.4em")};
`;

const VariantTitle = styled.div<IVariantTitleProps>`
    width: 100%;
    font-weight: 500;
    text-align: center;
    color: ${color.grey3};

    ${({ compact }) =>
        compact
            ? `
        font-size: 1.2em;
        margin: 10px 0;
    `
            : `
        font-size: 1.3em;
        margin: 20px 0;
    `};
`;

const VariantRadioIcon = styled.div<IVariantRadioIconProps>`
    position: relative;
    width: 100%;

    &::before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        border: 2px solid ${color.grey4};
        border-radius: 50%;
    }

    &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        background-color: ${color.blue1};
        border-radius: 50%;
        display: none;
    }

    ${({ compact }) => compact ? `
        height: 22px;

        &::before {
            width: 22px;
            height: 22px;
            margin: -11px 0 0 -11px;
        }
    
        &::after {
            width: 12px;
            height: 12px;
            margin: -5px 0 0 -5px;
        }
    ` : `
        height: 32px;

        &::before {
            width: 32px;
            height: 32px;
            margin: -16px 0 0 -16px;
        }
    
        &::after {
            width: 16px;
            height: 16px;
            margin: -7px 0 0 -7px;
        }
    `};
`;

const VariantRadio = styled.input`
    visibility: hidden;
    position: absolute;

    &:checked + ${VariantLabel} {
        border: ${border.variant2};
        box-shadow: ${shadow.variant1};

        ${VariantTitle} {
            font-weight: 600;
            color: ${color.grey1};
        }

        ${VariantRadioIcon} {
            &::before {
                border: 1px solid ${color.blue1};
            }

            &::after {
                display: block;
            }
        }
    }
`;

const Variant: React.FC<IVariantProps> = ({
    id,
    name,
    value,
    checked,
    compact,
    children,
    onChange,
}) => {
    return (
        <VariantBlock>
            <VariantRadio
                type="radio"
                id={id}
                name={name}
                value={value}
                checked={checked}
                onChange={(e) =>
                    onChange(e.currentTarget.value as BuildVariant)
                }
            />
            <VariantLabel htmlFor={id} compact={compact}>
                <VariantIcon
                    compact={compact}
                    theme={checked ? "blue" : "default"}
                />
                <VariantTitle compact={compact}>{children}</VariantTitle>
                <VariantRadioIcon compact={compact} />
            </VariantLabel>
        </VariantBlock>
    );
};

const getTooltipCursorLeft = (cursorOffset: number, compact?: boolean) =>
    compact ? `${91 + cursorOffset * 175}px` : `${108 + cursorOffset * 260}px`;

const Tooltip = styled.div<ITooltipProps>`
    border-top: ${border.variant1};
    border-bottom: ${border.variant1};
    background-color: white;
    font-size: 0.9em;
    position: relative;

    ${({ compact }) =>
        compact
            ? `
        border-left: none;
        border-right: none;
        border-radius: 0;
        margin: 25px 0 0;
        padding: 27px 24px 33px;
    `
            : `
        border-left: ${border.variant1};
        border-right: ${border.variant1};
        border-radius: ${border.radius.variant1};
        margin: 25px 96px 0;
        padding: 27px 37px 33px;
    `}

    &::before {
        content: "";
        position: absolute;
        width: 28px;
        height: 28px;
        background-color: white;
        border-top: ${border.variant1};
        border-left: ${border.variant1};
        transform: scale(0.7, 1) rotate(45deg);
        top: -16px;
        left: ${({ cursorOffset, compact }) => getTooltipCursorLeft(cursorOffset, compact)};
    }
`;

const TooltipTitle = styled.h2<ITooltipTitleProps>`
    font-size: ${({ compact }) => (compact ? "1.8em" : "2.2em")};
    color: ${color.grey1};
    margin: 0;
`;

const TooltipText = styled.div`
    margin: 5px 0 0;
    font-size: 1.6em;
    color: ${color.grey2};
    line-height: 1.5em;
`;

const BuildVariants: React.FC<IProps> = ({ compact }) => {
    const [variant, setVariant] = useState<BuildVariant>(BuildVariant.variant1);

    const getCursorOffsetByVariant = (variant: BuildVariant): number => {
        switch (variant) {
            case BuildVariant.variant1:
                return 0;

            case BuildVariant.variant2:
                return 1;

            case BuildVariant.variant3:
                return 2;
        }
    };

    return (
        <Block>
            <Variants compact={compact}>
                <Variant
                    id="build-variant-1"
                    name="build-variant"
                    value={BuildVariant.variant1}
                    checked={variant === BuildVariant.variant1}
                    compact={compact}
                    onChange={setVariant}
                >
                    Standard
                </Variant>
                <Variant
                    id="build-variant-2"
                    name="build-variant"
                    value={BuildVariant.variant2}
                    checked={variant === BuildVariant.variant2}
                    compact={compact}
                    onChange={setVariant}
                >
                    Upgraded
                </Variant>
                <Variant
                    id="build-variant-3"
                    name="build-variant"
                    value={BuildVariant.variant3}
                    checked={variant === BuildVariant.variant3}
                    compact={compact}
                    onChange={setVariant}
                >
                    Custom
                </Variant>
            </Variants>
            <Tooltip
                compact={compact}
                cursorOffset={getCursorOffsetByVariant(variant)}
            >
                <TooltipTitle compact={compact}>
                    None or very minor updates
                </TooltipTitle>
                <TooltipText>
                    Examples include: Carpet or vinyl flooring, vinyl blinds,
                    builder`s grade cabinets, laminate countertops, basic
                    fixtures, etc...
                </TooltipText>
            </Tooltip>
        </Block>
    );
};

export default BuildVariants;
