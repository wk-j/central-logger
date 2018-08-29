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
import { debounce } from "throttle-debounce";

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
    logLenght: number
    newSearch: boolean
}

export class Body extends React.Component<any, State> {
    private LoggerApi = new LoggerApi(getApiUrl());
    private LogDate: Log[]
    private LogNow: Log[]
    private Limit: number

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
            error: "",
            logLenght: 0,
            newSearch: false
        }
        this.LogDate = []
        this.LogNow = []
        this.Limit = 0;
    }
    public handleStartDateChange = (date) => {
        this.Limit = 0
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
        this.Limit = 0
        this.setState({ endDay: date, newSearch: true });
        this.initSearchByAll(this.state.startDay.toDate(), date.toDate(), this.state.selectApp, this.state.selectIp)

    }
    private setIP = (value) => {
        this.Limit = 0
        this.setState({ selectApp: null, selectIp: value, allApp: null, newSearch: true }, () => this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, value))
        this.initGetApp(value);
    }
    private OnMore = () => {
        this.setState({ newSearch: false })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, this.state.selectIp)
    }

    public setApp = (value) => {
        this.Limit = 0
        this.setState({ selectApp: value, newSearch: true })
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
            let start
            let log
            if (this.Limit === 0) {
                start = this.Limit
                log = response.data
                this.LogDate = log.splice(start, 50)
                this.setState({ loading: false, logLenght: response.data.length })
                this.Limit = this.Limit + 50
            } else if (this.Limit <= response.data.length) {
                start = this.Limit
                log = response.data.splice(start, 50)
                this.LogDate = log
                this.setState({ loading: false, logLenght: response.data.length })
                this.Limit = this.Limit + 50
            }
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
            this.LogDate.unshift(log)
            this.updateLogNow();
        });

        connection.start().catch(err => console.error(err.toString()));
    }

    private updateLogNow = debounce(250, () => {
        this.LogNow = this.LogDate.splice(0, 100)
        this.forceUpdate();
    })

    public render() {
        let allday = moment(this.state.startDay).format("lll").toString() + " ถึง " + moment(this.state.endDay).format("lll").toString()
        let { startDay, endDay, loading, allApp, allIp, selectApp, selectIp, logLenght, newSearch } = this.state
        return (
            <BodyDiv>
                <Loader content="Loading" active={this.state.loading} />
                <LogList startDay={startDay} endDay={endDay} logNow={this.LogNow} loading={loading} all={allday}
                    onStartChange={this.handleStartDateChange} onEndChange={this.handleEndDateChange} allApp={allApp}
                    allIp={allIp} selectApp={selectApp} selectIp={selectIp} onIpChange={this.setIP} onAppChange={this.setApp}
                    allData={this.LogDate} onMore={this.OnMore} logLenght={logLenght} new={newSearch} />
            </BodyDiv >
        )
    }
}