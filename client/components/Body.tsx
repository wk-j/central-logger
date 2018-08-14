import React, { CSSProperties } from "react"
import { Segment, Menu, Table, Icon, Header, Message } from "semantic-ui-react"
import styled from "styled-components"
import DatePicker from "react-datepicker"
import moment, { Moment } from "moment"
import "react-datepicker/dist/react-datepicker.css"
import "semantic-ui-css/semantic.min.css";
import "/css/Body.css"
import { getApiUrl } from "../share/Configuration"
import { LoggerApi, Log } from "../share/LoggerApi"
import { Logs } from "./Log"
import { start } from "repl";

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
}

export class Body extends React.Component<any, State> {
    private LoggerApi = new LoggerApi(getApiUrl());

    constructor(props) {
        super(props)
        this.state = {
            endDay: moment().endOf("day"),
            startDay: moment().startOf("day"),
            logNow: [],
            noLog: true
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
        this.initSearchByDate(date.toDate(), this.state.endDay.toDate())
    }

    public handleEndDateChange = (date) => {
        this.setState({ endDay: date });
        this.initSearchByDate(this.state.startDay.toDate(), date.toDate())
    }

    public componentDidMount() {
        let starts = this.state.startDay
        let end = this.state.endDay
        this.initSearchByDate(starts.toDate(), end.toDate())
        // this.state.logNow.map((log) => console.log("this" + log))
    }
    public initSearchByDate = (StartDate: Date, EndDate: Date) => {
        this.LoggerApi.SearchByDate(StartDate, EndDate).then(response => {
            let LogDate = response.data
            this.setState({ logNow: LogDate })
        })
    }

    public render() {
        let allday = moment(this.state.startDay).format("lll").toString() + " ถึง " + moment(this.state.endDay).format("lll").toString()

        return (
            <BodyDiv>
                <Segment inverted color="blue">
                    <Header as="h2" icon="eye" content="Logger" />
                </Segment>
                <Segment attached textAlign="right" inverted color="blue" tertiary><Icon size="large" name="calendar alternate outline" />
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
                        <Icon size="large" name="chevron right" />
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
                <Segment attached>
                    <div className="logbox">
                        {this.state.logNow.length === 0 ?
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
            </BodyDiv>
        )
    }
}