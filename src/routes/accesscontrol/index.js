import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Button,Table,Form ,Modal, Badge,Row,Col, message,Pagination,Input  } from 'antd'
import { GifButton, MenuButton } from 'components'
import styles from './index.less'

/***
 * @title:ip访问控制
 * @author:chenshuai
 * @time:2018/6/22
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const confirm = Modal.confirm

const statusMap = ['default', 'success'];
const status = ["否","是"];

class accesscontrol extends React.Component{
  state = {

  }

  render(){
    const FormItem = Form.Item
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFieldsValue } = this.props.form
    const { accesscontrol: {pagination, list, selectedRowKeys, ids } } = this.props
    const funclist = this.props.app.funcList
    const columns = [

      {
        title: '访问用户名',
        dataIndex: 'visitorName',
        key: 'visitorName',
      },{
        title: '访问IP',
        dataIndex: 'visitIp',
        key: 'visitIp',
      },{
        title: '访问时间',
        dataIndex: 'visitDate',
        key: 'visitDate',
      },
      {
        title: '是否是黑名单',
        dataIndex: 'isDisabled',
        key: 'isDisabled',
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      }
    ]
    const handleTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props;
      const visitorName = this.props.form.getFieldValue("visitorName");
      const params = {
        visitorName: visitorName || '',
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      dispatch({
        type: 'accesscontrol/query',
        payload: params,
      });
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const handleSearch = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const visitorName = this.props.form.getFieldValue("visitorName");
      const values = {
        visitorName: visitorName || '',
        page: 1,
        pageSize: 10,
      }
      dispatch({
        type: 'accesscontrol/query',
        payload: values,
      })
    }

    const handleFormReset = () => {
      const { form } = this.props;
      form.resetFields();
    }

    //批量删除
    const showConfirm = () => {
      const { dispatch } = this.props
      if (!selectedRowKeys) {
        message.warning('请选择一条记录！');
      }else if(selectedRowKeys.length>0){
        confirm({
          title: '确定删除吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: 'accesscontrol/delete',
              payload: {
                visitIpIds: selectedRowKeys,
              },
            })
          },
        })
      }else {
        message.warning('请选择一条记录！');
      }
    }
    //添加黑名单
    const addBlackShowConfirm = () => {
      const { dispatch } = this.props
      if (!selectedRowKeys) {
        message.warning('请选择一条记录！');
      }else if(selectedRowKeys.length>0){
        confirm({
          title: '确定添加黑名单吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: 'accesscontrol/addBlack',
              payload: {
                visitIpIds: selectedRowKeys,
              },
            })
          },
        })
      }else {
        message.warning('请选择一条记录！');
      }
    }

    //解除黑名单
    const removeBlackShowConfirm = () => {
      const { dispatch } = this.props
      if (!selectedRowKeys) {
        message.warning('请选择一条记录！');
      }else if(selectedRowKeys.length>0){
        confirm({
          title: '确定解除黑名单吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: 'accesscontrol/removeBlack',
              payload: {
                visitIpIds: selectedRowKeys,
              },
            })
          },
        })
      }else {
        message.warning('请选择一条记录！');
      }
    }
    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record,e) => {
        this.props.dispatch({
          type: 'accesscontrol/updateState',
          payload: {
            selectedRowKeys: record,
            ids:e,
          },
        })
      },
    }

    return(
      <div className={styles.divbackground}>
        <Row>
          <Form layout="inline" ref="form" onSubmit={handleSearch}>
            <FormItem label="访问用户名" >
              {getFieldDecorator('visitorName', {
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" loading={this.props.loading.effects['accesscontrol/query']} htmlType="submit" >查询</Button>
            </FormItem>
            <FormItem>
              <Button onClick={handleFormReset} htmlType="submit" >重置</Button>
            </FormItem>
          </Form>
        </Row>
        <Row style={{marginTop:'10px'}}>
          <GifButton FuncListBtn={funclist} onBtnClick={() => showConfirm()} btnCode="" btnType="primary" btnText="批量删除" />
          <GifButton FuncListBtn={funclist} style={{ marginLeft:'10px'}} onBtnClick={() => addBlackShowConfirm()} btnCode="" btnType="primary" btnText="添加黑名单" />
          <GifButton FuncListBtn={funclist} style={{ marginLeft:'10px'}} onBtnClick={() => removeBlackShowConfirm()} btnCode="" btnType="primary" btnText="解除黑名单" />
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowSelection={rowSelection}
              style={{ paddingLeft: '0px', paddingTop: '10px' }}
              bordered
              fixed
              rowKey={record => record.visitIpId}
              columns={columns}
              dataSource={list}
              pagination={paginationProps}
              onChange={handleTableChange}
              loading={this.props.loading.effects['accesscontrol/query']}
            >
            </Table>
          </Col>
        </Row>
      </div>

    )
  }
}
export default connect(({ accesscontrol, loading,app }) => ({ accesscontrol, loading,app }))(Form.create()(accesscontrol))
