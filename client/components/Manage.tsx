import React from "react"
import { Segment, Table, Icon, Header, Dropdown, Modal, Button, Input, Form, Loader } from "semantic-ui-react"
import { ManageItems } from "./ManageItems"
import "react-datepicker/dist/react-datepicker.css";
import { Log, GetEmail } from "../share/LoggerApi"
import "/css/Body.css"
import { LoggerApi, manage } from "../share/LoggerApi"
import { getApiUrl } from "../share/Configuration"
import Switch from "react-switch";
import swal from "sweetalert";
import * as EmailValidator from "email-validator";

type Props = {
    allApp: any[]
    list: GetEmail[]
    loading: boolean
    // tslint:disable-next-line:variable-name
    onAppChange: (string) => void
    // tslint:disable-next-line:variable-name
    onEmail1Change: (string) => void
    // tslint:disable-next-line:variable-name
    onEmail2Change: (string) => void
    // tslint:disable-next-line:variable-name
    onEmail3Change: (string) => void
    // tslint:disable-next-line:variable-name
    onEnableChange: (boolean) => void
    // tslint:disable-next-line:variable-name
    onDelete: (string) => void
    onNewSave: () => void
    newApp: string
    newEmail1: string
    newEmail2: string
    newEmail3: string
    newEnable: boolean
}
type State = {
    manage: GetEmail[]
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
    public componentDidMount() {
        console.log(this.props.list)
    }
    private onClose = () => {
        this.setState({ open: false })
    }
    private handleChange = (value) => {
        this.setState({ checked: value })
        this.props.onEnableChange(value)
    }
    private setApp = (_, { value }) => {
        this.props.onAppChange(value)
    }
    private handleEmail1Change = (_, { value }) => {
        this.props.onEmail1Change(value)
    }
    private handleEmail2Change = (_, { value }) => {
        this.props.onEmail2Change(value)
    }
    private handleEmail3Change = (_, { value }) => {
        this.props.onEmail3Change(value)
    }
    private onSave = () => {
        if (this.props.newApp === null) {
            swal({
                title: "Please select application to manage.",
                timer: 1000
            })
        } else if (this.props.newEmail1 === null && this.props.newEmail2 === null && this.props.newEmail3 === null) {
            swal({
                title: "Please enter at least 1 email.",
                timer: 1000
            })
        } else if (this.props.newEmail1 !== "" && !EmailValidator.validate(this.props.newEmail1)) {
            swal({
                title: "Invalid email1 format.",
                timer: 1000
            })
        } else if (this.props.newEmail2 !== null && this.props.newEmail2 !== "" && !EmailValidator.validate(this.props.newEmail2)) {
            swal({
                title: "Invalid email2 format.",
                timer: 1000
            })
        } else if (this.props.newEmail3 !== null && this.props.newEmail3 !== "" && !EmailValidator.validate(this.props.newEmail3)) {
            swal({
                title: "Invalid email3 format.",
                timer: 1000
            })
        } else {
            this.props.onNewSave()
            this.setState({ open: false })
        }

    }
    public render() {
        let style = {
            marginLeft: "10px",
            marginRight: "10px"
        }
        let enables: boolean = false
        if (this.props.allApp == null || this.props.allApp === []) {
            enables = true
        }
        return (
            <div>
                <Segment.Group>
                    <Segment textAlign="center" inverted color="green" size="large">
                        <Header as="h2" floated="left">
                            Manage
                    </Header>
                        <Icon style={style} size="big" />
                        <Button onClick={this.onOpens} disabled={enables} color="olive" circular icon="plus" floated="right" />
                        <Modal open={this.state.open} >
                            <Modal.Header>เพิ่มรายการใหม่</Modal.Header>
                            <Modal.Content scrolling>
                                <Form>
                                    <Form.Field>
                                        <Icon style={style} size="large" name="box" />
                                        Application :&nbsp;<br /><br />
                                        <Dropdown className="dropdown" placeholder="All Application" closeOnChange selection options={this.props.allApp} onChange={this.setApp} value={this.props.newApp} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="mail" />
                                        First Email :&nbsp;<br /><br /><Input placeholder="Email1..." width={1} onChange={this.handleEmail1Change} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="mail" />
                                        Second Email :&nbsp;<br /><br /><Input placeholder="Email2..." width={1} onChange={this.handleEmail2Change} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="mail" />
                                        Third Email :&nbsp;<br /><br /><Input placeholder="Email3..." width={1} onChange={this.handleEmail3Change} />
                                    </Form.Field>    <Form.Field>
                                        <Icon style={style} size="large" name="power off" />
                                        Enable :&nbsp;<br /><br /><Switch
                                            onChange={this.handleChange}
                                            checked={this.state.checked}
                                            className="react-switch"
                                            id="normal-switch"
                                        />
                                    </Form.Field> </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button color="green" floated="right" icon labelPosition="left" onClick={this.onSave}>
                                    <Icon name="save" />
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
                        {this.props.loading ?
                            <Loader content="Loading" active={this.props.loading} />
                            :
                            <div className="loglist" style={{ width: "100%" }}>
                                <Table compact>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell width={4} textAlign="center">Application</Table.HeaderCell>
                                            <Table.HeaderCell width={3} textAlign="center">Email1</Table.HeaderCell>
                                            <Table.HeaderCell width={3} textAlign="center">Email2</Table.HeaderCell>
                                            <Table.HeaderCell width={3} textAlign="center">Email3</Table.HeaderCell>
                                            <Table.HeaderCell textAlign="center">Status</Table.HeaderCell>
                                            <Table.HeaderCell width={3} textAlign="center">Manage</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {this.props.list.map((x, key) => <ManageItems onDelete={this.props.onDelete} list={x} key={key} />)}
                                    </Table.Body>
                                </Table>
                            </div>
                        }

                    </Segment>
                </Segment.Group>
            </div>
        )
    }
}