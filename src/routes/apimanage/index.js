import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { GifButton, MenuButton } from 'components'
import { LocaleProvider, Form, Row, Col, Button, Input, Modal, Select, Radio, message, Table, DatePicker, Divider, Pagination, Badge, Switch } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm
const { TextArea } = Input;

class Apimanage extends Component {
  constructor(props) {
    super(props);
    this.Query = this.Query.bind(this);
    this.Reset = this.Reset.bind(this);
    this.newlyBuild = this.newlyBuild.bind(this);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.Delete = this.Delete.bind(this);
    this.Update = this.Update.bind(this);
    this.getDropdown = this.getDropdown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkCode = this.checkCode.bind(this);
    this.state = {
      title: true,
      Newlybuildvisible: false,
      Selectchangevalue: '',
      initSelectchangevalue: '',
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
      checkselect: false
    }
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'apimanage/getTableList',
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
      type: 'apimanage/getTableList',
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
    const appName = this.props.form.getFieldValue("appName");
    this.props.dispatch({
      type: 'apimanage/getTableList',
      payload: {
        page: 1,
        pageSize: 10,
        appName: appName || '',
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
  getDropdown() {
    const array = this.props.apimanage.getSelList
    const select_list = array.map(k => ({ ...k, dict_Name: `${k.dictName}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name}>{k.dict_Name}</Option>)
    }
    return null;
  }
  handleChange(e) {
    const select = JSON.parse(e);
    this.setState({
      Selectchangevalue: select.dictName,
      checkselect: true
    })
  }
  //保存
  handleOk = (e) => {
    const apiCode = this.props.form.getFieldValue("apiCode");
    const apiName = this.props.form.getFieldValue("apiName");
    const apiLocation = this.props.form.getFieldValue("apiLocation");
    const apiTalk = this.props.form.getFieldValue("apiTalk");
    const only = this.props.apimanage.onlychecklist.flag
    //默认
    const apiStatus = (this.state.title || this.props.apimanage.checkupdateList.apiStatus === '0') == true ? 0 : 1
    this.props.form.validateFields((error) => {
      if (!error) {
        if (this.state.Newlybuildvisible) {
          this.props.dispatch({
            type: 'apimanage/newTableList',
            payload: {
              apiId: '',
              apiCode: apiCode || '',
              apiName: apiName || '',
              apiLocation: apiLocation || '',
              apiMethod: this.state.checkselect == true ? this.state.Selectchangevalue : (this.props.apimanage.getSelList.length > 0 ? this.props.apimanage.getSelList[0].dictName : ''),
              apiswitch: this.state.checksw == true ? this.state.Switchvalue : apiStatus,
              apiTalk: apiTalk || '',
            }
          })
        }
        if (this.state.Updatevisible) {
          this.props.dispatch({
            type: 'apimanage/updTableList',
            payload: {
              apiId: this.props.apimanage.checkupdateList.apiId,
              apiCode: apiCode || '',
              apiName: apiName || '',
              apiLocation: apiLocation || '',
              apiMethod: this.state.checkselect == false ? this.props.apimanage.checkupdateList.apiMethod : this.state.Selectchangevalue,
              apiswitch: this.state.checksw == true ? this.state.Switchvalue : apiStatus,
              apiTalk: apiTalk || '',
            }
          })
        }
        this.props.dispatch({
          type: 'apimanage/getTableList',
          payload: {
            page: 1,
            pageSize: 10,
            appName: '',
          }
        })
        this.props.dispatch({
          type: 'apimanage/updateList',
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
        })
      } else {
        message.error('操作失败')
      }
    })
  }
  handleCancel = (e) => {
    this.props.dispatch({
      type: 'apimanage/updateList',
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
    const { dispatch } = this.props
    const appName = this.props.form.getFieldValue("appName");
    this.props.dispatch({
      type: 'apimanage/delTableList',
      payload: {
        apiId: record.apiId,
        isDel: '0'
      }
    }).then(() => {
      if (this.props.apimanage.deleteinfo.isApiFunc == false) {
        confirm({
          title: '确定删除吗?',
          okText: "是",
          cancelText: "否",
          onOk() {
            dispatch({
              type: 'apimanage/delTableList',
              payload: {
                apiId: record.apiId,
                isDel: '1'
              }
            })
            dispatch({
              type: 'apimanage/getTableList',
              payload: {
                page: 1,
                pageSize: 10,
                appName: appName || '',
              }
            })
            message.success('删除成功')
          },
        })
      }
      if (this.props.apimanage.deleteinfo.isApiFunc == true) {
        confirm({
          title: '此角色已配置菜单和功能 是否继续删除?',
          okText: "是",
          cancelText: "否",
          onOk() {
            dispatch({
              type: 'apimanage/delTableList',
              payload: {
                apiId: record.apiId,
                isDel: '1'
              }
            })
            dispatch({
              type: 'apimanage/getTableList',
              payload: {
                page: 1,
                pageSize: 10,
                appName: appName || '',
              }
            })
            message.success('删除成功')
          },
        })
      }
    })

  }
  //编辑
  Update(record) {
    this.props.form.resetFields();
    this.props.dispatch({
      type: 'apimanage/updTable',
      payload: {
        appId: record.appId,
        apiId: record.apiId
      }
    })
    this.setState({
      title: false,
      Updatevisible: true,
    })
  }
  //接口代码唯一校验
  checkCode(e) {
    const code = this.props.form.getFieldValue("apiCode");
    if ((this.state.Newlybuildvisible && code && code.length > 0) || (this.state.Updatevisible && (code != this.props.apimanage.checkupdateList.apiCode))) {
      this.props.dispatch({
        type: 'apimanage/onlyCheck',
        payload: {
          value: code,
        }
      }).then(() => {
        if (this.props.apimanage.onlychecklist.flag == true) {
          this.props.form.resetFields(['apiCode']);
        }
      })
    }
  }
  getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

  render() {
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
    const columns = [
      {
        title: '接口名称',
        dataIndex: 'apiName',
        key: 'apiName',
      }, {
        title: '接口地址',
        dataIndex: 'apiUri',
        key: 'apiUri',
      }, {
        title: '更新时间',
        dataIndex: 'lastUpdateTime',
        key: 'lastUpdateTime',
      }, {
        title: '操作',
        render: (text, record) => {
            // if (record.openApp == 1) {
            if (true) {
              return (
                <span>
                <a onClick={() => this.Delete(record)}><MenuButton FuncListBtn={funclist} btnCode="100702" btnText="删除" /></a><Divider type="vertical" />
                <a onClick={() => this.Update(record)}><MenuButton FuncListBtn={funclist} btnCode="100703" btnText="编辑" /></a>
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
    ]
    const {
      apimanage: {
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
        type: 'apimanage/updateState',
        payload: {
          formValues: { ...formValues, ...filters },
        },
      })
      dispatch({
        type: 'apimanage/getTableList',
        payload: params,
      })
    }
    return (
      <LocaleProvider locale={zhCN}>
        <div className={styles.divbackground}>
          <Row style={{ marginLeft: '10px' }}>
            <Form layout="inline" style={{ textAlign: 'left' }}>
              <FormItem label="接口名称：" >
                {getFieldDecorator('appName', {
                })(<Input placeholder="请输入" style={{ float: 'left' }} />)}
              </FormItem>
              <FormItem>
                <Button key="cx" type="primary" onClick={this.Query} loading={this.props.loading.effects['apimanage/getTableList']}>查询</Button>
              </FormItem>
              <FormItem>
                <Button key="cz" onClick={this.Reset}>重置</Button>
              </FormItem>
            </Form>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={6}>
              <GifButton FuncListBtn={funclist} onBtnClick={() => this.newlyBuild()} btnCode="100701" btnType="primary" btnIcon="plus" btnText="新建" />
            </Col>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.apiCode}
                style={{ paddingLeft: '0px' }}
                bordered
                simple
                fixed
                columns={columns}
                dataSource={this.props.apimanage.list}
                pagination={paginationProps}
                onChange={handleTableChange}
                loading={this.props.loading.effects['apimanage/getTableList']}
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
                <Row key={this.state.Newlybuildvisible} style={{ textAlign: 'right' }}>
                  <Button key="qx" onClick={this.handleCancel}>取消</Button>
                  <Button key="bc" type="primary" onClick={this.handleOk}>保存</Button>
                </Row>
              ]}
            >
              <Form layout="horizontal">
                <Row>
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="接口名称：">
                      {getFieldDecorator('apiName', {
                        initialValue: this.state.title ? null : this.props.apimanage.checkupdateList.appName,
                        rules: [{
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[A-Za-z0-9\u4e00-\u9fa5\-]+$/.test(value)) || (value && value.length > 30)) {
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
                    <FormItem {...formItemLayout} hasFeedback label="接口编码：">
                      {getFieldDecorator('apiCode', {
                        initialValue: this.state.title ? null : this.props.apimanage.checkupdateList.apiCode,
                        rules: [{
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[^\u4e00-\u9fa5]{0,}$/.test(value)) || (value && value.length > 50)) {
                              callback('不能输入汉字，长度不超过50')
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
                    <FormItem {...formItemLayout} hasFeedback label="接口方法：">
                      {getFieldDecorator('apiMethod', {
                        initialValue: this.state.title ? (this.props.apimanage.getSelList.length > 0 ? this.props.apimanage.getSelList[0].dictName : undefined) : this.props.apimanage.checkupdateList.apiMethod,
                        rules: [{ required: true, message: "此项不能为空" }]
                      })
                        (<Select onChange={(e) => this.handleChange(e)} placeholder="请选择">
                          {this.getDropdown()}
                        </Select>)
                      }
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    <FormItem {...formItemLayout} hasFeedback label="接口地址：">
                      {getFieldDecorator('apiLocation', {
                        initialValue: this.state.title ? null : this.props.apimanage.checkupdateList.apiUri,
                        rules: [{
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[A-Za-z\/]+$/.test(value)) || (value && value.length > 100)) {
                              callback('只能输入字母和/,长度不超过100')
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
                    <FormItem {...formItemLayout} label="接口状态：">
                      {this.state.title || this.props.apimanage.checkupdateList.apiStatus === '1' ?
                        getFieldDecorator('apiState')
                          (<Switch onChange={(e) => this.handleSwitch(e)} defaultChecked checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} />)
                        :
                        getFieldDecorator('apiState')
                          (<span><Switch onChange={(e) => this.handleSwitch(e)} checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} /></span>)
                      }
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={4}>
                    <FormItem style={{ marginLeft: '37px' }} label="接口描述："></FormItem>
                  </Col>
                  <Col span={20}>
                    <FormItem hasFeedback style={{ marginLeft: '-15px' }}>
                      {getFieldDecorator('apiTalk', {
                        initialValue: this.state.title ? null : this.props.apimanage.checkupdateList.apiDesc,
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
      </LocaleProvider >
    )
  }
}

Apimanage.propTypes = {
  loading: PropTypes.object,
};

export default connect(({ apimanage, loading, app }) => ({ apimanage, loading, app }))(Form.create()(Apimanage))
