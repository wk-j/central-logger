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
export type GetEmail = {
    application: string,
    email_1: string,
    email_2: string,
    email_3: string,
    enable: boolean
}
export type EmailList = {
    MailList: GetEmail[]
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
    // แสดงอีเมล์กับแอปทั้งหมด
    public ShowMailApp() {
        return axios.get<GetEmail[]>(`${this.url}/api/Logger/ShowMailApp`)
    }
    // ลบแอปอีเมล์
    public DeleteApp(AppName: string) {
        return axios.post(`${this.url}/api/Logger/DeleteApp`, AppName)
    }
    // อัพเดท อีเมล์
    public UpdateEmail(data: GetEmail) {
        return axios.post(`${this.url}/api/Logger/UpdateEmail`, data)
    }
    // เรียกแอปที่ยังไม่ได้ตังค่า
    public SearchExceptApp() {
        return axios.get<string[]>(`${this.url}/api/Logger/SearchExceptApp`)
    }
    // เพิ่มแอปอีเมล์
    public AddEmails(data: GetEmail) {
        return axios.post<GetEmail>(`${this.url}/api/Logger/AddEmails`, data)
    }
}
