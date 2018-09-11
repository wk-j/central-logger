import React from "react"
import { Segment, Table, Icon, Header, Dropdown, Loader, Button } from "semantic-ui-react"
import { Logs } from "./Log"
import "react-datepicker/dist/react-datepicker.css";
import { Log } from "../share/LoggerApi"
import "/css/Body.css"
import ReactEcharts from "echarts-for-react";
import { LoggerApi, manage } from "../share/LoggerApi"
import { getApiUrl } from "../share/Configuration"
import Switch from "react-switch";

type Props = {
    allApp: any[]
    selectApp: string
}
type State = {
manage: manage[]
}

export class Manage extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            manage: null
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
                    <Segment textAlign="center" inverted color="green">
                    <Header as="h2" floated="left">
                    Manage
                    </Header>
                    <Icon style={style} size="large" name="box" />
                    <Dropdown className="dropdown" placeholder="All Application" closeOnChange selection options={this.props.allApp} value={this.props.selectApp} />
                    </Segment>
                    <Segment textAlign="right" style={{ minHeight: "calc( 100vh - 230px )" }}>
                    </Segment>
                </Segment.Group>
                <Table compact >
                <Table.Body>
                    {
                        this.state.manage.map((x, key) => {})
                    }
                </Table.Body>
            </Table>
            </div>
        )
    }
}