import React from "react"
import ReactDOM from "react-dom";
import styled from "styled-components"
import "semantic-ui-css/semantic.min.css"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Body } from "./components/Body"

type State = {
}
export class App extends React.Component<{}, State> {
    constructor(props) {
        super(props);
    }

    public render() {

        return (
            <div>
                <Header />
                <Body />
                <Footer />
            </div>
        )
    }
}

let root = document.getElementById("root")
ReactDOM.render(<App />, root)