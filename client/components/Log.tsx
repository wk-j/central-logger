import React from "react"
import { Log, LogLevel } from "../share/LoggerApi";
import { Table, Icon, SemanticCOLORS, Popup } from "semantic-ui-react"
import moment from "moment"
import "moment/locale/th"

type LogProps = {
    logsNow: Log
}
type State = {
    alert: boolean
}

export class Logs extends React.Component<LogProps, State> {
    constructor(props) {
        super(props)
        this.state = {
            alert: null,
        }
    }

    public render() {
        let color: SemanticCOLORS = "red"
        switch (this.props.logsNow.logLevel) {
            case 1:
                color = "green"
                break
            case 2:
                color = "grey"
                break
            case 3:
                color = "blue"
                break
            case 4:
                color = "red"
                break
            case 5:
                color = "orange"
                break
        }
        return (
            <Table.Row>
                <Table.Cell width={1}>{moment(this.props.logsNow.dateTime).format("Do MMMM YYYY, h:mm:ss")}</Table.Cell>
                <Table.Cell width={1} textAlign="center"><Popup trigger={<Icon name="dot circle" color={color} />} content={LogLevel[this.props.logsNow.logLevel]} /></Table.Cell>
                <Table.Cell width={10}>{this.props.logsNow.message}</Table.Cell>
            </Table.Row>
        )
    }
}