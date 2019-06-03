import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import classnames from 'classnames';
import { Button, Select, Form, Table, message, Input, Row, Col, Tree, Switch, Modal, Menu, Icon, Card, Divider } from 'antd';
import { arrayToTree, queryArray } from 'utils';
import moment from 'moment'
import lodash from 'lodash'

const TreeNode = Tree.TreeNode;
const Option = Select.Option;
const confirm = Modal.confirm
const FormItem = Form.Item;
const { TextArea } = Input;

class Treedict extends Component {
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
            tableone: false,
            Switchvaluestatus: '',
            checkswstatus: false,
            rightcheck: '',
            rightcheckleaf: '',
            selectchange: '',
            checkselect: false,
            tableshow: true
        }
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
        this.props.dispatch({
            type: 'treedict/DictTreeEdit',
            payload: {
                dictId: e.id
            }
        })
    }
    Delete(record, e) {
        const { dispatch } = this.props
        confirm({
            title: '确定删除吗?',
            okText: "是",
            cancelText: "否",
            onOk() {
                dispatch({
                    type: 'treedict/DictTreeDel',
                    payload: {
                        dictId: e.id
                    }
                })
            },
        })
    }
    handleCancel = (e) => {
        this.setState({
            Newlybuildvisible: false,
            Updatevisible: false,
        })
    }
    handleSwitchStatus(e) {
        const Switchvaluestatus = e == true ? '1' : '0'
        this.setState({
            Switchvaluestatus: Switchvaluestatus,
            checkswstatus: true
        })
    }
    handleOk = (e) => {
        const dictCode = this.props.form.getFieldValue("dictCode");
        const dictName = this.props.form.getFieldValue("dictName");
        const dictLevel = this.props.form.getFieldValue("dictLevel");
        const dictOrder = this.props.form.getFieldValue("dictOrder");
        const only = this.props.treedict.onlychecklist.flag
        //编辑默认值
        const dictStaus = this.props.treedict.updateList.dictStaus
        this.props.form.validateFields((error) => {
            if (!error) {
                if (this.state.Newlybuildvisible) {
                    this.props.dispatch({
                        type: 'treedict/DictTreeAdd',
                        payload: {
                            dictId: '',
                            dictCode: dictCode || '',
                            dictName: dictName || '',
                            dictParentId: this.state.rightcheck,
                            dictStaus: this.state.checkswstatus == true ? this.state.Switchvaluestatus : dictStaus,
                            dictLevel: '',
                            dictOrder: dictOrder || '',
                        }
                    })
                }
                if (this.state.Updatevisible) {
                    this.props.dispatch({
                        type: 'treedict/DictTreeSave',
                        payload: {
                            dictId: this.props.treedict.updateList.dictId,
                            dictCode: dictCode || '',
                            dictName: dictName || '',
                            dictParentId: this.state.rightcheck,
                            dictStaus: this.state.checkswstatus == true ? this.state.Switchvaluestatus : dictStaus,
                            dictOrder: dictOrder || '',
                        }
                    })
                }
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
                type: 'treedict/DictTreeInfo',
                payload: {
                    dictId: Se
                }
            })
            this.setState({
                tableshow: false,
            })
        } else {
            this.props.dispatch({
                type: 'treedict/DictTreeInfo',
                payload: {
                    dictId: Se
                }
            })
            this.props.dispatch({
                type: 'treedict/DictTreeTreeList',
                payload: {
                    pid: Se
                }
            })
            this.setState({
                tableshow: true
            })
        }

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
                left: `${left}px`,
                top: `${top}px`,
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
    onLoadData = (treeNode) => {
        this.props.dispatch({
            type: 'treedict/getTreeTypeSon',
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
                treeNode.props.dataRef.children = this.props.treedict.getTrListSon
                this.setState({
                    treeData: this.props.treedict.getTrList,
                });
                resolve();
            }, 1000);
        });
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.dictName} key={item.dictId} isLeaf={item.isLeaf} dataRef={item}>
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.dictName} key={item.dictId} isLeaf={item.isLeaf} dataRef={item} />;
        });
    }
    checkCode(e) {
        const code = this.props.form.getFieldValue("dictCode");
        if ((this.state.Newlybuildvisible && code && code.length > 0) || (this.state.Updatevisible && (code != this.props.treedict.updateList.dictCode))) {
            this.props.dispatch({
                type: 'treedict/onlyCheck',
                payload: {
                    value: code,
                }
            }).then(() => {
                if (this.props.treedict.onlychecklist.flag == true) {
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
        const menuAdd = funclist.map((item, key) => (item.funcCode === "101101" && item.isRole === true ? <Menu.Item key='101101'><a onClick={(record) => this.Add(record, this.state.Rightkeyvalue)}><Icon type="plus-circle" />新增</a></Menu.Item> : null))
        const menuUpdate = funclist.map((item, key) => (item.funcCode === "101102" && item.isRole === true ? <Menu.Item key='101102'><a onClick={(record) => this.Update(record, this.state.Rightkeyvalue)}><Icon type="edit" />修改</a></Menu.Item> : null))
        const menuRemove = funclist.map((item, key) => (item.funcCode === "101103" && item.isRole === true ? <Menu.Item key='101103'><a onClick={(record) => this.Delete(record, this.state.Rightkeyvalue)}><Icon type="close-circle" />删除</a></Menu.Item> : null))
        const columns = [
            {
                title: '字典名称',
                dataIndex: 'dictName',
                key: 'dictName',
                width: '25%'
            }, {
                title: '字典级别',
                dataIndex: 'dictLevel',
                key: 'dictLevel',
                width: '25%'
            }, {
                title: '字典编码',
                dataIndex: 'dictCode',
                key: 'dictCode',
                width: '25%'
            }, {
                title: '字典项状态',
                dataIndex: 'dictStatus',
                key: 'dictStatus',
                width: '25%',
                render: (text) => {
                    if (text == 'Y') {
                        return "可用"
                    } else if (text == 'N') {
                        return "不可用"
                    }
                }
            }
        ]
        return (
            <div className={styles.divbackground}>
                <Row>
                    <Col span={8}>
                        <div style={{ overflow: 'auto', width: '300px', height: '400px' }}>
                            <Tree
                                showLine
                                defaultExpandedKeys={['-1']}
                                onSelect={this.onSelect}
                                loadData={this.onLoadData}
                                onRightClick={this.onRightClick}
                                height={500}
                            >
                                <TreeNode title="字典树" key="-1" isLeaf={false}>
                                    {this.renderTreeNodes(this.props.treedict.getTrList)}
                                </TreeNode>
                            </Tree>
                        </div>
                    </Col>
                    <Col span={16}>
                        <p className={styles.styletabletop}>多级字典(项)信息</p>
                        <table className={styles.table}>
                            <tbody>
                                <tr className={styles.trtd}>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典项名称：</label>{this.props.treedict.dicttreeinfolist.dictName}<span style={{ marginLeft: '20px' }}></span></p></td>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典项编码：</label>{this.props.treedict.dicttreeinfolist.dictCode}<span style={{ marginLeft: '20px' }}></span></p></td>
                                </tr>
                                <tr className={styles.trtd}>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>字典项状态：</label>{((this.props.treedict.dicttreeinfolist.dictStaus == 'Y' || this.props.treedict.dicttreeinfolist.dictStaus == 1) ? '可用' : null || (this.props.treedict.dicttreeinfolist.dictStaus == 'N' || this.props.treedict.dicttreeinfolist.dictStaus == 0) ? '不可用' : null)}<span style={{ marginLeft: '20px' }}></span></p></td>
                                    <td className={styles.trtd}><p className={styles.pp}><label style={{ marginLeft: '50px' }}>树节点级别：</label>{this.props.treedict.dicttreeinfolist.dictLevel}<span style={{ marginLeft: '20px' }}></span></p></td>
                                </tr>
                            </tbody>
                        </table>
                        {this.state.tableshow ?
                            <p className={styles.styletabletop}>字典项列表</p>
                            : null
                        }
                        {this.state.tableshow ?
                            <Table
                                rowKey="dictCode"
                                style={{ paddingLeft: '0px', paddingTop: '10px' }}
                                bordered
                                simple
                                fixed
                                columns={columns}
                                dataSource={this.props.treedict.dicttreetreelist}
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
                    {/* <Menu.Item key="1">
                        <a onClick={(record) => this.Add(record, this.state.Rightkeyvalue)}><Icon type="plus-circle" />新增</a>
                    </Menu.Item> */}
                    {menuAdd}
                    {this.state.rightcheck != '-1' ?
                        // <Menu.Item key="2">
                        //     <a onClick={(record) => this.Update(record, this.state.Rightkeyvalue)}><Icon type="edit" />修改</a>
                        // </Menu.Item>
                        menuUpdate
                        : null
                    }
                    {this.state.rightcheck != '-1' && this.state.rightcheckleaf != false ?
                        // <Menu.Item key="3">
                        //     <a onClick={(record) => this.Delete(record, this.state.Rightkeyvalue)}><Icon type="close-circle" />删除</a>
                        // </Menu.Item>
                        menuRemove
                        : null
                    }
                </Menu>
                {(this.state.Newlybuildvisible || this.state.Updatevisible) ?
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
                                    <FormItem {...formItemLayout} hasFeedback label="参数名称：">
                                        {getFieldDecorator('dictName', {
                                            initialValue: this.state.title ? null : this.props.treedict.updateList.dictName,
                                            rules: [{
                                                required: true,
                                                validator: (rule, value, callback) => {
                                                    if (!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value)) || (value && value.length > 30)) {
                                                        callback('只能输入数字字母汉字,长度不超过30')
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }, {
                                                required: true, message: '此项不能为空'
                                            }]
                                        })(<Input placeholder="请输入" />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} hasFeedback label="参数编码：">
                                        {getFieldDecorator('dictCode', {
                                            initialValue: this.state.title ? null : this.props.treedict.updateList.dictCode,
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
                            </Row>
                            <Row>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} hasFeedback label="显示顺序：">
                                        {getFieldDecorator('dictOrder', {
                                            initialValue: this.state.title ? null : this.props.treedict.updateList.dictOrder,
                                            rules: [{
                                                required: true,
                                                validator: (rule, value, callback) => {
                                                    if (!(/^[1-9]\d*$/.test(value)) || value && value.length > 10) {
                                                        callback('只能输入数字，长度不超过10')
                                                    } else {
                                                        callback();
                                                    }
                                                }
                                            }]
                                        })(<Input placeholder="请输入" />)}
                                    </FormItem>
                                </Col>
                                <Col span={12}>
                                    <FormItem {...formItemLayout} label="字典状态：">
                                        {this.state.title || this.props.treedict.updateList.dictStaus == '1' ?
                                            getFieldDecorator('dictStaus')
                                                (<Switch onChange={(e) => this.handleSwitchStatus(e)} defaultChecked checkedChildren="可用" unCheckedChildren="不可用" style={{ width: 70 }} />)
                                            :
                                            getFieldDecorator('dictStaus')
                                                (<span><Switch onChange={(e) => this.handleSwitchStatus(e)} checkedChildren="可用" unCheckedChildren="不可用" style={{ width: 70 }} /></span>)
                                        }
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

Treedict.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ treedict, app, loading }) => ({ treedict, app, loading }))(Form.create()(Treedict))
