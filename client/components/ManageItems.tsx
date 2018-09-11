import React from "react"
import { Log, LogLevel } from "../share/LoggerApi";
import { Table, Icon, SemanticCOLORS, Popup, Input } from "semantic-ui-react"
import "moment/locale/th"
import "/css/Body.css"
import Switch from "react-switch";

type Props = {
}
type State = {
}

export class ManageItems extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    public render() {
        return (
            <Table.Row >
                <Table.Cell width={3} ><Input placeholder="Search..." /></Table.Cell>
                <Table.Cell width={3}><Input placeholder="Search..." /></Table.Cell>
                <Table.Cell width={3}><Input placeholder="Search..." /></Table.Cell>
                <Table.Cell width={3}><Switch
            onChange={null}
            checked={false}
            className="react-switch"
            id="normal-switch"
          /></Table.Cell>
            </Table.Row>
        )
    }
}