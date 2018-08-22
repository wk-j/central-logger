import React from "react"
import { Segment, Table, Icon, Header, Dropdown } from "semantic-ui-react"
import { Logs } from "./Log"
import DatePicker from "react-datepicker"
import { Moment } from "moment"
import { Log } from "../share/LoggerApi"
import "/css/Body.css"
import styled from "styled-components"

type Props = {
    endDay: Moment
    startDay: Moment
    loading: boolean
    logNow: Log[]
    all: string
    onStartChange: (Moment) => void
    onEndChange: (Moment) => void
    allApp: any[]
    allIp: any[]
    // tslint:disable-next-line:variable-name
    onIpChange: (options) => void
    onAppChange: (options) => void
    selectApp: string
    selectIp: string
}

export class LogList extends React.Component<Props> {
    constructor(props) {
        super(props)
    }
    public setStart = (data) => {
        this.props.onStartChange(data)
    }
    public setEnd = (data) => {
        this.props.onEndChange(data)
    }
    public setIp = (_, { value }) => {
        this.props.onIpChange(value)
    }
    public setApp = (_, { value }) => {
        this.props.onAppChange(value)
    }
    public render() {
        return (
            <Segment.Group>
                <Segment textAlign="right" inverted color="blue" >
                    <Header as="h2" floated="left">
                        <Icon name="eye" />
                        <Header.Content>Central Logger</Header.Content>
                    </Header>
                    <Icon size="large" name="address book outline" />
                    IP : <Dropdown placeholder="All IP" closeOnChange selection options={this.props.allIp} onChange={this.setIp} value={this.props.selectIp} />
                    &nbsp;
                    <Icon size="large" name="box" />
                    Application : <Dropdown className="dropdown" disabled={this.props.selectIp === ""} placeholder="All Application" closeOnChange selection options={this.props.allApp} onChange={this.setApp} value={this.props.selectApp} />
                </Segment>
                <Segment textAlign="right" inverted color="blue" >
                    <Icon size="large" name="calendar alternate outline" />
                    <div className="ui input datepicker">
                        <DatePicker
                            withPortal
                            dateFormat="DD/MM/YY HH:mm"
                            selected={this.props.startDay}
                            onChange={this.setStart}
                            isClearable={false}
                            placeholderText="Select Date"
                            className="inputdate"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                        />
                        <Icon size="big" name="caret right" inverted />
                        <DatePicker
                            withPortal
                            dateFormat="DD/MM/YY HH:mm"
                            selected={this.props.endDay}
                            onChange={this.setEnd}
                            isClearable={false}
                            placeholderText="Select Date"
                            className="inputdate"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            minDate={this.props.startDay}
                        />
                    </div>
                </Segment>
                <Segment>
                    <div className="loglist">
                        {this.props.logNow.length === 0 && !this.props.loading ?
                            <Header as="h1" icon>
                                <br />
                                <Icon size="huge" name="frown outline" />
                                <br />ไม่มีบันทึก Log ในช่วงเวลา
                  <Header.Subheader><br />{this.props.all}</Header.Subheader>
                            </Header>
                            :
                            <Table singleLine>
                                <Table.Body>
                                    {this.props.logNow.map(x => <Logs logsNow={x} />)}
                                </Table.Body>
                            </Table>
                        }
                    </div>
                </Segment>
            </Segment.Group>
        )
    }
}