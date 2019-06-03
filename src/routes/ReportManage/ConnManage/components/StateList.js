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
 * @Title:指标查询》数据源管理》展现组件
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
      title: '连接名称',
      dataIndex:"connectionName",
      key:"connectionName",
      align:"left",
    },{
      title:'JDBC URL',
      dataIndex:"databaseJdbcUrl",
      key:"databaseJdbcUrl",
      align:"left",
    },{
      title: '连接描述',
      dataIndex:"databaseDesc",
      key:"databaseDesc",
      align:"left",
    },{
      title: '创建时间',
      dataIndex:"createTime",
      key:"createTime",
      align:"left",
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
          <Col span={10}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>连接管理</span>
          </Col>
          <Col span={14}   >
            <Row type="flex" justify="end"  >
            <Col   >
              <Button   onClick={()=>{
                this.props.onAdd()
              }} icon="plus" >新建数据源</Button>
            </Col>
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
              rowKey={record => record.id}
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


