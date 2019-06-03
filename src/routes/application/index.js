import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { GifButton, MenuButton } from 'components'
import { LocaleProvider, Form, Row, Col, Button, Input, Modal, Select, Radio, message, Table, DatePicker, Divider, Pagination, Badge, Switch, Checkbox } from 'antd';
import moment from 'moment'
import zhCN from 'antd/lib/locale-provider/zh_CN';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm
const { TextArea } = Input;

class Application extends Component {
  constructor(props) {
    super(props);
    this.Query = this.Query.bind(this);
    this.Reset = this.Reset.bind(this);
    this.newlyBuild = this.newlyBuild.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.Delete = this.Delete.bind(this);
    this.Update = this.Update.bind(this);
    this.getDropdown = this.getDropdown.bind(this);
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
      selectedRowKeys: [],
      checkselect: false,
      startValue: null,
      endValue: null,
      endOpen: false,
      startcheck: false,
      endcheck: false,
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'application/getTableList',
      payload: {
        page: 1,
        pageSize: 10,
        appName: '',
      }
    })
    this.setState({
      Tablevisible: true,
    })
  }
  //查询
  Query() {
    const appName = this.props.form.getFieldValue("appName");
    this.props.dispatch({
      type: 'application/getTableList',
      payload: {
        page: 1,
        pageSize: 10,
        appName: appName || '',
      }
    })
    this.setState({
      Tablevisible: true,
    })
  }
  //重置
  Reset() {
    this.props.form.resetFields(['appName']);
    this.props.dispatch({
      type: 'application/getTableList',
      payload: {
        page: 1,
        pageSize: 10,
        appName: '',
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
  //保存
  handleOk = (e) => {
    const systemName = this.props.form.getFieldValue("systemName");
    const systemTalk = this.props.form.getFieldValue("systemTalk");
    const systemCode = this.props.form.getFieldValue("systemCode")
    const only = this.props.application.onlychecklist.flag
    //默认
    const appStatus = (this.state.title || this.props.application.checkupdateList.openApp === '0') == true ? 0 : 1
    this.props.form.validateFields((error) => {
      if (!error) {
        if (this.state.Newlybuildvisible) {
          this.props.dispatch({
            type: 'application/newTableList',
            payload: {
              systemName: systemName || '',
              systemType: this.state.checkselect == true ? this.state.Selectchangevalue : (this.props.application.getSelList.length > 0 ? this.props.application.getSelList[0].dictValue : ''),
              systemSwitch: this.state.checksw == true ? this.state.Switchvalue : appStatus,
              Taketimevalue: this.state.Taketimevalue,
              Invalidtimevalue: this.state.Invalidtimevalue,
              systemTalk: systemTalk || '',
              appCode: systemCode || ''
            }
          })
        }
        if (this.state.Updatevisible) {
          this.props.dispatch({
            type: 'application/updTableList',
            payload: {
              systemName: systemName || '',
              systemType: this.state.checkselect == false ? this.props.application.checkupdateList.appType : this.state.Selectchangevalue,
              systemSwitch: this.state.checksw == true ? this.state.Switchvalue : appStatus,
              Taketimevalue: this.state.startcheck == true ? this.state.Taketimevalue : this.props.application.checkupdateList.appPeffectivedate,
              Invalidtimevalue: this.state.endcheck == true ? this.state.Invalidtimevalue : this.props.application.checkupdateList.appExpiredate,
              systemTalk: systemTalk || '',
              appCode: systemCode || ''
            }
          })
        }
        this.props.dispatch({
          type: 'application/getTableList',
          payload: {
            page: 1,
            pageSize: 10,
            appName: '',
          }
        })
        this.props.dispatch({
          type: 'application/updateList',
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
          startValue: null,
          endValue: null,
        })
      } else {
        message.error('操作失败')
      }
    })
  }
  handleCancel = (e) => {
    this.props.dispatch({
      type: 'application/updateList',
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
      startValue: null,
      endValue: null,
    })
  }
  //新建/系统类型下拉框值
  getDropdown() {
    const array = this.props.application.getSelList
    const select_list = array.map(k => ({ ...k, dict_Name: `${k.dictName}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name}>{k.dict_Name}</Option>)
    }
    return null;
  }
  //新建/系统类型下拉框点击方法
  handleChange(e) {
    const select = JSON.parse(e);
    this.setState({
      Selectchangevalue: select.dictValue,
      checkselect: true
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
    const id = Number(record.appId)
    const { dispatch } = this.props
    const appName = this.props.form.getFieldValue("appName");
    confirm({
      title: '确定删除吗?',
      okText: "是",
      cancelText: "否",
      onOk() {
        dispatch({
          type: 'application/delTableList',
          payload: {
            appId: id,
          }
        })
        dispatch({
          type: 'application/getTableList',
          payload: {
            page: 1,
            pageSize: 10,
            appName: '',
          }
        })
      },
    })
  }
  //编辑
  Update(record) {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'application/updTable',
      payload: {
        appId: record.appId
      }
    })
    if (this.state.Taketimevalue == '' && this.state.Invalidtimevalue == '') {
      this.setState({
        Taketimevalue: record.appPeffectivedate,
        Invalidtimevalue: record.appExpiredate,
      })
    }
    if (this.state.Selectchangevalue == '') {
      this.setState({
        Selectchangevalue: record.appType
      })
    }
    this.setState({
      title: false,
      Updatevisible: true,
    })
  }
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }
  onStartChange = (value) => {
    const sta = value.format('YYYY-MM-DD')
    this.setState({
      Taketimevalue: sta,
      startcheck: true
    })
    this.onChange('startValue', value);
  }
  onEndChange = (value) => {
    const end = value.format('YYYY-MM-DD')
    this.setState({
      Invalidtimevalue: end,
      endcheck: true
    })
    this.onChange('endValue', value);
  }
  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }
  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }
  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  checkCode(e) {
    const code = this.props.form.getFieldValue("systemCode");
    if ((this.state.Newlybuildvisible && code && code.length > 0) || (this.state.Updatevisible && (code != this.props.application.checkupdateList.appCode))) {
      this.props.dispatch({
        type: 'application/onlyCheck',
        payload: {
          value: code,
        }
      }).then(() => {
        if (this.props.application.onlychecklist.flag == true) {
          this.props.form.resetFields(['systemCode']);
        }
      })
    }
  }
  getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

  render() {
    const dateFormat = 'YYYY-MM-DD';
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    const { getFieldDecorator, resetFields } = this.props.form;
    let { sortedInfo, filteredInfo } = this.state
    sortedInfo = sortedInfo || {}
    filteredInfo = filteredInfo || {}
    //获取功能集合
    const funclist = this.props.app.funcList
    //功能按钮组
    const addButton = funclist.map((item, key) => (item.funcCode === "100801" ? <Button key={key} type="primary" icon="plus" onClick={this.newlyBuild}>新建</Button> : null))
    const delButton = funclist.map((item, key) => (item.funcCode === "100802" ? <span key={key}>删除</span> : null))
    const updateButton = funclist.map((item, key) => (item.funcCode === "100803" ? <span key={key}>编辑</span> : null))
    const columns = [
      {
        title: '应用名称',
        dataIndex: 'appName',
        key: 'appName',
        width: '250px'
      }, {
        title: '系统编号',
        dataIndex: 'appCode',
        key: 'appCode',
      }, {
        title: '生效时间',
        dataIndex: 'appPeffectivedate',
        key: 'appPeffectivedate',
      }, {
        title: '失效时间',
        dataIndex: 'appExpiredate',
        key: 'appExpiredate',
      }, {
        title: '操作',
        dataIndex: 'cz',
        key: 'cz',
        render: (text, record) => {
          // if (record.openApp == 1) {
          if (true) {
            return (
              <span>
                <a onClick={() => this.Delete(record)}><MenuButton FuncListBtn={funclist} btnCode="100802" btnText="删除" /></a><Divider type="vertical" />
                <a onClick={() => this.Update(record)}><MenuButton FuncListBtn={funclist} btnCode="100803" btnText="编辑" /></a>
              </span>
            )
          } else {
            return (
              <span>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Divider type="vertical" />
                <a onClick={() => this.Update(record)}>编辑</a>
              </span>
            )
          }
        }
      },
      // {
      //   title: '是否开通应用系统',
      //   dataIndex: 'openApp',
      //   key: 'openApp',
      //   filteredValue: filteredInfo.openApp,
      //   onFilter: (value, record) => record.openApp.indexOf(value) === 0,
      //   sorter: (a, b) => a.openApp - b.openApp,
      //   sortOrder: sortedInfo.columnKey === 'openApp' && sortedInfo.order,
      //   filters: [
      //     {
      //       text: status[0],
      //       value: 0,
      //     },
      //     {
      //       text: status[1],
      //       value: 1,
      //     },
      //   ],
      //   render(val) {
      //     return <Badge status={statusMap[val]} text={status[val]} />
      //   },
      // },
    ]
    const {
      application: {
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
        appName: this.props.form.getFieldValue("appName"),
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
      }
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`
      }
      dispatch({
        type: 'application/updateState',
        payload: {
          formValues: { ...formValues, ...filters },
        },
      })
      dispatch({
        type: 'application/getTableList',
        payload: params,
      })
    }
    return (
      <LocaleProvider locale={zhCN}>
        <div className={styles.divbackground}>
          <Row style={{ marginLeft: '10px' }}>
            <Form layout="inline" style={{ textAlign: 'left' }}>
              <FormItem label="应用名称：" >
                {getFieldDecorator('appName', {
                })(<Input placeholder="请输入" style={{ float: 'left' }} />)}
              </FormItem>
              <FormItem>
                <Button key="cx" type="primary" onClick={this.Query} loading={this.props.loading.effects['application/getTableList']}>查询</Button>
              </FormItem>
              <FormItem>
                <Button key="cz" onClick={this.Reset}>重置</Button>
              </FormItem>
            </Form>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={6}>
              <GifButton FuncListBtn={funclist} onBtnClick={() => this.newlyBuild()} btnCode="100801" btnType="primary" btnIcon="plus" btnText="新建" />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.appCode}
                style={{ paddingLeft: '0px' }}
                bordered
                simple
                fixed
                columns={columns}
                dataSource={this.props.application.list}
                pagination={paginationProps}
                onChange={handleTableChange}
                loading={this.props.loading.effects['application/getTableList']}
              />
            </Col>
          </Row>
          <br />
          {(this.state.Newlybuildvisible || this.state.Updatevisible) ?
            <Modal
              key={this.state.title ? 1 : 2}
              title={this.state.title ? '新建' : '编辑'}
              visible={this.state.Newlybuildvisible || this.state.Updatevisible}
              onCancel={this.handleCancel}
              maskClosable={false}
              width={750}
              footer={[
                <Row key={this.state.Newlybuildvisible} style={{ textAlign: 'right' }}>
                  <Button key="qx" onClick={this.handleCancel}>取消</Button>
                  <Button key="bc" type="primary" onClick={this.handleOk}>保存</Button>
                </Row>
              ]}
            >
              <Form layout="horizontal" key={this.state.title ? 1 : 2}>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="系统名称：">
                      {getFieldDecorator('systemName', {
                        initialValue: this.state.title ? null : this.props.application.checkupdateList.appName,
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
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="系统编号：">
                      {getFieldDecorator('systemCode', {
                        initialValue: this.state.title ? null : this.props.application.checkupdateList.appCode,
                        rules: [{
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[^\u4e00-\u9fa5]{0,}$/.test(value)) || (value && value.length > 20)) {
                              callback('不能输入汉字,长度不超过20')
                            } else {
                              callback();
                            }
                          }
                        }, { required: true, message: '此项不能为空' }]
                      })(<Input onBlur={this.checkCode} disabled={this.state.title == false} placeholder="请输入" />)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="生效时间：">
                      {getFieldDecorator('takeTime', {
                        initialValue: this.state.title ? null : moment(this.props.application.checkupdateList.appPeffectivedate, dateFormat),
                        rules: [{ required: true, message: "此项不能为空" }]
                      })
                        (<DatePicker
                          showToday={true}
                          placeholder="请选择日期"
                          disabledDate={this.disabledStartDate}
                          onChange={this.onStartChange}
                          onOpenChange={this.handleStartOpenChange}
                          format={dateFormat}
                          allowClear={false}
                          style={{ width: '175px' }}
                        />)
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="失效时间：">
                      {getFieldDecorator('invalidTime', {
                        initialValue: this.state.title ? null : moment(this.props.application.checkupdateList.appExpiredate, dateFormat),
                        rules: [{ required: true, message: "此项不能为空" }]
                      })
                        (<DatePicker
                          placeholder="请选择日期"
                          disabledDate={this.disabledEndDate}
                          onChange={this.onEndChange}
                          open={this.state.endOpen}
                          onOpenChange={this.handleEndOpenChange}
                          format={dateFormat}
                          allowClear={false}
                          style={{ width: '175px' }}
                        />)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="系统类型：">
                      {getFieldDecorator('systemType', {
                        initialValue: this.state.title ? (this.props.application.getSelList.length > 0 ? this.props.application.getSelList[0].dictName : undefined) : this.props.application.checkupdateList.appTypeName,
                        rules: [{ required: true, message: "此项不能为空" }]
                      })
                        (
                        <Select onChange={(e) => this.handleChange(e)} placeholder="请选择">
                          {this.getDropdown()}
                        </Select>
                        )
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} label="应用系统：">
                      {this.state.title || this.props.application.checkupdateList.openApp === '0' ?
                        getFieldDecorator('systemYN')
                          (<Switch onChange={(e) => this.handleSwitch(e)} defaultChecked checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} />)
                        :
                        getFieldDecorator('systemYN')
                          (<span><Switch onChange={(e) => this.handleSwitch(e)} checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} /></span>)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <FormItem style={{ marginLeft: '37px' }} label="系统描述："></FormItem>
                  </Col>
                  <Col span={20}>
                    <FormItem hasFeedback style={{ marginLeft: '-15px' }}>
                      {getFieldDecorator('systemTalk', {
                        initialValue: this.state.title ? null : this.props.application.checkupdateList.appDesc,
                        rules: [{
                          validator: (rule, value, callback) => {
                            if (value && value.length > 500) {
                              callback('长度不能超过500')
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
      </LocaleProvider >
    )
  }
}

Application.propTypes = {
  loading: PropTypes.object,
};

export default connect(({ application, loading, app }) => ({ application, loading, app }))(Form.create()(Application))
