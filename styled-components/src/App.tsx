import React from "react";
import styled from "styled-components";
import BuildCost from "./components/BuildCost";
import BuildVariants from "./components/BuildVariants";
import useAdaptive from "./hooks/useAdaptive";
import { border, color, mediaQuery, screen, shadow } from "./styles/constants";
import Button from "./ui-kit/Button";

const Form = styled.form`
    border-radius: 20px;
    overflow-x: hidden;
    box-shadow: ${shadow.variant1};

    ${mediaQuery.desktop} {
        width: ${screen.desktop}px;
        margin: 70px auto;
    }

    ${mediaQuery.mobile} {
        width: ${screen.mobile}px;
        margin: 20px auto;
    }
`;

const Content = styled.div`
    padding: 55px 96px 25px;
    background-color: ${color.milk1};
    font-size: 0.91em;

    ${mediaQuery.mobile} {
        padding: 55px 24px 12px;
    }
`;

const Title = styled.h1`
    font-size: 2.2em;
    color: ${color.grey1};
    margin: 0;
    line-height: 25px;

    ${mediaQuery.mobile} {
        line-height: 23px;
    }
`;

const SubTitle = styled.h2`
    font-size: 1.6em;
    font-weight: 500;
    color: ${color.grey2};
    margin: 20px 0 40px;
`;

const Variants = styled.div`
    margin: 0 -96px;

    ${mediaQuery.mobile} {
        margin: 0 -24px;
    }
`;

const Footer = styled.footer`
    padding: 66px 96px 40px;
    background-color: white;
    border-top: ${border.variant1};

    ${mediaQuery.mobile} {
        padding: 44px 24px 20px;
    }
`;

const Actions = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 60px 0 0;

    ${mediaQuery.mobile} {
        margin: 44px 0 0;
    }
`;

const App: React.FC = () => {
    const { isMobile } = useAdaptive();

    return (
        <Form>
            <Content>
                <Title>Estimate your rebuild cost!</Title>
                <SubTitle>Just tell us about your home`s features.</SubTitle>
                <Variants>
                    <BuildVariants compact={isMobile} />
                </Variants>
            </Content>
            <Footer>
                <BuildCost compact={isMobile} />
                <Actions>
                    <Button type="reset" compact={isMobile}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        theme="primary"
                        icon="check"
                        compact={isMobile}
                    >
                        Use estimate
                    </Button>
                </Actions>
            </Footer>
        </Form>
    );
};

export default App;
