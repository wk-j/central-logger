import axios from "axios"

type SearchDate = {
    startDate: Date;
    endDate: Date;
}
export enum LogLevel {
    Trace, Debug, Information, Warning, Error, Critical
}
export type Log = {
    logLevel: LogLevel
    message: string
    ip: string
    dateTime: Date
    application: string
    category: string
}
export type search = {
    logInfo: Log[]
    dataLength: number
}

type LoginResult = {
    accessToken: string;
}
export type CountLogs = {
    dataInfos: number[],
    dataErrors: number[],
    dataDebugs: number[],
    dataTraces: number[],
    dataWarnings: number[],
    dataCriticals: number[]
}
export type manage = {
    ApplicationName: string,
    Email1: string,
    Email2: string,
    Email3: string,
    Enable: boolean
}

export type ResultByDate = {
    resultDate: Log[]
}

export class LoggerApi {
    constructor(private url: string) {
    }
    public getIp() {
        return axios.get<string[]>(`${this.url}/api/Logger/getIP`)
    }
    public getApp(IP: string) {
        return axios.get<string[]>(`${this.url}/api/Logger/getApp/${IP}`)
    }

    public SearchLog(startDate: Date, endDate: Date, app: string, ip: string, start: number) {
        return axios.post<search>(`${this.url}/api/Logger/Search`, {
            StartDate: startDate,
            EndDate: endDate,
            Appnow: app,
            IpNow: ip,
            Section: start
        })
    }

    public Login(user: string, pass: string) {
        return axios.post<LoginResult>(`${this.url}/api/Logger/LoginRequest`, {
            User: user,
            Pass: pass
        })
    }
    public GetDataChart(date: Date) {
        return axios.post<CountLogs>(`${this.url}/api/Summary/GetDataChart`, date)
    }
}
