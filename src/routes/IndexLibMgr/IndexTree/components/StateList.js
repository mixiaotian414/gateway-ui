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
 /* componentWillReceiveProps = (props) => {
    const pagination = this.props.pagination;
    const list = this.props.list;
    this.setState({
      tableList: list,
      pagination,
    })
  }*/
  render(){

    const { refresh,LedgerType,list,pagination} = this.props;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const {  selectedRowKeys } = this.state;
    const { onEditItem, deleteIndex } = this.props;

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
      title: '链接名称',
      dataIndex:"connectionName",
      key:"connectionName",
      align:"left",
    },{
      title: '链接地址',
      dataIndex:"databaseJdbcUrl",
      key:"databaseJdbcUrl",
      align:"left",
    },{
      title: '链接类型',
      dataIndex:"databaseType",
      key:"databaseType",
      align:"left",
      render: (text) => {
        if (text=='01')
        return databaseTypeText[0]
        else  if (text=='02') return databaseTypeText[1]
      }
    }, {
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '删除' },
          { key: '2', name: '修改' } ]} />
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
              <Col span={3}  >
              <Button  type="primary" onClick={()=>{
                this.props.onAdd()
              }} icon="delete" >修改</Button>
            </Col><Col span={3}  >
              <Button  type="primary" onClick={()=>{
                this.props.onAdd()
              }} icon="delete" >删除</Button>
            </Col>
             {/* <Col span={3}  >
                <Button  type="primary" onClick={()=>{
                  this.props.onAdd()
                }} icon="delete" >版本查看</Button>
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


