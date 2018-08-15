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
    public SearchByDate(startDate: Date, endDate: Date) {
        return axios.post<Log[]>(`${this.url}/api/Logger/FilterDate`, {
            StartDate: startDate,
            EndDate: endDate
        })
    }
    public getIp() {
        return axios.get<string[]>(`${this.url}/api/Logger/getIP`)
    }
    public getApp() {
        return axios.get<string[]>(`${this.url}/api/Logger/getApp`)
    }
    public SearchByIp(startDate: Date, endDate: Date, ip: string) {
        return axios.post<Log[]>(`${this.url}/api/Logger/FilterIp`, {
            StartDate: startDate,
            EndDate: endDate,
            IpNow: ip
        })
    }
    public SearchByApp(startDate: Date, endDate: Date, app: string) {
        return axios.post<Log[]>(`${this.url}/api/Logger/FilterApp`, {
            StartDate: startDate,
            EndDate: endDate,
            Appnow: app
        })
    }
    public SearchByAll(startDate: Date, endDate: Date, app: string, ip: string) {
        return axios.post<Log[]>(`${this.url}/api/Logger/FilterAll`, {
            StartDate: startDate,
            EndDate: endDate,
            Appnow: app,
            IpNow: ip
        })
    }
}
