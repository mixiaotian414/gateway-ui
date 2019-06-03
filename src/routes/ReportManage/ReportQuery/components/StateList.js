import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input } from 'antd'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
/**
 * @Title:报表管理》报表查询》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/5/17
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
    const data=[{
      modelNum:'A1000101',
      modelName:'帆软报表',
      createDate:'2018/05',
      'modelType':"0",
      'modelRemark':"帆软模型",
      'key':2,
    },{
      modelNum:'A1000102',
      modelName:'润乾报表',
      createDate:'2018/05',
      'modelType':"0",
      'modelRemark':"润乾模型",
      'key':3,
    },{
      modelNum:'A1000105',
      modelName:'业务状况表',
      createDate:'2018/05',
      'modelType':"0",
      'modelRemark':"常用模型",
      'key':1,
    },]
    const { refresh,LedgerType} = this.props;
    const {  selectedRowKeys } = this.state;

    const hasSelected = selectedRowKeys.length > 0;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    }
    const addTypeVisibleProps = {

      visible: this.state.addTypeVisible,
      maskClosable: false,
      title: '添加分类',
      wrapClassName: 'vertical-double-center-modal',
      width:"400px",
      footer:<Button style={{float:'center'}} type="primary" onClick={()=>{this.setState({addTypeVisible:false})}}>完成</Button>,
      onCancel:()=>{
        this.setState({addTypeVisible:false})
      },
    }
    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
          message.info("系统实例，无法删除")
      } else if (e.key === '2') {
        let win = window.open('https://www.baidu.com', '_blank');
        win.focus();
      }else if (e.key === '3') {
        if (record.key===1){
          this.props.dispatch(routerRedux.push({
            pathname:"reportQueryDetail/"+record.key,
          }))}else if (record.key===3){
          this.props.dispatch(routerRedux.push({
            pathname:'runqianReport/'+record.key,
          }))
        }else if (record.key===2){
          this.props.dispatch(routerRedux.push({
            pathname:'fanruanReport/'+record.key,
          }))
        }
      }
    }
    const handleTableChange = (pagination, filtersArg, sorter) => {
      this.setState({
        sortedInfo: sorter,
      });
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
      title: '报表编码',
      dataIndex:"modelNum",
      key:"modelNum",
      align:"left",
    },{
      title: '报表名称',
      dataIndex:"modelName",
      key:"modelName",
      align:"left",
    },{
      title: '描述',
      dataIndex:"modelRemark",
      key:"modelRemark",
      align:"left",
    },{
      title: '创建时间',
      dataIndex:"createDate",
      key:"createDate",
      align:"left",
    },{
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '删除' },
         /* { key: '2', name: '修改' },*/
          { key: '3', name: '查看' }]} />
      },
    }];


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };

    return(
      <div>
        <Row type="flex" justify="start">
          <Col span={10}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>报表查询</span>
          </Col>
         {/* <Col span={14}   >
            <Row type="flex" justify="end"  >
            <Col span={4}  >
              <Button   onClick={()=>{
                var win = window.open('https://www.baidu.com', '_blank');
                win.focus();  }} icon="plus" >创建报表</Button>
            </Col>
              <Col span={4}  >
                <Button
                          icon="delete"
                          disabled={!hasSelected}
                          loading={this.props.loading.effects[LedgerType+'/query']} >批量删除</Button>
            </Col>

            </Row>
          </Col>*/}


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
              dataSource={data}
            /*  pagination={paginationProps}*/
              onChange={handleTableChange}
              rowSelection={rowSelection}
              loading={this.props.loading.effects[LedgerType+'/query']}
              >
            </Table>

          </Col>
        </Row>

        {this.state.addTypeVisible &&
        <Modal {...addTypeVisibleProps} >
          <p><Input placeholder="请输入类别"></Input></p>
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


