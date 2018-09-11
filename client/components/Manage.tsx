import React from "react"
import { Segment, Table, Icon, Header, Dropdown, Modal, Button, Input, Form } from "semantic-ui-react"
import { ManageItems } from "./ManageItems"
import "react-datepicker/dist/react-datepicker.css";
import { Log } from "../share/LoggerApi"
import "/css/Body.css"
import { LoggerApi, manage } from "../share/LoggerApi"
import { getApiUrl } from "../share/Configuration"
import Switch from "react-switch";

type Props = {
    allApp: any[]
    selectApp: string
}
type State = {
    manage: manage[]
    open: boolean
    checked: boolean
}

export class Manage extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            manage: null,
            open: null,
            checked: true
        };
    }
    public onOpens = () => {
        this.setState({ open: true })
    }
    private onClose = () => {
        this.setState({ open: false })
    }
    private handleChange = (value) => {
        this.setState({ checked: value })
    }
    public render() {
        let style = {
            marginLeft: "10px",
            marginRight: "10px"
        }
        return (
            <div>
                <Segment.Group>
                    <Segment textAlign="center" inverted color="green">
                        <Header as="h2" floated="left">
                            Manage
                    </Header>
                        <Icon style={style} size="large" name="box" />
                        <Dropdown className="dropdown" placeholder="All Application" closeOnChange selection options={this.props.allApp} value={this.props.selectApp} />
                        <Button onClick={this.onOpens} color="olive" circular icon="plus" floated="right" />
                        <Modal open={this.state.open} >
                            <Modal.Header>เพิ่มรายการใหม่</Modal.Header>
                            <Modal.Content scrolling>
                                <Form>
                                    <Form.Field>
                                        <Icon style={style} size="large" name="box" />
                                        Application :&nbsp;<br /><br />
                                        <Dropdown className="dropdown" placeholder="All Application" closeOnChange selection options={this.props.allApp} value={this.props.selectApp} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="mail" />
                                        First Email :&nbsp;<br /><br /><Input placeholder="Email1..." width={1} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="mail" />
                                        Second Email :&nbsp;<br /><br /><Input placeholder="Email2..." width={1} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="mail" />
                                        Third Email :&nbsp;<br /><br /><Input placeholder="Email3..." width={1} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="power off" />
                                        Enable :&nbsp;<Switch
                                            onChange={this.handleChange}
                                            checked={this.state.checked}
                                            className="react-switch"
                                            id="normal-switch"
                                        />
                                    </Form.Field> </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color="green" floated="right" icon labelPosition="left" onClick={this.onClose}>
                                    <Icon name="check" />
                                    Save
                            </Button>
                                <Button color="red" icon labelPosition="left" onClick={this.onClose}>
                                    <Icon name="cancel" />
                                    Cancel
                            </Button>
                            </Modal.Actions>
                        </Modal>

                    </Segment>
                    <Segment textAlign="center" style={{ minHeight: "calc( 100vh - 230px )" }}>
                        {this.state.manage === null ?
                            <Header as="h1" icon>
                                <br />
                                <Icon size="huge" name="frown outline" />
                                <br />พบปัญหาในการค้นหา
                    </Header>
                            :
                            <Table compact >
                                <Table.Body>
                                    {this.state.manage.map((x, key) => <ManageItems />)}
                                </Table.Body>
                            </Table>
                        }
                    </Segment>
                </Segment.Group>
            </div>
        )
    }
}