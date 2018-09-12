import React from "react"
import { Log, LogLevel, GetEmail } from "../share/LoggerApi";
import { Table, Icon, SemanticCOLORS, Popup, Button, SemanticICONS } from "semantic-ui-react"
import "moment/locale/th"
import "/css/Body.css"
import Switch from "react-switch";
import swal from "sweetalert2"

type Props = {
    list: GetEmail
    // tslint:disable-next-line:variable-name
    onDelete: (string) => void
}
type State = {
    status: string
    appName: string
}

export class ManageItems extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            status: "",
            appName: ""
        }
    }
    private onDelete() {
        console.log(this.props.list.application)
        // this.props.onDelete(this.props.list.application)
    }
    public render() {
        let status: SemanticICONS = "circle"
        switch (this.props.list.enable) {
            case true:
                status = "toggle on"
                break
            case false:
                status = "toggle off"
                break
        }
        return (
            this.props.list !== undefined ?
                <Table.Row>
                    <Table.Cell >{this.props.list.application}</Table.Cell>
                    <Table.Cell >{this.props.list.email_1}</Table.Cell>
                    <Table.Cell >{this.props.list.email_2}</Table.Cell>
                    <Table.Cell >{this.props.list.email_3}</Table.Cell>
                    <Table.Cell textAlign="center"><Icon name={status} /></Table.Cell>
                    <Table.Cell textAlign="center"><div><Button circular icon="pencil" color="green" /><Button circular icon="trash alternate" color="red" onClick={this.onDelete} /></div></Table.Cell>
                </Table.Row>
                :
                <div>No Data</div>
        )
    }
}