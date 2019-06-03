import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input } from 'antd'
const {
   confirm,
} = Modal
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
/**
 * @Title:指标库管理》指标管理》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const databaseTypeText=["mysql","oracle"]
class List extends Component{
  state={
    list: [],
    modalVisible:false,
    addTypeVisible:false,
  selectedRowKeys:[],

  }

  render(){

    const { refresh,LedgerType,list,pagination} = this.props;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const {  selectedRowKeys } = this.state;
    const { onEditItem, deleteIndex ,onDetail,onPublish,onBloodTree} = this.props;

    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    }

    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        confirm({
          title: '确定删除吗?',
          okText: "是",
          cancelText: "否",
          onOk() {
           deleteIndex(record)
          },
        })


      } else if (e.key === '2') {
        onEditItem(record)
      }else if (e.key === '3') {
        onDetail(record)
      }else if (e.key === '4') {
        confirm({
          title: '确定修改发布状态?',
          okText: "是",
          cancelText: "否",
          onOk() {
            onPublish(record)
          },
        })

      }else if (e.key === '5') {
        onBloodTree(record)
      }
    }
    const handleTableChange = (pagination, filtersArg, sorter) => {


      const params = {

        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,

      };

      this.props.onTableChange(params)
    }

    const columns = [{
      title: '指标名称',
      dataIndex:"productName",
      key:"productName",
      align:"left",
    },{
      title: '指标类型',
      dataIndex:"productTypeText",
      key:"productTypeText",
      align:"left",
    },{
      title: '启用时间',
      dataIndex:"productEnableTime",
      key:"productEnableTime",
      align:"left",
    },{
      title: '是否发布',
      dataIndex:"ePublish",
      key:"ePublish",
      align:"left",
      render: (text) => {
        if (text)
        return "是"
        else  if (!text) return "否"
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => {
        let arr=[]
        if( !record.ePublish){
          arr=[ { key: '1', name: '删除' },
            { key: '2', name: '修改' },
            record.ePublish?{ key: '4', name: '取消发布' }:{ key: '4', name: '发布' },
           /* { key: '5', name: '血脉' },*/
          ]
        }else{
          arr=[
            { key: '3', name: '详情' },
            record.ePublish?{ key: '4', name: '取消发布' }:{ key: '4', name: '发布' },
           /* { key: '5', name: '血脉' },*/
          ]
        }

        return <DropOption onMenuClick={e => handleMenuClick(record, e)}
                           menuOptions={arr} />
      },
    }];




    return(
      <div>
        <Row type="flex" justify="start">

          <Col span={24}   >
            <Row type="flex" justify="left"  >
            <Col span={3}  >
              <Button type="primary"  onClick={()=>{
                this.props.onAdd()
              }} icon="plus" >新建</Button>
            </Col>

            {/*  <Col span={3}  >
                <Button   onClick={()=>{
                  this.props.onAdd()
                }}  >版本查看</Button>
              </Col>*/}
          {/*    <Col span={4}  >
                <Button
                          icon="delete"
                          disabled={!hasSelected}
                          loading={this.props.loading.effects[LedgerType+'/query']} >批量删除</Button>
            </Col>
*/}
            </Row>
          </Col>


        </Row>
        <Row>
          <Col span={24}>
            {hasSelected ? <div style={{ marginBottom: 16 }}>
              <span style={{ marginLeft: 8 }}>
             已选 {selectedRowKeys.length} 条
                  </span>
            </div>: ''}
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              columns={columns}
              dataSource={list}
             pagination={paginationProps}
              onChange={handleTableChange}
            /*  rowSelection={rowSelection}*/
              loading={this.props.loading.effects[LedgerType+'/query']}
              >
            </Table>

          </Col>
        </Row>


      </div>
    )
  }
}
List.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(List)


