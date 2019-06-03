import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import classnames from 'classnames';
import { Button, Select, Form, Table, message, Input, Row, Col, Tree, Switch, Modal, Menu, Icon, Card, Divider } from 'antd';
import { arrayToTree, queryArray } from 'utils';
import moment from 'moment'
import lodash from 'lodash'
import zhCN from 'antd/lib/locale-provider/zh_CN';

const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm
const FormItem = Form.Item;
const { TextArea } = Input;

class Secdict extends Component {
    constructor(props) {
        super(props);
        this.onSelect = this.onSelect.bind(this);
        this.onRightClick = this.onRightClick.bind(this);
        this.Add = this.Add.bind(this);
        this.Update = this.Update.bind(this);
        this.Delete = this.Delete.bind(this);
        this.handleSwitchStatus = this.handleSwitchStatus.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.state = {
            Rightvisible: false,
            Tempstyle: {},
            Rightkeyvalue: {},
            title: true,
            Newlybuildvisible: false,
            Updatevisible: false,
            treeData: [],
            rightcheck: '',
            rightcheckleaf: '',
            Switchvaluestatus: '',
            checkswstatus: false,
            Selectchangevalue: '',
            checkselect: false,
            tableshow: true
        }
    }
    handleSwitchStatus(e) {
        this.setState({
            Switchvaluestatus: e,
            checkswstatus: true
        })
    }
    onRightClick(e) {
        const left = e.event.pageX
        const top = e.event.pageY
        this.setState({
            rightcheck: e.node.props.eventKey,
            rightcheckleaf: e.node.props.isLeaf,
            Rightvisible: true,
            Tempstyle: {
                position: 'fixed',
                top: `${top}px`,
                left: `${left}px`,
                width: '110px',
                background: '#F0F0F0',
            },
            Rightkeyvalue: {
                id: e.node.props.eventKey,
                name: e.node.props.title
            },
        })
        document.onclick = function () {
            this.setState({
                Rightvisible: false,
            })
        }.bind(this)

    }
    Add(record, e) {
        this.setState({
            title: true,
            Newlybuildvisible: true,
        })
    }
    Update(record, e) {
        this.setState({
            title: false,
            Updatevisible: true,
        })
        if (this.state.rightcheckleaf == false) {
            this.props.dispatch({
                type: 'secdict/SecdictLoadType',
                payload: {
                    dictId: e.id
                }
            })
        } else {
            this.props.dispatch({
                type: 'secdict/SecdictLoad',
                payload: {
                    dictId: e.id
                }
            })
        }
    }
    Delete(record, e) {
        const { dispatch } = this.props
        const del = this.state.rightcheckleaf
        confirm({
            title: '确定删除吗?',
            okText: "是",
            cancelText: "否",
            onOk() {
                if (del == false) {
                    dispatch({
                        type: 'secdict/SecdictDeltype',
                        payload: {
                            dictId: e.id,
                        }
                    })
                } else {
                    dispatch({
                        type: 'secdict/SecdictDel',
                        payload: {
                            dictId: e.id,
                        }
                    })
                }
            },
        })
    }
    handleCancel = (e) => {
        this.setState({
            Newlybuildvisible: false,
            Updatevisible: false,
        })
        this.props.dispatch({
            type: 'secdict/updateList',
            payload: {
                updatelistone: {}
            }
        })
        this.props.dispatch({
            type: 'secdict/SecdictLoad',
            payload: {
                updatelisttwo: {}
            }
        })

    }
    handleOk = (e) => {
        //字典
        const systemId = this.props.form.getFieldValue("systemId");
        const dictCode = this.props.form.getFieldValue("dictCode");
        const dictName = this.props.form.getFieldValue("dictName");
        const dictOrder = this.props.form.getFieldValue("dictOrder");
        const dictTypeDesc = this.props.form.getFieldValue("dictTypeDesc");
        const only = this.props.secdict.onlychecklist.flag
        //字典项
        const dictValue = this.props.form.getFieldValue("dictValue");
        const dictTypeId = this.props.form.getFieldValue("dictTypeId");
        this.props.form.validateFields((error) => {
            if (!error) {
                if (this.state.Newlybuildvisible) {
                    if (this.state.Newlybuildvisible && this.state.rightcheck == '#') {
                        this.props.dispatch({
                            type: 'secdict/SecdictAddType',
                            payload: {
                                dictId: '',
                                dictCode: dictCode || '',
                                dictName: dictName || '',
                                dictStatus: this.state.checkswstatus == true ? this.state.Switchvaluestatus : false,
                                dictOrder: dictOrder || '',
                                dictTypeDesc: dictTypeDesc || '',
                            }
                        })
                    } else {
                        this.props.dispatch({
                            type: 'secdict/SecdictAddDict',
                            payload: {
                                dictId: '',
                                dictValue: dictValue || '',
                                dictName: dictName || '',
                                status: this.state.checkswstatus == true ? this.state.Switchvaluestatus : false,
                                dictOrder: dictOrder || '',
                                dictDesc: dictTypeDesc || '',
                                dictTypeId: this.state.rightcheck,
                            }
                        })
                    }
                }
                if (this.state.Updatevisible) {
                    if (this.state.rightcheckleaf == false) {
                        this.props.dispatch({
                            type: 'secdict/SecdictTypeSave',
                            payload: {
                                dictId: this.props.secdict.updatelistone.dictId,
                                dictCode: dictCode || '',
                                dictName: dictName || '',
                                dictStatus: this.state.checkswstatus == true ? this.state.Switchvaluestatus : this.props.secdict.updatelistone.dictStatus,
                                dictTypeDesc: dictTypeDesc || '',
                                dictTypeOrder: dictOrder || ''
                            }
                        })
                    } else {
                        this.props.dispatch({
                            type: 'secdict/SecdictSave',
                            payload: {
                                dictId: this.props.secdict.updatelisttwo.dictId,
                                dictName: dictName || '',
                                dictValue: dictValue || '',
                                status: this.state.checkswstatus == true ? this.state.Switchvaluestatus : this.props.secdict.updatelisttwo.status,
                                dictOrder: dictOrder || '',
                                dictDesc: dictTypeDesc || '',
                                dictTypeId: this.props.secdict.updatelisttwo.dictTypeId
                            }
                        })
                    }
                }
                this.props.dispatch({
                    type: 'secdict/updateList',
                    payload: {
                        updatelistone: {}
                    }
                })
                this.props.dispatch({
                    type: 'secdict/SecdictLoad',
                    payload: {
                        updatelisttwo: {}
                    }
                })
                this.setState({
                    Newlybuildvisible: false,
                    Updatevisible: false,
                })
            } else {
                message.error('操作失败')
            }
        })

    }
    onSelect(e, selectedKeys) {
        const Se = String(e)
        if (selectedKeys.node.props.isLeaf == true) {
            this.props.dispatch({
                type: 'secdict/SecdictDictInfo',
                payload: {
                    dictId: Se
                }
            })
            this.setState({
                tableshow: false
            })
        } else {
            this.props.dispatch({
                type: 'secdict/SecdictTreeDict',
                payload: {
                    dictTypeId: Se
                }
            })
            this.props.dispatch({
                type: 'secdict/SecdictDictTypeInfo',
                payload: {
                    dictId: Se
                }
            })
            this.setState({
                tableshow: true
            })
        }
    }
    onLoadData = (treeNode) => {
        this.props.dispatch({
            type: 'secdict/getTreeTypeSon',
            payload: {
                dictTypeId: treeNode.props.eventKey
            }
        })
        return new Promise((resolve) => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            setTimeout(() => {
                treeNode.props.dataRef.children = this.props.secdict.getTrListson
                this.setState({
                    treeData: this.props.secdict.getTrList,
                });
                resolve();
            }, 1000);
        });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.title} key={item.key} isLeaf={item.isLeaf} dataRef={item} />;
        });
    }
    checkCode(e) {
        const code = this.props.form.getFieldValue("dictCode");
        if ((this.state.Newlybuildvisible && code) || (this.state.Updatevisible && (code != this.props.secdict.updatelistone.dictCode))) {
            this.props.dispatch({
                type: 'secdict/onlyCheck',
                payload: {
                    value: code,
                }
            }).then(() => {
                if (this.props.secdict.onlychecklist.flag == true) {
                    this.props.form.resetFields(['dictCode']);
                }
            })
        }
    }

    render() {
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        }
        const { getFieldDecorator, resetFields } = this.props.form;
        //获取功能集合
        const funclist = this.props.app.funcList
        //鼠标右键功能键
        const menuAdd = funclist.map((item, key) => (item.funcCode === "101001" && item.isRole === true ? <Menu.Item key='101001'><a onClick={(record) => this.Add(record, this.state.Rightkeyvalue)}><Icon type="plus-circle" />新增</a></Menu.Item> : null))
        const menuAdd1 = funclist.map((item, key) => (item.funcCode === "101002" && item.isRole === true ? <Menu.Item key='101002'><a onClick={(record) => this.Add(record, this.state.Rightkeyvalue)}><Icon type="plus-circle" />新增</a></Menu.Item> : null))
        const menuUpdate = funclist.map((item, key) => (item.funcCode === "101003" && item.isRole === true ? <Menu.Item key='101003'><a onClick={(record) => this.Update(record, this.state.Rightkeyvalue)}><Icon type="edit" />修改</a></Menu.Item> : null))
        const menuUpdate1 = funclist.map((item, key) => (item.funcCode === "101004" && item.isRole === true ? <Menu.Item key='101004'><a onClick={(record) => this.Update(record, this.state.Rightkeyvalue)}><Icon type="edit" />修改</a></Menu.Item> : null))
        const menuRemove = funclist.map((item, key) => (item.funcCode === "101005" && item.isRole === true ? <Menu.Item key='101005'><a onClick={(record) => this.Delete(record, this.state.Rightkeyvalue)}><Icon type="close-circle" />删除</a></Menu.Item> : null))
        const menuRemove1 = funclist.map((item, key) => (item.funcCode === "101006" && item.isRole === true ? <Menu.Item key='101006'><a onClick={(record) => this.Delete(record, this.state.Rightkeyvalue)}><Icon type="close-circle" />删除</a></Menu.Item> : null))
        const columns = [
            {
                title: '字典名称',
                dataIndex: 'dictName',
                key: 'dictName',
                width: '25%'
            }, {
                title: '字典标识',
                dataIndex: 'dictValue',
                key: 'dictValue',
                width: '25%'
            }, {
                title: '字典状态',
                dataIndex: 'status',
                key: 'status',
                width: '25%',
                render: (text) => {
                    if (text == '1') {
                        return "可用"
                    } else if (text == '0') {
                        return "不可用"
                    }
                }
            }, {
                title: '字典描述',
                dataIndex: 'dictDesc',
                key: 'dictDesc',
                width: '25%'
            }
        ]
        return (
            <div className={styles.divbackground}>
                <Row>
                    <Col span={8}>
                        <div style={{overflow: 'auto', width:'100%', height: '450px'}}>
                            <Tree
                                showLine
                                defaultExpandedKeys={['#']}
                                onSelect={this.onSelect}
                                loadData={this.onLoadData}
                                onRightClick={this.onRightClick}
                                allowClear={false}
                            >
                                <TreeNode title="字典树" key="#" isLeaf={false}>
                                    {this.renderTreeNodes(this.props.secdict.getTrList)}
                                </TreeNode>
                            </Tree>
                        </div>
                    </Col>
                    <Col span={16}>
                        <p className={styles.styletabletop}>字典(项)信息</p>
                        <table className={styles.table}>
                            <tbody>
                                <tr className={styles.trtd}>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典名称：</label>{this.props.secdict.typeinfo.dictName != undefined ? this.props.secdict.typeinfo.dictName : this.props.secdict.dictinfo.dictName}<span style={{ marginLeft: '20px' }}></span></p></td>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典编码：</label>{this.props.secdict.typeinfo.dictName != undefined ? this.props.secdict.typeinfo.dictCode : this.props.secdict.dictinfo.dictValue}<span style={{ marginLeft: '20px' }}></span></p></td>
                                </tr>
                                <tr className={styles.trtd}>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典状态：</label>{this.props.secdict.typeinfo.dictName != undefined ? (this.props.secdict.typeinfo.dictStatus == 1 ? '可用' : null || this.props.secdict.typeinfo.dictStatus == 0 ? '不可用' : null) : (this.props.secdict.dictinfo.status == 1 ? '可用' : null || this.props.secdict.dictinfo.status == 0 ? '不可用' : null)}<span style={{ marginLeft: '20px' }}></span></p></td>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典描述：</label>{this.props.secdict.typeinfo.dictName != undefined ? this.props.secdict.typeinfo.dictTypeDesc : this.props.secdict.dictinfo.dictTypeDesc}<span style={{ marginLeft: '20px' }}></span></p></td>
                                </tr>
                            </tbody>
                        </table>
                        {this.state.tableshow == true ?
                            <p className={styles.styletabletop}>字典列表</p>
                            : null
                        }
                        {this.state.tableshow == true ?
                            <Table
                                rowKey="dictCode"
                                style={{ paddingLeft: '0px', paddingTop: '10px' }}
                                bordered
                                simple
                                fixed
                                columns={columns}
                                dataSource={this.props.secdict.treedict}
                                pagination={false}
                                scroll={{ y: 260 }}
                            />
                            : null
                        }
                    </Col>
                </Row>
                <Menu
                    visible={this.state.Rightvisible}
                    style={this.state.Tempstyle}
                >
                    {this.state.rightcheckleaf == false ?
                        this.state.rightcheck == '#' ?
                            // < Menu.Item key="1">
                            //     <a onClick={(record) => this.Add(record, this.state.Rightkeyvalue)}><Icon type="plus-circle" />新增</a>
                            // </Menu.Item>
                            menuAdd
                            :
                            menuAdd1
                        : null
                    }
                    {this.state.rightcheck != '#' ?
                        this.state.rightcheckleaf == false ?
                            // <Menu.Item key="2">
                            //     <a onClick={(record) => this.Update(record, this.state.Rightkeyvalue)}><Icon type="edit" />修改</a>
                            // </Menu.Item>
                            menuUpdate
                            :
                            menuUpdate1
                        : null
                    }
                    {this.state.rightcheck != '#' ?
                        this.state.rightcheckleaf == false ?
                            // <Menu.Item key="3">
                            //     <a onClick={(record) => this.Delete(record, this.state.Rightkeyvalue)}><Icon type="close-circle" />删除</a>
                            // </Menu.Item>
                            menuRemove
                            :
                            menuRemove1
                        : null
                    }
                </Menu>
                {
                    (this.state.Newlybuildvisible || this.state.Updatevisible) ?
                        <Modal
                            title={this.state.title ? '新建' : '编辑'}
                            visible={this.state.Newlybuildvisible || this.state.Updatevisible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            width={750}
                            footer={[
                                <Row style={{ textAlign: 'right' }}>
                                    <Button key="qx" onClick={this.handleCancel}>取消</Button>
                                    <Button key="bc" type="primary" onClick={this.handleOk}>保存</Button>
                                </Row>
                            ]}
                        >
                            <Form layout="horizontal">
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="字典名称：">
                                            {getFieldDecorator('dictName', {
                                                initialValue: this.state.title ? null : (this.props.secdict.updatelistone.dictName || this.props.secdict.updatelisttwo.dictName),
                                                rules: [{
                                                    required: true,
                                                    validator: (rule, value, callback) => {
                                                        if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) || (value && value.length > 30)) {
                                                            callback('只能输入数字字母汉字,长度不超过30')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }, { required: true, message: '此项不能为空' }]
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                    {(this.state.title == true && this.state.rightcheck == '#') || (this.state.title == false && this.state.rightcheck != '#' && this.state.rightcheckleaf == false) ?
                                        <Col span={12}>
                                            <FormItem {...formItemLayout} hasFeedback label="字典编码：">
                                                {getFieldDecorator('dictCode', {
                                                    initialValue: this.state.title ? null : (this.props.secdict.updatelistone.dictCode || this.props.secdict.updatelisttwo.dictCode),
                                                    rules: [{
                                                        required: true,
                                                        validator: (rule, value, callback) => {
                                                            if (!(/^[^\u4e00-\u9fa5]{0,}$/.test(value)) || (value && value.length > 50)) {
                                                                callback('不能输入汉字,长度不超过50')
                                                            } else {
                                                                callback();
                                                            }
                                                        }
                                                    }, { required: true, message: "此项不能为空" }]
                                                })(<Input onBlur={this.checkCode} disabled={this.state.title == false} placeholder="请输入" />)}
                                            </FormItem>
                                        </Col>
                                        :
                                        < Col span={12}>
                                            <FormItem {...formItemLayout} hasFeedback label="字典项编码：">
                                                {getFieldDecorator('dictValue', {
                                                    initialValue: this.state.title ? null : this.props.secdict.updatelisttwo.dictValue,
                                                    rules: [{
                                                        required: true,
                                                        validator: (rule, value, callback) => {
                                                            if (!(/^[^\u4e00-\u9fa5]{0,}$/.test(value)) || (value && value.length > 50)) {
                                                                callback('不能输入汉字,长度不超过50')
                                                            } else {
                                                                callback();
                                                            }
                                                        }
                                                    }, { required: true, message: "此项不能为空" }]
                                                })(<Input onBlur={this.checkCode} disabled={this.state.title == false} placeholder="请输入" />)}
                                            </FormItem>
                                        </Col>

                                    }
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="字典顺序：">
                                            {getFieldDecorator('dictOrder', {
                                                initialValue: this.state.title ? null : (this.props.secdict.updatelistone.dictTypeOrder || this.props.secdict.updatelisttwo.dictOrder),
                                                rules: [{ required: true, message: "此项不能为空" }]
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label="字典状态：">
                                            {this.props.secdict.updatelistone.dictStatus == 1 || this.props.secdict.updatelisttwo.status == 1 ?
                                                getFieldDecorator('dictStatus')
                                                    (<Switch onChange={(e) => this.handleSwitchStatus(e)} defaultChecked checkedChildren="可用" unCheckedChildren="不可用" style={{ width: 70 }} />)
                                                :
                                                getFieldDecorator('dictStatus')
                                                    (<span><Switch onChange={(e) => this.handleSwitchStatus(e)} checkedChildren="可用" unCheckedChildren="不可用" style={{ width: 70 }} /></span>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4}>
                                        <FormItem style={{ marginLeft: '37px' }} label="字典描述："></FormItem>
                                    </Col>
                                    <Col span={20}>
                                        <FormItem hasFeedback style={{ marginLeft: '-15px' }}>
                                            {getFieldDecorator('dictTypeDesc', {
                                                initialValue: this.state.title ? null : (this.props.secdict.updatelistone.dictTypeDesc || this.props.secdict.updatelisttwo.dictTypeDesc),
                                                rules: [{
                                                    validator: (rule, value, callback) => {
                                                        if (value && value.length > 500) {
                                                            callback('长度不超过500')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }]
                                            })(<TextArea autosize={{ minRows: 3, maxRows: 6 }} placeholder="请输入" style={{ width: '526px' }} />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                        : null
                }
            </div >
        )
    }
}

Secdict.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ secdict, app, loading }) => ({ secdict, app, loading }))(Form.create()(Secdict))
