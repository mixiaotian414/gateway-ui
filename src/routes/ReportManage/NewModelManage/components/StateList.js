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
 * @Title:模型管理》模型管理》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2019/3/27
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
    const { onEditItem, deleteIndex,onDetail } = this.props;

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
      }
    }
    const handleTableChange = (pagination, filtersArg, sorter) => {


      const params = {

        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,

      };

      this.props.onTableChange( params)
    }

    const columns = [{
      title: '模型名称',
      dataIndex:"modelName",
      key:"modelName",
      align:"left",
    }, {
      title: '模型类型',
      dataIndex:"modelTypeText",
      key:"modelTypeText",
      align:"left",

    }, {
      title: '数据源',
      dataIndex:"modelDatasourceText",
      key:"modelDatasourceText",
      align:"left",

    },{
      title: '创建时间',
      dataIndex:"createTime",
      key:"createTime",
      align:"left",
    }, {
      title: '引用状态',
      dataIndex:"eSave",
      key:"eSave",
      align:"left",
      render: (text, record) => {
        return  !text?"已引用":"未引用"
      },
    }, {
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => {
        let arr=[]
          if( record.eSave){
            arr=[ { key: '1', name: '删除' },
             { key: '2', name: '修改' }]
          }else{
            arr=[
              { key: '3', name: '详情' }]
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
          {/*    <Col span={3}  >
              <Button    onClick={()=>{
                this.props.onAdd()
              }} icon="delete" >删除</Button>
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


