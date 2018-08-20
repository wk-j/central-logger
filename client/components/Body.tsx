import React from "react"
import { Loader } from "semantic-ui-react"
import styled from "styled-components"
import moment, { Moment } from "moment"
import "react-datepicker/dist/react-datepicker.css"
import "semantic-ui-css/semantic.min.css";
import "/css/Body.css"
import { getApiUrl } from "../share/Configuration"
import { LoggerApi, Log } from "../share/LoggerApi"
import { LogList } from "./LogList"

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
    private setIP = (value) => {
        this.setState({ selectIp: value })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, value)
    }

    public setApp = (value) => {
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
        let { startDay, endDay, logNow, loading, allApp, allIp, selectApp, selectIp } = this.state
        return (
            <BodyDiv>
                <Loader content="Loading" active={this.state.loading} />
                <LogList startDay={startDay} endDay={endDay} logNow={logNow} loading={loading} all={allday}
                    onStartChange={this.handleStartDateChange} onEndChange={this.handleEndDateChange} allApp={allApp}
                    allIp={allIp} selectApp={selectApp} selectIp={selectIp} onIpChange={this.setIP} onAppChange={this.setApp} />
            </BodyDiv >
        )
    }
}