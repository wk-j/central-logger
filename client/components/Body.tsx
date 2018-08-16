import React from "react"
import { Segment, Table, Icon, Header, Dropdown, Input, Dimmer, Loader } from "semantic-ui-react"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import moment, { Moment } from "moment"
import "react-datepicker/dist/react-datepicker.css"
import "semantic-ui-css/semantic.min.css";
import "/css/Body.css"
import { getApiUrl } from "../share/Configuration"
import { LoggerApi, Log } from "../share/LoggerApi"
import { Logs } from "./Log"

const BodyDiv = styled.div`
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width:100%;
  height: 90%;
  padding: 1.5em;
`

type State = {
    endDay: Moment
    startDay: Moment
    logNow: Log[]
    noLog: boolean
    allIp: any[]
    allApp: any[]
    selectIp: string
    selectApp: string
    loading: boolean
}

export class Body extends React.Component<any, State> {
    private LoggerApi = new LoggerApi(getApiUrl());

    constructor(props) {
        super(props)
        this.state = {
            endDay: moment().endOf("day"),
            startDay: moment().startOf("day"),
            logNow: [],
            noLog: true,
            allIp: [],
            allApp: [],
            selectIp: "",
            selectApp: "",
            loading: true
        }
    }

    public handleStartDateChange = (date) => {
        if (date > this.state.endDay) {
            this.setState({
                startDay: date,
                endDay: moment(date).endOf("day")
            });
        } else {
            this.setState({ startDay: date })
        }
        this.initSearchByAll(date.toDate(), this.state.endDay.toDate(), this.state.selectApp, this.state.selectIp)
    }

    public handleEndDateChange = (date) => {
        this.setState({ endDay: date });
        this.initSearchByAll(this.state.startDay.toDate(), date.toDate(), this.state.selectApp, this.state.selectIp)

    }
    private setIP = (_, { value }) => {
        this.setState({ selectIp: value })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, value)
    }

    public setApp = (_, { value }) => {
        this.setState({ selectApp: value })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), value, this.state.selectIp)
    }
    public componentDidMount() {
        this.initGetApp()
        this.initGetIp()
        let starts = this.state.startDay
        let end = this.state.endDay
        this.initSearchByAll(starts.toDate(), end.toDate(), this.state.selectApp, this.state.selectIp)
        // this.state.logNow.map((log) => console.log("this" + log))
    }
    public initSearchByAll = (StartDate: Date, EndDate: Date, App: string, Ip: string) => {
        this.setState({ logNow: [], loading: true })
        this.LoggerApi.SearchLog(StartDate, EndDate, App, Ip).then(response => {
            let LogDate = response.data
            this.setState({ logNow: LogDate, loading: false })
        }).catch(() => this.setState({ loading: false }))
    }
    public initGetIp = () => {
        this.LoggerApi.getIp().then(response => {
            let options = response.data.map(x => ({ value: x, text: x }))
            options.unshift({ value: "", text: "All IP" });
            this.setState({ allIp: options })
        })
    }
    public initGetApp = () => {
        this.LoggerApi.getApp().then(response => {
            let options = response.data.map(x => ({ value: x, text: x }))
            options.unshift({ value: "", text: "All Application" });
            this.setState({ allApp: options })
        })
    }

    public render() {
        let allday = moment(this.state.startDay).format("lll").toString() + " ถึง " + moment(this.state.endDay).format("lll").toString()

        return (
            <BodyDiv>
                <Loader content="Loading" active={this.state.loading} />
                <Segment.Group>
                    <Segment textAlign="right" inverted color="blue" >
                        <Header as="h2" floated="left">
                            <Icon name="eye" />
                            <Header.Content>Central Logger</Header.Content>
                        </Header>
                        <Icon size="large" name="box" />
                        Application : <Dropdown className="dropdown" placeholder="All Application" closeOnChange selection options={this.state.allApp} onChange={this.setApp} value={this.state.selectApp} />
                        &nbsp;
                        <Icon size="large" name="address book outline" />
                        IP : <Dropdown placeholder="All IP" closeOnChange selection options={this.state.allIp} onChange={this.setIP} value={this.state.selectIp} />
                    </Segment>
                    <Segment textAlign="right" inverted color="blue" >
                        <Icon size="large" name="calendar alternate outline" />
                        <div className="ui input datepicker">
                            <DatePicker
                                withPortal
                                dateFormat="DD/MM/YY HH:mm"
                                selected={this.state.startDay}
                                onChange={this.handleStartDateChange}
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
                                selected={this.state.endDay}
                                onChange={this.handleEndDateChange}
                                isClearable={false}
                                placeholderText="Select Date"
                                className="inputdate"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={15}
                                timeCaption="time"
                                minDate={this.state.startDay}
                            />
                        </div>
                    </Segment>
                    <Segment>
                        <div className="logbox">
                            {this.state.logNow.length === 0 && !this.state.loading ?
                                <Header as="h1" icon>
                                    <br />
                                    <Icon size="huge" name="frown outline" />
                                    <br />ไม่มีบันทึก Log ในช่วงเวลา
                          <Header.Subheader><br />{allday}</Header.Subheader>
                                </Header>
                                :
                                <Table singleLine>

                                    <Table.Body>
                                        {this.state.logNow.map(x => <Logs logsNow={x} />)}
                                    </Table.Body>
                                </Table>

                            }
                        </div>
                    </Segment>
                </Segment.Group>
            </BodyDiv >
        )
    }
}