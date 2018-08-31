import React from "react"
import { Menu } from "semantic-ui-react";
import AppStorage from "../share/AppStorage"

type Props = {
    loggedIn: boolean
    // tslint:disable-next-line:variable-name
    onLogout: (string) => void
}
type State = {}

export class Header extends React.Component<Props, State> {
    constructor(props) {
        super(props);
    }
    public onLogout = () => {
        this.props.onLogout(false)
        AppStorage.setAccessToken(null)
    }
    public render() {
        return (
            this.props.loggedIn ?
                <div>
                    <Menu size="large" icon="labeled" inverted color="blue" secondary >\
                    <Menu.Item header name="Central Logger ™" />
                        <Menu.Item position="right" name="logout" onClick={this.onLogout} />
                    </Menu>
                </div>
                :
                <div>
                    <Menu size="large" icon="labeled" inverted color="blue" secondary >\
                    <Menu.Item header name="Central Logger ™" />
                    </Menu>
                </div>
        )
    }
}