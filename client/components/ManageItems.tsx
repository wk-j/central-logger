import React from "react"
import { Log, LogLevel, GetEmail } from "../share/LoggerApi";
import { Table, Icon, Form, Modal, Button, SemanticICONS, Input } from "semantic-ui-react"
import "moment/locale/th"
import "/css/Body.css"
import Switch from "react-switch";
import swal from "sweetalert2"

type Props = {
    list: GetEmail
    // tslint:disable-next-line:variable-name
    onDelete: (string) => void
    // tslint:disable-next-line:variable-name
    onAppEdit: (string) => void
    // tslint:disable-next-line:variable-name
    onEmail1Edit: (string) => void
    // tslint:disable-next-line:variable-name
    onEmail2Edit: (string) => void
    // tslint:disable-next-line:variable-name
    onEmail3Edit: (string) => void
    // tslint:disable-next-line:variable-name
    onEnableEdit: (boolean) => void
    onSave: () => void
    editEmail1: string
    editEmail2: string
    editEmail3: string
    editEnable: boolean
}
type State = {
    status: string
    appName: string
    showEdit: boolean
    checked: boolean
}

export class ManageItems extends React.Component<Props, State> {
    constructor(props) {
        super(props)
        this.state = {
            status: "",
            appName: "",
            showEdit: false,
            checked: this.props.list.enable
        }
    }
    private handleChange = (value) => {
    }
    public componentDidMount() {
        this.setState({ appName: this.props.list.application })
    }
    private onDelete = () => {
        // console.log(this.props.list.application)
        this.props.onDelete(this.props.list.application)
    }
    private onEdit = () => {
        this.setState({ showEdit: true })
        this.props.onAppEdit(this.props.list.application)
        this.props.onEmail1Edit(this.props.list.email_1)
        this.props.onEmail2Edit(this.props.list.email_2)
        this.props.onEmail3Edit(this.props.list.email_3)
        this.props.onEnableEdit(this.props.list.enable)
    }
    private onClose = () => {
        if (this.props.editEmail1 !== this.props.list.email_1 || this.props.editEmail2 !== this.props.list.email_2 || this.props.editEmail3 !== this.props.list.email_3 || this.props.editEnable !== this.props.list.enable) {
            swal({
                title: "คุณต้องการบันทึกหรือไม่?",
                text: "พบการเปลี่ยนแปลงของข้อมูล",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Save"
            }).then((result) => {
                if (result.value) {
                    this.props.onSave()
                    this.setState({ showEdit: false })
                } else {
                    this.setState({ showEdit: false })
                    this.props.onAppEdit(null)
                }
            })
        } else {
            this.setState({ showEdit: false })
            this.props.onAppEdit(null)
        }
    }
    private handleEmail1Edit = (_, { value }) => {
        this.props.onEmail1Edit(value)
    }
    private handleEmail2Edit = (_, { value }) => {
        this.props.onEmail2Edit(value)
    }
    private handleEmail3Edit = (_, { value }) => {
        this.props.onEmail3Edit(value)
    }
    private haddleEnableEdit = (value) => {
        this.setState({ checked: value })
        this.props.onEnableEdit(value)
    }
    private onSave = () => {
        this.props.onSave()
        this.setState({ showEdit: false })
    }
    public render() {
        let status: SemanticICONS = "circle"
        switch (this.props.list.enable) {
            case true:
                status = "bell outline"
                break
            case false:
                status = "bell slash outline"
                break
        }
        let style = {
            marginLeft: "10px",
            marginRight: "10px"
        }
        return (
            this.props.list !== undefined ?
                <Table.Row>
                    <Table.Cell >{this.props.list.application}</Table.Cell>
                    <Table.Cell >{this.props.list.email_1}</Table.Cell>
                    <Table.Cell >{this.props.list.email_2}</Table.Cell>
                    <Table.Cell >{this.props.list.email_3}</Table.Cell>
                    <Table.Cell textAlign="center"><Icon name={status} /></Table.Cell>
                    <Table.Cell textAlign="center">
                        <div>
                            <Button circular icon="pencil" color="green" onClick={this.onEdit} />
                            <Modal open={this.state.showEdit} >
                                <Modal.Header>แก้ไขรายการ {this.props.list.application}</Modal.Header>
                                <Modal.Content scrolling>
                                    <Form>
                                        <Form.Field>
                                            <Icon style={style} size="large" name="box" />
                                            Application :&nbsp;<br /><br />
                                            <Input disabled width={1} defaultValue={this.props.list.application} />
                                        </Form.Field>    <Form.Field>
                                            <Icon style={style} size="large" name="mail" />
                                            First Email :&nbsp;<br /><br /><Input placeholder="Email1..." onChange={this.handleEmail1Edit} width={1} defaultValue={this.props.list.email_1} />
                                        </Form.Field>    <Form.Field>
                                            <Icon style={style} size="large" name="mail" />
                                            Second Email :&nbsp;<br /><br /><Input placeholder="Email2..." onChange={this.handleEmail2Edit} width={1} defaultValue={this.props.list.email_2} />
                                        </Form.Field>    <Form.Field>
                                            <Icon style={style} size="large" name="mail" />
                                            Third Email :&nbsp;<br /><br /><Input placeholder="Email3..." width={1} onChange={this.handleEmail3Edit} defaultValue={this.props.list.email_3} />
                                        </Form.Field>    <Form.Field>
                                            <Icon style={style} size="large" name="power off" />
                                            Enable :&nbsp;<br /><br /><Switch
                                                onChange={this.haddleEnableEdit}
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
                            <Button circular icon="trash alternate" color="red" onClick={this.onDelete} />
                        </div>
                    </Table.Cell>
                </Table.Row>
                :
                <div>No Data</div>
        )
    }
}