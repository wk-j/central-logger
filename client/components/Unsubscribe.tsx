import React from "react"
import { Segment, Table, Icon, Header, Dropdown, Modal, Button, Input, Form, Loader, Message } from "semantic-ui-react"
import { Log, GetEmail, GetUsers } from "../share/LoggerApi"
import "/css/Body.css"
import { LoggerApi, manage } from "../share/LoggerApi"
import { getApiUrl } from "../share/Configuration"

type Props = {

}
type State = {
}

export class Unsubscribe extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
        };
    }

    public render() {
        let style = {
            marginLeft: "10px",
            marginRight: "10px"
        }
        return (
            <div>
                <Segment.Group>
                    <Segment textAlign="center" inverted color="olive" size="large">
                    </Segment>
                    <Segment textAlign="center" style={{ minHeight: "calc( 100vh - 230px )" }}>


                    </Segment>
                </Segment.Group>
            </div>
        )
    }
}