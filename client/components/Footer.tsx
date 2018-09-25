import React, { CSSProperties } from "react"
import styled from "styled-components"
import { scaleDown as Menu } from "react-burger-menu"

const FooterDiv = styled.div`
    padding: 0px;
    display: block;
    width: 100%;
    height: 40px;
    color: white;
    bottom: 0;
    text-align: center;
    position: fixed;
`

export class Footer extends React.Component<{ style?: CSSProperties }> {
    public render() {
        return (
            <div id="outer-container">
                <main id="page-wrap">
                    <FooterDiv>
                        Central Logger 0.2.0
                    </FooterDiv>
                </main>
            </div>
        )
    }
}