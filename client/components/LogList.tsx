import React from "react"
import { Segment, Table, Icon, Header, Dropdown, Loader } from "semantic-ui-react"
import { Logs } from "./Log"
import DatePicker from "react-datepicker"
import { Moment } from "moment"
import { Log } from "../share/LoggerApi"
import "/css/Body.css"
import InfiniteScroll from "react-infinite-scroll-component";

type Props = {
    endDay: Moment
    startDay: Moment
    loading: boolean
    logNow: Log[]
    all: string
    onStartChange: (Moment) => void
    onEndChange: (Moment) => void
    allApp: any[]
    allIp: any[]
    onIpChange: (options) => void
    onAppChange: (options) => void
    selectApp: string
    selectIp: string
    allData: Log[]
}
type State = {
    items: Log[]
    hasMore: boolean
}

export class LogList extends React.Component<Props, State> {
    private limit: number;

    constructor(props) {
        super(props)
        this.state = {
            items: this.props.logNow,
            hasMore: true,
        }
        this.limit = 0;
    }
    public fetchMoreData = () => {
        if (this.state.items.length >= this.props.allData.length) {
            this.setState({ hasMore: false });
            return;
        }
        // a fake async api call like which sends
        // 20 more records in .5 secs
        let limit;
        let start;
        if (limit <= this.props.allData.length && limit !== 0) {
            limit = this.limit
            start = this.limit + 100;
            this.limit = start;
        }
        setTimeout(() => {
            this.setState({
                items: this.state.items.concat(this.props.allData.splice(start, 100))
            });
        }, 500);
    };
    public setStart = (data) => {
        this.props.onStartChange(data)
    }
    public setEnd = (data) => {
        this.props.onEndChange(data)
    }
    public setIp = (_, { value }) => {
        this.props.onIpChange(value)
    }
    public setApp = (_, { value }) => {
        this.props.onAppChange(value)
    }
    public componentDidUpdate(prevProps, prevState) {
        if (prevProps.logNow !== this.props.logNow) {
            this.setState({ items: [] })
            let items = this.state.items
            // items = [...items, ...this.props.logNow]
            items = this.props.logNow
            this.setState({ items });
        }
    }
    public render() {
        return (
            <Segment.Group>
                <Segment textAlign="right" inverted color="blue" >
                    <Header as="h2" floated="left">
                        <Icon name="eye" />
                        <Header.Content>Central Logger</Header.Content>
                    </Header>
                    <Icon size="large" name="address book outline" />
                    IP : <Dropdown placeholder="All IP" closeOnChange selection options={this.props.allIp} onChange={this.setIp} value={this.props.selectIp} />
                    &nbsp;
                    <Icon size="large" name="box" />
                    Application : <Dropdown className="dropdown" disabled={this.props.selectIp === ""} placeholder="All Application" closeOnChange selection options={this.props.allApp} onChange={this.setApp} value={this.props.selectApp} />
                </Segment>
                <Segment textAlign="right" inverted color="blue" >
                    <Icon size="large" name="calendar alternate outline" />
                    <div className="ui input datepicker">
                        <DatePicker
                            withPortal
                            dateFormat="DD/MM/YY HH:mm"
                            selected={this.props.startDay}
                            onChange={this.setStart}
                            isClearable={false}
                            placeholderText="Select Date"
                            className="inputdate"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                        />
                        <Icon size="big" name="caret right" inverted />
                        <DatePicker
                            withPortal
                            dateFormat="DD/MM/YY HH:mm"
                            selected={this.props.endDay}
                            onChange={this.setEnd}
                            isClearable={false}
                            placeholderText="Select Date"
                            className="inputdate"
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            timeCaption="time"
                            minDate={this.props.startDay}
                        />
                    </div>
                </Segment>
                <Segment textAlign="right">
                    <div className="loglist" style={{ width: "100%" }}>
                        {this.props.logNow.length === 0 && !this.props.loading ?
                            <Header as="h1" icon>
                                <br />
                                <Icon size="huge" name="frown outline" />
                                <br />ไม่มีบันทึก Log ในช่วงเวลา
                             <Header.Subheader><br />{this.props.all}</Header.Subheader>
                            </Header>
                            :
                            <InfiniteScroll
                                dataLength={this.state.items.length}
                                next={this.fetchMoreData}
                                hasMore={this.state.hasMore}
                                loader={<Loader active inline="centered" />}
                                height={400}
                                endMessage={
                                    <p style={{ textAlign: "center" }}>
                                        <b>You have seen it all</b>
                                    </p>
                                }
                            >
                                <div className="table">
                                    <Table compact >
                                        <Table.Body>
                                            {
                                                this.state.items.map((x, key) => <Logs logsNow={x} key={key} />)
                                            }
                                        </Table.Body>
                                    </Table>
                                </div>

                            </InfiniteScroll>
                        }
                    </div>
                </Segment>
            </Segment.Group>
        )
    }
}