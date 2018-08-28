import React from "react"
import { Menu, Icon } from "semantic-ui-react";


type State = {}

export class Header extends React.Component<State> {
    constructor(props) {
        super(props);
    }
    public render() {
        return (
            <div>
                <Menu size="large" icon="labeled" inverted color="blue" secondary >
                    &nbsp;&nbsp;<Menu.Item header name="Central Logger" />
                </Menu>
            </div>
        )
    }
}