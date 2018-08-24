import React from "react"
import { Loader, Table } from "semantic-ui-react"
import styled from "styled-components"
import moment, { Moment } from "moment"
import "react-datepicker/dist/react-datepicker.css"
import "semantic-ui-css/semantic.min.css";
import "/css/Body.css"
import { getApiUrl } from "../share/Configuration"
import { LoggerApi, Log } from "../share/LoggerApi"
import { LogList } from "./LogList"
import { HubConnectionBuilder } from "@aspnet/signalr";

const BodyDiv = styled.div`
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width:100%;
  height: 90%;
  padding: 1.5em;
  position: relative;
`

type State = {
    endDay: Moment
    startDay: Moment
    noLog: boolean
    allIp: any[]
    allApp: any[]
    selectIp: string
    selectApp: string
    loading: boolean
    items: Log[]
    isLoading: boolean
    cursor: 0
    error: string
}

export class Body extends React.Component<any, State> {
    private LoggerApi = new LoggerApi(getApiUrl());
    private LogDate: Log[];
    private LogNow: Log[]

    constructor(props) {
        super(props)
        this.state = {
            endDay: moment().endOf("day"),
            startDay: moment().startOf("day"),
            noLog: true,
            allIp: [],
            allApp: [],
            selectIp: "",
            selectApp: "",
            loading: true,
            items: null,
            isLoading: true,
            cursor: 0,
            error: ""
        }
        this.LogDate = []
        this.LogNow = []
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
        this.setState({ selectApp: null, selectIp: value, allApp: null }, () => this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, value))
        this.initGetApp(value);
    }

    public setApp = (value) => {
        this.setState({ selectApp: value })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), value, this.state.selectIp)
    }
    public componentDidMount() {
        // this.initGetApp(this.state.selectIp)
        this.initGetIp()
        let starts = this.state.startDay
        let end = this.state.endDay
        this.initSearchByAll(starts.toDate(), end.toDate(), this.state.selectApp, this.state.selectIp)
        this.handleSignalR();
    }
    public initSearchByAll = (startDate: Date, endDate: Date, app: string, ip: string) => {
        this.LogDate = []
        this.LogNow = []
        this.setState({ loading: true })
        this.LoggerApi.SearchLog(startDate, endDate, app, ip).then(response => {
            this.LogDate = response.data
            let LogDates = this.LogDate.splice(0, 100)
            this.LogNow = LogDates
            this.setState({ loading: false })
        }).catch(() => this.setState({ loading: false }))
    }
    public initGetIp = () => {
        this.LoggerApi.getIp().then(response => {
            let options = response.data.map(x => ({ value: x, text: x }))
            options.unshift({ value: "", text: "All IP" });
            this.setState({ allIp: options })

        })
    }
    public initGetApp = (ip: string) => {
        this.LoggerApi.getApp(ip).then(response => {
            let options = response.data.map(x => ({ value: x, text: x }))
            options.unshift({ value: "", text: "All Application" });
            this.setState({ allApp: options })
        })
    }

    public handleSignalR() {
        const connection = new HubConnectionBuilder()
            .withUrl("http://localhost:5000/LogHub")
            .build();

        connection.onclose(() => {
            alert("SignalR เกิดปัญหาการเชื่อมต่อ");
        });

        connection.on("LogReceived", (log: Log) => {

            let logNow = this.LogDate;
            logNow.unshift(log);
            let LogDates = logNow.splice(0, 100)
            this.LogNow = LogDates
            this.setState({ loading: false })
        });

        connection.start().catch(err => console.error(err.toString()));

    }

    public render() {
        let allday = moment(this.state.startDay).format("lll").toString() + " ถึง " + moment(this.state.endDay).format("lll").toString()
        let { startDay, endDay, loading, allApp, allIp, selectApp, selectIp } = this.state
        return (
            <BodyDiv>
                <Loader content="Loading" active={this.state.loading} />
                <LogList startDay={startDay} endDay={endDay} logNow={this.LogNow} loading={loading} all={allday}
                    onStartChange={this.handleStartDateChange} onEndChange={this.handleEndDateChange} allApp={allApp}
                    allIp={allIp} selectApp={selectApp} selectIp={selectIp} onIpChange={this.setIP} onAppChange={this.setApp}
                    allData={this.LogDate} />
            </BodyDiv >
        )
    }
}