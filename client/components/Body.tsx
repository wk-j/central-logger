import React from "react"
import { Loader, Table, Button } from "semantic-ui-react"
import styled from "styled-components"
import moment, { Moment } from "moment"
import "react-datepicker/dist/react-datepicker.css"
import "semantic-ui-css/semantic.min.css";
import "/css/Body.css"
import "../css/Animation.css"
import { getApiUrl } from "../share/Configuration"
import { LoggerApi, Log } from "../share/LoggerApi"
import { LogList } from "./LogList"
import signalR, { HubConnectionBuilder } from "@aspnet/signalr";
import { debounce } from "throttle-debounce";
import { Route, Switch, Link, HashRouter, BrowserHistory } from "react-router-dom";
import { Chart } from "./Chart";

type Props = {
    onLogoutPlease: () => void
}

const BodyDiv = styled.div`
  flex-direction: column;
  justify-content: center;
  position: absolute;
  width:100%;
  height: 90%;
  padding: 1.5em;
  position: relative;
  min-width: 950px;
`

type State = {
    selectDay: Moment
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
    logDate: Log[]
    onChart: boolean
    styleLog: string
    render: boolean
    styleChart: string
    countInfo: number[]
    countError: number[]
    countDebug: number[]
    countTrace: number[]
    countWarning: number[]
    countCritical: number[]
}

export class Body extends React.Component<any, State> {
    private LoggerApi = new LoggerApi(getApiUrl());
    private LogDate: Log[]
    private LogNow: Log[]
    private Limit: number

    constructor(props) {
        super(props)
        this.state = {
            selectDay: moment(),
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
            newSearch: false,
            logDate: [],
            onChart: true,
            styleLog: "slideInRight",
            render: null,
            styleChart: "slideInLeft",
            countInfo: null,
            countDebug: null,
            countError: null,
            countTrace: null,
            countWarning: null,
            countCritical: null
        }
        this.LogDate = []
        this.LogNow = []
        this.Limit = 1
    }
    public handleStartDateChange = (date) => {
        this.Limit = 1
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
        this.Limit = 1
        this.setState({ endDay: date, newSearch: true });
        this.initSearchByAll(this.state.startDay.toDate(), date.toDate(), this.state.selectApp, this.state.selectIp)

    }
    private setIP = (value) => {
        this.Limit = 1
        this.setState({ selectApp: null, selectIp: value, allApp: null, newSearch: true }, () => this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, value))
        this.initGetApp(value);
    }
    private OnMore = () => {
        this.setState({ newSearch: false })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, this.state.selectIp)
    }

    public setApp = (value) => {
        this.Limit = 1
        this.setState({ selectApp: value, newSearch: true })
        this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), value, this.state.selectIp)
    }
    public setDay = (value) => {
        this.initGetChart(value.toDate())
        this.setState({ selectDay: value })
    }
    public initGetChart = (date: Date) => {
        this.LoggerApi.GetDataChart(date).then(response => {
            this.setState({ countInfo: response.data.dataInfos, countDebug: response.data.dataDebugs, countError: response.data.dataErrors
                            , countTrace: response.data.dataTraces, countCritical: response.data.dataCriticals, countWarning: response.data.dataWarnings  })
        })
    }
    public componentDidMount() {
        // this.initGetApp(this.state.selectIp)
        this.initGetIp()
        let starts = this.state.startDay
        let end = this.state.endDay
        this.initSearchByAll(starts.toDate(), end.toDate(), this.state.selectApp, this.state.selectIp)
        this.initGetChart(this.state.selectDay.toDate())
        this.handleSignalR();
    }
    public initSearchByAll = (startDate: Date, endDate: Date, app: string, ip: string) => {
        this.LogDate = []
        this.LogNow = []
        this.setState({ loading: true })
        this.LoggerApi.SearchLog(startDate, endDate, app, ip, this.Limit).then(response => {
            this.LogDate = response.data.logInfo
            this.setState({ loading: false, logDate: response.data.logInfo, logLenght: response.data.dataLength })
            this.Limit = this.Limit + 1
        }).catch(err => {
            if (err.response.status === 401) {
                this.props.onLogoutPlease()
            }
            this.setState({ loading: false })
        })
    }
    public initGetIp = () => {
        this.LoggerApi.getIp().then(response => {
            let options = response.data.map(x => ({ value: x, text: x }))
            options.unshift({ value: "", text: "All IP" });
            this.setState({ allIp: options })
        }).catch(err => {
            if (err.response.status === 401) {
                this.props.onLogoutPlease()
            }
        })
    }
    public initGetApp = (ip: string) => {
        this.LoggerApi.getApp(ip).then(response => {
            let options = response.data.map(x => ({ value: x, text: x }))
            options.unshift({ value: "", text: "All Application" });
            this.setState({ allApp: options })
        }).catch(err => {
            if (err.response.status === 401) {
                this.props.onLogoutPlease()
            }
        })
    }

    public handleSignalR() {

        const connection = new HubConnectionBuilder()
            // .withUrl("/LogHub")
            .withUrl(`${getApiUrl()}/LogHub`)
            .build();

        connection.onclose((err) => {
            // alert("SignalR เกิดปัญหาการเชื่อมต่อ");
            console.error(err)
        });

        connection.on("LogReceived", (log: Log) => {
            this.LogDate.unshift(log)
            this.updateLogNow();
        });

        connection.start().catch(err => console.error(err.toString()));
    }

    private updateLogNow = debounce(250, () => {
        if (this.LogDate.length >= 150) {
            this.Limit = 1
            this.LogDate = []
            this.setState({ logDate: [], newSearch: true })
            this.initSearchByAll(this.state.startDay.toDate(), this.state.endDay.toDate(), this.state.selectApp, this.state.selectIp)
        } else {
            this.setState({ logDate: this.LogDate })
        }
    })

    public render() {
        let allday = moment(this.state.startDay).format("lll").toString() + " ถึง " + moment(this.state.endDay).format("lll").toString()
        let { startDay, endDay, loading, allApp, allIp, selectApp, selectIp, logLenght, newSearch, selectDay,
            countDebug, countError, countInfo, countCritical, countTrace, countWarning } = this.state
        return (
            <HashRouter history={BrowserHistory}>
                <Switch>
                    <Route exact path="/" render={() => {
                        return (
                            <BodyDiv>
                                <Loader content="Loading" active={this.state.loading} />
                                <div className="buttons">
                                    <Link to="/summary" className="navbar-item"><Button circular color="blue" icon="area graph" size="massive" /></Link>
                                </div>
                                <LogList startDay={startDay} endDay={endDay} logNow={this.LogNow} loading={loading} all={allday}
                                    onStartChange={this.handleStartDateChange} onEndChange={this.handleEndDateChange} allApp={allApp}
                                    allIp={allIp} selectApp={selectApp} selectIp={selectIp} onIpChange={this.setIP} onAppChange={this.setApp}
                                    allData={this.state.logDate} onMore={this.OnMore} logLenght={logLenght} new={newSearch} />
                            </BodyDiv >

                        )
                    }} />
                    <Route exact path="/summary" render={() => {
                        return (
                            <BodyDiv>
                                <div className="buttons">
                                    <Link to="/" className="navbar-item"><Button circular color="blue" icon="eye" size="massive" /></Link>
                                </div>
                                <Chart Day={selectDay} onDayChange={this.setDay} info={countInfo} debug={countDebug} error={countError}
                                        trace={countTrace} warning={countWarning} critical={countCritical} />
                            </BodyDiv>
                        )

                     }} />
                </Switch>
            </HashRouter>
        )
    }
}