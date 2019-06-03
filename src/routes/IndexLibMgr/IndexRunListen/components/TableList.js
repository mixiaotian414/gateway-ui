import React, {Component} from 'react';
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {Row, Col,Form,Button,Table,message,Modal,Card,Icon,Tree,Select,Upload,Input } from 'antd'
import {request} from 'utils'
import PropTypes from 'prop-types'
/**
 * @Title:指标库管理=》指标跑数监控列表
 * @Description:子组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/4/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option
const confirm = Modal.confirm;
class TableList extends Component {
  state = {
    ids:[]
  }
  componentDidMount = ()=>{
    this.props.dispatch({
      type: this.props.LedgerType+'/query',
    })
  }

  render() {
    const { LedgerType,pagination,deleteIndex } = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;


    //列表表头
    const columns = [{
      title: '序号',
      key: 'id',
      width:'8%',
      //dataIndex: "id",
      render:(text,record,index)=>`${index+1}`
    },{
      title: '指标名称',
      dataIndex: "productName",
      key: "productName",
      align: 'left',
    }, {
      title: '指标编码',
      dataIndex: "productCode",
      key: "productCode",
      align: 'left',
    }, {
      title: '数据日期',
      dataIndex: "etlDate",
      key: "etlDate",
      align: 'left',
    }, {
      title: '任务状态',
      dataIndex: "taskStsText",
      key: "taskStsText",
      align: 'left',
    }, {
      title: '开始时间',
      dataIndex: "begTime",
      key: "begTime",
      align: 'left',
    },{
      title: '结束时间',
      dataIndex: "endTime",
      key: "endTime",
      align: 'left',
    },{
      title: '操作',
      dataIndex: 'val2',
      key: "val2",
      render: (text, record) =>{
        return (
          <span>
               <a onClick={e=>heavyRun(record)}>重跑</a>
           </span>
        )
      }
    },];

    //重跑
    const heavyRun =(record)=>{
      this.props.dispatch({
        type: this.props.LedgerType+'/heavyRun',
        payload:{
          productCode:record.productCode
        }
      })
    }
    //分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    //列表切换分页时所用取数据方法
    const handleTableChange = (pagination, filtersArg, sorter) => {
      const params = {
        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.props.onTableChange(params)

    }
    const del =()=>{
      const { LedgerType,dispatch } = this.props
      confirm({
        title: '确定删除吗?（此操作会清除所有待执行指标）',
        okText: "确定",
        cancelText: "取消",
        onOk() {
          dispatch({
            type: LedgerType+'/del',
          })
        },
      })
    }



    return (
      <div>
        <Row style={{marginTop: '10px' }}>
          <Col lg={24} md={24}>
            <Form layout="inline">
              <FormItem >
                <Button type="primary" onClick={()=>this.props.onAdd()}>
                  <Icon type="plus" />添加
                </Button>
              </FormItem>
              {/*<FormItem >
                <Button onClick={()=>del()}>
                  <Icon type="delete" />删除
                </Button>
              </FormItem>*/}
            </Form>
          </Col>
        </Row>
          <Row>
          <Col span={24}>
            <Table
              //size="small"
              rowKey={(record, index) => `${index+1}`}
              style = {{ paddingTop:'10px' }}
              columns={columns}
              dataSource={this.props.list}
              loading={this.props.loading.effects[LedgerType + '/query']}
              pagination={paginationProps}
              onChange={handleTableChange}
            />

          </Col>
        </Row>
      </div>
    )
  }
}

TableList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(TableList)


