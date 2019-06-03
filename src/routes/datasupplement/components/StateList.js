import React, {Component} from 'react'
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col, Form, Button, Table, message, Modal, Input, Icon} from 'antd'
import {routerRedux} from 'dva/router'
import {request} from 'utils'
import PropTypes from 'prop-types'

const FormItem = Form.Item
const confirm = Modal.confirm
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
/**
 * @Title:列表DEMO——>List组件
 * @Description:List组件(生命周期模式)
 * @Author: dhn
 * @Time: 2018/6/26
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class List extends Component {
  state = {
    sortedInfo: null,
    btnStatus: [],
    modaltitle: "",
    modalItem: [],
    currentItem: undefined,
  }

  render() {
    //父组件方法 可在props中取到
    const {LedgerType, pagination, onCreat, changeModal, ids, selectedRowKeys} = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    //分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    //批量删除
    const showConfirm = () => {
      const {dispatch} = this.props
      if (!selectedRowKeys) {
        message.warning('请选择一条记录！');
      } else if (selectedRowKeys.length > 0) {
        const aid = this.props.app.user.appId;
        confirm({
          title: '确定删除吗?',
          okText: "确定",
          cancelText: "取消",
          onOk() {
            dispatch({
              type: LedgerType + '/delete',
              payload: {
                appId: aid,
                demoIdList: ids,
              },
            }).then(() => {
              dispatch({
                type: LedgerType + '/updateState',
                payload: {
                  selectedRowKeys: [],
                  ids: [],
                },
              })
            })
          },
        })
      } else {
        message.warning('请选择一条记录！');
      }
    }
    //model保存
    const okHandle = () => {
      if (this.state.btnStatus === 1) {
        okHandleUpdate()
      }
      if (this.state.btnStatus === 2) {
        okHandleAdd()
      }
    }
    //新增保存
    const okHandleAdd = () => {
      const {form, dispatch} = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: LedgerType + '/add',
          payload: {
            col1: fieldsValue.col1,
            col2: fieldsValue.col2,
            col3: fieldsValue.col3,
            col4: fieldsValue.col4,
            col5: fieldsValue.col5,
            col6: fieldsValue.col6,
            col7: fieldsValue.col7,
            col8: fieldsValue.col8,
            col9: fieldsValue.col9,
            col10: fieldsValue.col10,
          },
        })
        form.resetFields()
        changeModal(false)
      })
    }
    //修改保存
    const okHandleUpdate = () => {
      const {form, dispatch} = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: LedgerType + '/update',
          payload: {
            recId: this.state.modalItem.recId,
            col1: fieldsValue.col1,
            col2: fieldsValue.col2,
            col3: fieldsValue.col3,
            col4: fieldsValue.col4,
            col5: fieldsValue.col5,
            col6: fieldsValue.col6,
            col7: fieldsValue.col7,
            col8: fieldsValue.col8,
            col9: fieldsValue.col9,
            col10: fieldsValue.col10,
          },
        })
        form.resetFields()
        changeModal(false)
      })
    }
    //modal框属性
    const indexDetailProps = {
      visible: this.props.modalVisible,
      maskClosable: false,
      title: this.state.modaltitle,
      wrapClassName: 'vertical-double-center-modal',
      width: "600px",
      footer: this.state.btnStatus === 0 ?
        [<Button style={{float: 'center'}} type="primary" onClick={e => changeModal(false)}>关闭</Button>] :
        [<Button style={{float: 'center'}} type="primary" onClick={e => changeModal(false)}>取消</Button>,
          <Button style={{float: 'center'}} type="primary" onClick={okHandle}>保存</Button>],
      onCancel: () => {
        changeModal(false)
      },
    }
    //列表切换分页时所用取数据方法
    const handleTableChange = (pagination, filtersArg, sorter) => {
      this.setState({
        sortedInfo: sorter,
      });
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = {...obj};
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
      const params = {

        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      };
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }
      this.props.onTableChange(filters, params)
    }
    //列表表头
    const columns = [{
      title: '字段一',
      dataIndex: "col1",
      key: "col1",
    }, {
      title: '字段二',
      dataIndex: "col2",
      key: "col2",
    }, {
      title: '字段三',
      dataIndex: "col3",
      key: "col3",
    }, {
      title: '字段四',
      dataIndex: "col4",
      key: "col4",
    }, {
      title: '字段五',
      dataIndex: 'col5',
      key: "col5",
    }, {
      title: '字段六',
      dataIndex: 'col6',
      key: "col6",
    }, {
      title: '字段七',
      dataIndex: 'col7',
      key: "col7",
    }, {
      title: '字段八',
      dataIndex: 'col8',
      key: "col8",
    }, {
      title: '字段九',
      dataIndex: 'col9',
      key: "col9",
    }, {
      title: '字段十',
      dataIndex: 'col10',
      key: "col10",
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: "operate",
      fixed: 'right',
      width: 120,
      render: (text, record) =>
        <span>
          <a href="javascript:;" onClick={
            () => {
              this.setState({btnStatus: 0, modaltitle: "详情", modalItem: record})
              changeModal(true)
            }
          }>详情</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="javascript:;" onClick={
            () => {
              this.setState({btnStatus: 1, modaltitle: "编辑", modalItem: record})
              changeModal(true)
            }
          }>编辑</a>
        </span>
    }
    ];

    //列表多选属性
    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record, e) => {
        this.props.dispatch({
          type: LedgerType + '/updateState',
          payload: {
            selectedRowKeys: record,
            ids: e,
          },
        })
      },
    }
    return (
      <div>
        <Row type="flex" justify="start">
          <Col span={10}>
            <Button onClick={() => {
              this.setState({btnStatus: 2, modaltitle: "新建",});
              this.props.changeModal(true)
            }} type="primary" icon="plus">新建</Button>
            <Button onClick={() => showConfirm()} style={{marginLeft: '10px'}} type="primary">批量删除</Button>
          </Col>
        </Row>
        <Row style={{marginTop: 10}}>
          <Col span={24}>
            <Table
              style={{paddingLeft: '0px', paddingTop: '10px'}}
              columns={columns}
              rowSelection={rowSelection}
              dataSource={this.props.list}
              onChange={handleTableChange}
              pagination={paginationProps}
              rowKey={record => record.recId}
              scroll={{x: 1500}}
              loading={this.props.loading.effects[LedgerType + '/query']}
            >
            </Table>
          </Col>
        </Row>
        {this.props.modalVisible &&
        <Modal {...indexDetailProps} >
          <Row>
            <Col span={12}>
              <FormItem label="字段一" {...formItemLayout}>
                {getFieldDecorator(`col1`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col1,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="字段二" {...formItemLayout}>
                {getFieldDecorator(`col2`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col2,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="字段三" {...formItemLayout}>
                {getFieldDecorator(`col3`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col3,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="字段四" {...formItemLayout}>
                {getFieldDecorator(`col4`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col4,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="字段五" {...formItemLayout}>
                {getFieldDecorator(`col5`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col5,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="字段六" {...formItemLayout}>
                {getFieldDecorator(`col6`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col6,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="字段七" {...formItemLayout}>
                {getFieldDecorator(`col7`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col7,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="字段八" {...formItemLayout}>
                {getFieldDecorator(`col8`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col8,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="字段九" {...formItemLayout}>
                {getFieldDecorator(`col9`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col9,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="字段十" {...formItemLayout}>
                {getFieldDecorator(`col10`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.col10,
                })(
                  this.state.modaltitle == "详情" ? < Input readOnly/> : < Input placeholder="请输入"/>)
                }
              </FormItem>
            </Col>
          </Row>
        </Modal>}
      </div>
    )
  }
}

List.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(List)


