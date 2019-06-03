import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input } from 'antd'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
const FormItem = Form.Item;
import { request } from 'utils'
/**
 * @Title:报表管理》指标类型维护》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/4/16
 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
class List extends Component{
  state={
    tableList: [],
    pagination:{
      total: 0,
      pageSize: 10,
      current: 1,
    },
    status:false,
    sortedInfo:null,
    modalVisible:false,
    addTypeVisible:false,
    currentItem:{},
    parentId:{},

  }
  componentWillReceiveProps = (props) => {
    const pagination = this.props.pagination;
    const list = this.props.list;
    this.setState({
      tableList: list,
      pagination,
    })
  }

  render(){
    const { refresh,LedgerType,toAdd} = this.props;
    const { getFieldDecorator,validateFields} = this.props.form;
    const handleSubmit = (e) => {
      e.preventDefault();

      const {parentId}=this.state

     validateFields(function (err, fieldsValue) {
       if (err) return
        fieldsValue={
          ...fieldsValue,
          parentId
        }
        toAdd(fieldsValue)
      });
      this.setState({addTypeVisible:false})
    }
    const addTypeVisibleProps = {

      item: this.state.currentItem,
      visible: this.state.addTypeVisible,
      maskClosable: false,
      title: '添加分类',
      wrapClassName: 'vertical-double-center-modal',
      width:"400px",
      footer:<Button style={{float:'center'}} type="primary"
                     onClick={
                       handleSubmit
                     }>完成</Button>,
      onCancel:()=>{
        this.setState({addTypeVisible:false})
      },
    }
    const handleMenuClick = (record, e) => {
      console.info(this)
      if (e.key === '1') {
        this.setState({
          modalVisible: true,
          currentItem: record,
        })
      } else if (e.key === '2') {
        this.props.tohistoryAna(record)
      }else if (e.key === '3') {


        this.setState({
          parentId:record.code,
          addTypeVisible:true
        })

       /* this.props.dispatch(routerRedux.push({
          pathname:"modelManageDetail/"+record.key,
        }))*/
      }
    }
    const handleTableChange = (pagination, filtersArg, sorter) => {
      this.setState({
        sortedInfo: sorter,
      });
      console.log('sorter',sorter)
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
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
      this.props.onTableChange(filters,params)
    }

    const columns = [{
      title: '指标类型',

      dataIndex:"name",
      key:"name",
      width:"20%",
      align:"left",
    },  {
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[/*{ key: '1', name: '删除' }, { key: '2', name: '修改' },*/{ key: '3', name: '插入' }]} />
      },
    }];


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };
    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    }
    return(
      <div>
        <Row type="flex" justify="start">
          <Col span={10}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>指标类型</span>
          </Col>
      {/*    <Col span={14}   >
            <Row type="flex" justify="end"  >
              <Col span={4}  >
                <Button   onClick={()=>{this.setState({addTypeVisible:true})}} icon="plus" >创建类型</Button>
              </Col>

            </Row>
          </Col>*/}


        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              columns={columns}
              rowKey={record => record.code}
              dataSource={this.state.tableList}
              pagination={false}
              onChange={handleTableChange}
            /*  rowSelection={rowSelection}*/
              loading={this.props.loading.effects[LedgerType+'/query']}
            >
            </Table>

          </Col>
        </Row>

        {this.state.addTypeVisible &&
        <Modal {...addTypeVisibleProps} >
          <Form layout="horizontal">
          <FormItem label="体系编码" {...formItemLayout}

          >
            {getFieldDecorator('code',{
              //检验节点
              validateTrigger: [ 'onBlur'],

              rules: [
                 {
                  validator: (rule, value, callback) => {
                    this.promise = request({
                      url:"/gateway/utilsvalidateVal.json",
                      method: 'post',
                      data: {
                        tab: "pr_derive_directory",
                        col: "code",
                        val: value
                      },
                    }).then((result) => {
                      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
                        callback('系统错误')
                      }
                      if (result.RSP_BODY.flag) {
                        callback('编码已存在')
                      }
                      callback()
                    })
                  }
                }
                ,
                {
                  pattern: /^[0-9a-zA-Z]{0,11}$/g,
                  message: '请输入正确编码，编码不能为汉字且小于11位！',
                },
                {
                  required: true,
                  whitespace:true,
                  message: '体系编码不能为空',
                },
              ],
            })(
              <Input  placeholder="请输入"  />
            )}
          </FormItem>
          <FormItem label="体系名称"  {...formItemLayout}>
            {getFieldDecorator('name',
              {
                rules: [
                  {
                    required: true,
                    whitespace:true,
                    message: '体系名称不能为空',
                  },  {
                    max: 10,
                    message: '体系名称长度不能超过10',
                  },
                ],
              })(
              <Input  placeholder="请输入"/>
            )}
          </FormItem>
            <FormItem label="体系简称"  {...formItemLayout}>
            {getFieldDecorator('shortName',
              {
                rules: [
                  {
                    required: true,
                    whitespace:true,
                    message: '体系简称称不能为空',
                  },  {
                    max: 10,
                    message: '体系简称长度不能超过10',
                  },
                ],
              })(
              <Input  placeholder="请输入"/>
            )}
          </FormItem>
          </Form>
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


