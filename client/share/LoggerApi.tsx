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
    public getApp() {
        return axios.get<string[]>(`${this.url}/api/Logger/getApp`)
    }

    public SearchLog(startDate: Date, endDate: Date, app: string, ip: string) {
        return axios.post<Log[]>(`${this.url}/api/Logger/Search`, {
            StartDate: startDate,
            EndDate: endDate,
            Appnow: app,
            IpNow: ip
        })
    }
}
