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
}
