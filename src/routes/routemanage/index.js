import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { GifButton, MenuButton } from 'components'
import { LocaleProvider, Form, Row, Col, Button, Input, Modal, Select, Radio, message, Table, DatePicker, Divider, Pagination, Badge, Switch } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const FormItem = Form.Item;
const confirm = Modal.confirm
const { TextArea } = Input;

class Routemanage extends Component {
    constructor(props) {
        super(props);
        this.Query = this.Query.bind(this);
        this.Reset = this.Reset.bind(this);
        this.newlyBuild = this.newlyBuild.bind(this);
        this.handleSwitch = this.handleSwitch.bind(this);
        this.Delete = this.Delete.bind(this);
        this.Deletefalse = this.Deletefalse.bind(this);
        this.Update = this.Update.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.checkCode = this.checkCode.bind(this);
        this.state = {
            title: true,
            Newlybuildvisible: false,
            Selectchangevalue: '',
            Taketimevalue: '',
            Invalidtimevalue: '',
            Updatevisible: false,
            sortedInfo: null,
            filteredInfo: null,
            formValues: {},
            Tablevisible: false,
            Deletevisible: false,
            Switchvalue: true,
            checkupdateList: {},
            checksw: false,
            checksel: false,
        }
    }
    componentDidMount() {
        this.props.dispatch({
            type: 'routemanage/getTableList',
            payload: {
                page: 1,
                pageSize: 10,
                appId: '',
                routeName: '',
                routeUri: '',
            }
        })
        this.setState({
            Tablevisible: true,
        })
    }
    //查询
    Query() {
        const rName = this.props.form.getFieldValue("rName");
        const routeUrl = this.props.form.getFieldValue("routeUrl");
        this.props.dispatch({
            type: 'routemanage/getTableList',
            payload: {
                page: 1,
                pageSize: 10,
                appId: '',
                routeName: rName || '',
                routeUri: routeUrl || '',
            }
        })
        this.setState({
            Tablevisible: true,
        })
    }
    //重置
    Reset() {
        this.props.form.resetFields(['rName']);
        this.props.form.resetFields(['routeUrl']);
        this.props.dispatch({
            type: 'routemanage/getTableList',
            payload: {
                page: 1,
                pageSize: 10,
                appId: '',
                routeName: '',
                routeUri: '',
            }
        })
    }
    //新建
    newlyBuild() {
        this.props.form.resetFields();
        this.setState({
            title: true,
            Newlybuildvisible: true,
        })
    }
    //路由类型
    handleChange(e) {
        const select = JSON.parse(e);
        this.setState({
            Selectchangevalue: select.dictName,
            checksel: true
        })
    }
    //新建/系统类型下拉框值
    // getDropdown() {
    //     const array = this.props.routemanage.getSelList
    //     const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}` }));
    //     if (select_list.length > 0) {
    //         return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name}>{k.dict_Name}</Option>)
    //     }
    //     return null;
    // }
    //保存
    handleOk = (e) => {
        const routeCode = this.props.form.getFieldValue("routeCode");
        const routeName = this.props.form.getFieldValue("routeName");
        const routeUri = this.props.form.getFieldValue("routeUri");
        const routeDesc = this.props.form.getFieldValue("routeDesc");
        const routeParam = this.props.form.getFieldValue("routeParam");
        const routeModel = this.props.form.getFieldValue("routeModel");
        const routeComponent = this.props.form.getFieldValue("routeComponent");
        const only = this.props.routemanage.onlychecklist.flag
        //默认
        const routeStatus = (this.state.title || this.props.routemanage.checkupdateList.routeStatus === '0') == true ? 0 : 1
        const routeSelect = this.props.routemanage.checkupdateList.routeParam
        this.props.form.validateFields((error) => {
            if (!error) {
                if (this.state.Newlybuildvisible) {
                    this.props.dispatch({
                        type: 'routemanage/newTableList',
                        payload: {
                            routeId: '',
                            routeCode: routeCode || '',
                            routeName: routeName || '',
                            routeUri: routeUri || '',
                            routeParam: routeParam || '',
                            routeModel: routeModel || '',
                            routeComponent: routeComponent || '',
                            routeswitch: this.state.checksw == true ? this.state.Switchvalue : routeStatus,
                            routeDesc: routeDesc || '',
                        }
                    })
                }
                if (this.state.Updatevisible) {
                    this.props.dispatch({
                        type: 'routemanage/updTableList',
                        payload: {
                            routeId: this.props.routemanage.checkupdateList.routeId,
                            routeCode: routeCode || '',
                            routeName: routeName || '',
                            routeUri: routeUri || '',
                            routeParam: routeParam || '',
                            routeModel: routeModel || '',
                            routeComponent: routeComponent || '',
                            routeswitch: this.state.checksw == true ? this.state.Switchvalue : routeStatus,
                            routeDesc: routeDesc || '',
                        }
                    })
                }
                this.props.dispatch({
                    type: 'routemanage/getTableList',
                    payload: {
                        page: 1,
                        pageSize: 10,
                        appId: '',
                        routeName: '',
                    }
                })
                this.props.dispatch({
                    type: 'routemanage/updateList',
                    payload: {
                        checkupdateList: {}
                    }
                })
                this.setState({
                    Newlybuildvisible: false,
                    Updatevisible: false,
                    Selectchangevalue: '',
                    Taketimevalue: '',
                    Invalidtimevalue: '',
                    Tablevisible: true,
                    checksel: false,
                })
            } else {
                message.error('操作失败')
            }
        })
    }
    handleCancel = (e) => {
        this.props.dispatch({
            type: 'routemanage/updateList',
            payload: {
                checkupdateList: {}
            }
        })
        this.setState({
            Newlybuildvisible: false,
            Updatevisible: false,
            Taketimevalue: '',
            Invalidtimevalue: '',
            Selectchangevalue: '',
        })
    }
    //新建/是否开通应用系统开关选择
    handleSwitch(e) {
        const Switchvalue = e == true ? 0 : 1
        this.setState({
            Switchvalue: Switchvalue,
            checksw: true
        })
    }
    //删除
    Delete(record) {
        const routeid = Number(record.routeId)
        const { dispatch } = this.props
        const rName = this.props.form.getFieldValue("rName");
        const routeUrl = this.props.form.getFieldValue("routeUrl");
        confirm({
            title: '确定删除吗?',
            okText: "是",
            cancelText: "否",
            onOk() {
                dispatch({
                    type: 'routemanage/delTableList',
                    payload: {
                        routeId: routeid,
                    }
                })
                dispatch({
                    type: 'routemanage/getTableList',
                    payload: {
                        page: 1,
                        pageSize: 10,
                        routeName: '',
                        routeUri: '',
                    }
                })
            },
        })
    }
    Deletefalse(record) {
        Modal.warning({
            title: '路由已绑定无法删除!',
            okText: "取消",
        });
    }
    //编辑
    Update(record) {
        this.props.form.resetFields();
        this.props.dispatch({
            type: 'routemanage/updTable',
            payload: {
                routeId: record.routeId
            }
        })
        this.setState({
            title: false,
            Updatevisible: true,
        })
    }
    checkCode(e) {
        const code = this.props.form.getFieldValue("routeCode");
        if ((this.state.Newlybuildvisible && code && code.length > 0) || (this.state.Updatevisible && (code != this.props.routemanage.checkupdateList.routeCode))) {
            this.props.dispatch({
                type: 'routemanage/onlyCheck',
                payload: {
                    value: code,
                }
            }).then(() => {
                if (this.props.routemanage.onlychecklist.flag == true) {
                    this.props.form.resetFields(['routeCode']);
                }
            })
        }
    }
    getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
    render() {
        const { getFieldDecorator, resetFields } = this.props.form;
        let { sortedInfo, filteredInfo } = this.state
        const formItemLayout = {
            labelCol: { span: 7 },
            wrapperCol: { span: 12 },
        }
        sortedInfo = sortedInfo || {}
        filteredInfo = filteredInfo || {}
        //获取功能集合
        const funclist = this.props.app.funcList
        const columns = [
            {
                title: '路由名称',
                dataIndex: 'routeName',
                key: 'routeName',
                width: '250px'
            }, {
                title: '路由地址',
                dataIndex: 'routeUri',
                key: 'routeUri',
            }, {
                title: '更新时间',
                dataIndex: 'lastUpdateTime',
                key: 'lastUpdateTime',
            }, {
                title: '操作',
                render: (text, record) => {
                    if (record.uriCheck == false) {
                        return (
                            <span>
                                <a onClick={() => this.Delete(record)}><MenuButton FuncListBtn={funclist} btnCode="100502" btnText="删除" /></a><Divider type="vertical" />
                                <a onClick={() => this.Update(record)}><MenuButton FuncListBtn={funclist} btnCode="100503" btnText="编辑" /></a>
                            </span>
                        )
                    } else {
                        return (
                            <span>
                                <a onClick={() => this.Deletefalse(record)}><MenuButton FuncListBtn={funclist} btnCode="100502" btnText="删除" /></a><Divider type="vertical" />
                                <a onClick={() => this.Update(record)}><MenuButton FuncListBtn={funclist} btnCode="100503" btnText="编辑" /></a>
                            </span>
                        )
                    }
                }
            },
        ]
        const {
            routemanage: {
                pagination, formValues,
            },
        } = this.props
        const paginationProps = {
            showSizeChanger: true,
            showQuickJumper: true,
            ...pagination,
        }
        const handleTableChange = (pagination, filtersArg, sorter) => {
            const { dispatch } = this.props
            const filters = Object.keys(filtersArg).reduce((obj, key) => {
                const newObj = { ...obj }
                newObj[key] = this.getValue(filtersArg[key])
                return newObj
            }, {})
            const params = {
                rName: this.props.form.getFieldValue("rName"),
                routeUrl: this.props.form.getFieldValue("routeUrl"),
                page: pagination.current,
                pageSize: pagination.pageSize,
                ...formValues,
                ...filters,
            }
            if (sorter.field) {
                params.sorter = `${sorter.field}_${sorter.order}`
            }
            dispatch({
                type: 'routemanage/updateState',
                payload: {
                    formValues: { ...formValues, ...filters },
                },
            })
            dispatch({
                type: 'routemanage/getTableList',
                payload: params,
            })
        }
        return (
            <LocaleProvider locale={zhCN}>
                <div className={styles.divbackground}>
                    <Row>
                        <Form layout="inline" style={{ textAlign: 'left' }}>
                            <FormItem label="路由名称：" >
                                {getFieldDecorator('rName', {
                                })(<Input placeholder="请输入" style={{ float: 'left' }} />)}
                            </FormItem>
                            <FormItem label="路由地址：" >
                                {getFieldDecorator('routeUrl', {
                                })(<Input placeholder="请输入" style={{ float: 'left' }} />)}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" onClick={this.Query} loading={this.props.loading.effects['routemanage/getTableList']}>查询</Button>
                            </FormItem>
                            <FormItem>
                                <Button onClick={this.Reset}>重置</Button>
                            </FormItem>
                        </Form>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col span={6}>
                            <GifButton FuncListBtn={funclist} onBtnClick={() => this.newlyBuild()} btnCode="100501" btnType="primary" btnIcon="plus" btnText="新建" />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col span={24}>
                            <Table
                                rowKey={record => record.routeCode}
                                style={{ paddingLeft: '0px' }}
                                bordered
                                simple
                                fixed
                                columns={columns}
                                dataSource={this.props.routemanage.list}
                                pagination={paginationProps}
                                onChange={handleTableChange}
                                loading={this.props.loading.effects['routemanage/getTableList']}
                            />
                        </Col>
                    </Row>
                    <br />
                    {(this.state.Newlybuildvisible || this.state.Updatevisible) ?
                        <Modal
                            title={this.state.title ? '新建' : '编辑'}
                            visible={this.state.Newlybuildvisible || this.state.Updatevisible}
                            onCancel={this.handleCancel}
                            maskClosable={false}
                            width={750}
                            footer={[
                                <Row key={this.state.title} style={{ textAlign: 'right' }}>
                                    <Button key="qx" onClick={this.handleCancel}>取消</Button>
                                    <Button key="bc" type="primary" onClick={this.handleOk}>保存</Button>
                                </Row>
                            ]}
                        >
                            <Form layout="horizontal">
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="路由名称：">
                                            {getFieldDecorator('routeName', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeName,
                                                rules: [{
                                                    required: true,
                                                    validator: (rule, value, callback) => {
                                                        if ((!(/^[A-Za-z0-9\u4e00-\u9fa5]+$/.test(value))) || (value && value.length > 30)) {
                                                            callback('数字字母汉字,长度不超过30')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }, { required: true, message: '此项不能为空' }]
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="路由地址：">
                                            {getFieldDecorator('routeUri', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeUri,
                                                rules: [{
                                                    required: true,
                                                    validator: (rule, value, callback) => {
                                                        if (!(/^[A-Za-z\/]+$/.test(value)) || (value && value.length > 50)) {
                                                            callback('只能输入字母和/,长度不超过50')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }, { required: true, message: "此项不能为空" }]
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="路由编码：">
                                            {getFieldDecorator('routeCode', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeCode,
                                                rules: [{
                                                    required: true,
                                                    validator: (rule, value, callback) => {
                                                        if (!(/^[^\u4e00-\u9fa5]{0,}$/.test(value)) || (value && value.length > 50)) {
                                                            callback('不能输入汉字,长度不超过50')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }, { required: true, message: '此项不能为空' }]
                                            })(<Input onBlur={this.checkCode} disabled={this.state.title == false} placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="路由参数：">
                                            {getFieldDecorator('routeParam', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeParam,
                                                rules: [{
                                                    validator: (rule, value, callback) => {
                                                        if (value && value.length > 100) {
                                                            callback('长度不超过100')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }]
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="路由模型：">
                                            {getFieldDecorator('routeModel', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeModel,
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} hasFeedback label="路由组件：">
                                            {getFieldDecorator('routeComponent', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeComponent,
                                                rules: [{
                                                    required: true,
                                                    validator: (rule, value, callback) => {
                                                        if (!(/^[A-Za-z\/]+$/.test(value)) || (value && value.length > 50)) {
                                                            callback('只能输入字母和/,长度不超过50')
                                                        } else {
                                                            callback();
                                                        }
                                                    }
                                                }, { required: true, message: "此项不能为空" }]
                                            })(<Input placeholder="请输入" />)}
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <FormItem {...formItemLayout} label="路由状态：">
                                            {this.state.title || this.props.routemanage.checkupdateList.routeStatus === '0' ?
                                                getFieldDecorator('routeStatus')
                                                    (<Switch onChange={(e) => this.handleSwitch(e)} defaultChecked checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} />)
                                                :
                                                getFieldDecorator('routeStatus')
                                                    (<span><Switch onChange={(e) => this.handleSwitch(e)} checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} /></span>)
                                            }
                                        </FormItem>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={4}>
                                        <FormItem style={{ marginLeft: '37px' }} label="路由描述："></FormItem>
                                    </Col>
                                    <Col span={20}>
                                        <FormItem hasFeedback style={{ marginLeft: '-15px' }}>
                                            {getFieldDecorator('routeDesc', {
                                                initialValue: this.state.title ? null : this.props.routemanage.checkupdateList.routeDesc,
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
                        :
                        null
                    }
                </div >
            </LocaleProvider>
        )
    }
}

Routemanage.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ routemanage, loading, app }) => ({ routemanage, loading, app }))(Form.create()(Routemanage))
