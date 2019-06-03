import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal } from 'antd'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'

import CreateIndexModal from './CreateIndexModal'
import MoveIndexModal  from './MoveIndexModal'

/**
 * @Title:报表管理》自定义指标列表》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/3/15
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
    currentItem:{},
    modalType:'create',
    MoveItem:{},
    MoveItemVisible:false,
    selectedRowKeys:[],
    formulaModalText:{},
    formulaModal:false,

  }
  componentWillReceiveProps = (props) => {
    const pagination = props.pagination;
    const list = props.list;
    const currentItem = props.currentItem;

    const modalType = props.modalType;

    this.setState({
      tableList: list,
      pagination,
      currentItem,
      modalType
    })
  }

  render(){
    const { LedgerType,
      dispatch,
      getTypeList,
      //业务组件判断按钮
      BussList=[]} = this.props;
    let canUpdate = BussList.includes(1001)
    const { currentItem,modalType} = this.state;
    const createmodalProps = {
      modalType,
      BussList,
      getTypeList,
      item: modalType === 'create' ? {} : currentItem,
      visible: this.props.createmodalVisible,
      maskClosable: false,
      title: `${modalType === 'create' ? '创建指标' : '修改指标'}`,
      wrapClassName: 'vertical-double-center-modal',
      width:"700px",
      okText:"保存",
      cancelText:"取消",
      /* footer:<Button style={{float:'center'}} type="primary" onClick={()=>{this.setState({createmodalVisible:false})}}>完成</Button>,*/
      onOk: (data)=> {
        this.props.onCreat(data)
      },
      onCancel:()=>{
        dispatch({
          type:LedgerType+'/querySuccess',
          payload: {
            createmodalVisible:false
          },
        })
      },
    }
    const moveIndexModalProps = {
      item: this.state.MoveItem,
      visible: this.state.MoveItemVisible,
      maskClosable: false,
      title: '新目录选择',
      wrapClassName: 'vertical-double-center-modal',
      width:"700px",
      onFinish:(data)=>{
        const item1=this.state.MoveItem

        const payload={
          codes:[item1.code],
          pcode:data.typeId
        }
        dispatch({
          type:LedgerType+'/moveIndex',
          payload,
          callback:(res)=>{
            if(res.success){
              this.setState({
                MoveItemVisible:false,
                MoveItem:{},
              })
            }

          }
        })
      },
      onCancel:()=>{
        this.setState({
          MoveItemVisible:false
        })
      },
    }
    const  ModalProps = {

      visible: this.state.formulaModal,
      maskClosable: false,
      title: '指标公司',
      wrapClassName: 'vertical-double-center-modal',
      width:"700px",
      onOk:()=>{
        this.setState({
          formulaModal:false
        })
      },
      onCancel:()=>{
        this.setState({
          formulaModal:false
        })
      },
    }
    const handleMenuClick = (record, e) => {
      if (e.key === '1') {//删除
        handleDeleteItems(record)
      } else if (e.key === '2') {//修改
        this.props.onEditItem(record)
      } else if (e.key === '3') {//移动体系
        this.setState({
          MoveItem:record,
          MoveItemVisible:true,
        })
      }else if (e.key === '4') {//执行
        handleProdCollect()
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
      title: '指标编码',
     /* sorter: true,*/
      dataIndex:"code",
      key:"code",
      fixed: 'left',
      width: 130,
      align: 'left',
    },{
      title: '指标名称',
      dataIndex:"name",
      key:"indexName",
      fixed: 'left',
      width: 130,
      align: 'left',
    },{
      title: '指标类型',
      dataIndex:"categoryText",
      key:"categoryText",
      align: 'left',
    },{
      title: '指标体系',
      dataIndex:"description",
      key:"description",
      align: 'left',
    },{
      title: '指标公式',
      dataIndex:"indexFormula",
      key:"indexFormula",
      align: 'left',
      render: (text, record) => {
        return  <a href="javascript:null" onClick={()=>{
          this.setState({
          formulaModal:true,
          formulaModalText:record,
        })}} >公式查看</a>
      },
    },/*{
      title: '币种',
      dataIndex:"currencyCode",
      key:"currencyCode",
    },*/
      {
        title: '是否公共',
        dataIndex:"isPublic",
        key:"isPublic",
        align: 'left',
        render:(text,record)=>{
          return <span>{record.isPublic==="1"?"公共":"私有"}</span>
        }
    }
      ,
      {
      title: '取数周期',
      dataIndex:"frequencyText",
      key:"frequencyText",
      align: 'left',
    },{
      title: '状态',
      dataIndex:"statusText",
      key:"statusText",
      align: 'left',

    }, {
      title: '备注',
      dataIndex:"remark",
      key:"remark",
      align: 'left',
    },{
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      fixed: 'right',
      width: 100,
      render: (text, record) => {
        let flag =false
        let ispublic =record.isPublic==="1"?true:false
        if (!ispublic){
          flag=true
        }else{
          if (canUpdate){
            flag=true
          }        }
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={
          flag?[
          { key: '1', name: '删除' },
          { key: '2', name: '修改' },
          { key: '3', name: '移动' },
          { key: '4', name: '执行采集' }

          ]:[{key: '99', name: '无'}]} />
      },
    }];
    const {  selectedRowKeys } = this.state;

    const hasSelected = selectedRowKeys.length > 0;

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
      },
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };

    const handleDeleteItems = (record) => {
      let codes =[record.code]
      dispatch({
        type: LedgerType+'/multiDelete',
        payload: {
          codes
        },
        callback:(res)=>{

        }
      })
    }
    const handleProdCollect = () => {
      message.info("已执行，请查看日志")
      //暂时注掉
     /* dispatch({
        type: LedgerType+'/prodcollect',
        payload: {
          codes: selectedRowKeys,
        },
        callback:(res)=>{

          if(res.success){
            this.setState({
              selectedRowKeys:[]
            })
            message.info("已执行，请查看日志")
          }else{

          }

        }
      })*/
    }
    return(
      <div>
        <Row type="flex" justify="start">
          <Col span={10}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>派生指标列表</span>
          </Col>
          <Col span={14}   >
            <Row type="flex" justify="end"  >
              <Col span={5}  >
                <Button  type=""  onClick={()=>{this.props.toCreat()}} icon="plus" >创建指标</Button>
              </Col>
              {/*   <Col span={4}  >
                <Button   onClick={handleDeleteItems}
                          icon="delete"
                          disabled={!hasSelected}
                          loading={this.props.loading.effects[LedgerType+'/query']} >批量删除</Button>
              </Col>
             <Col span={4}  >
                <Button   type=""   disabled={!hasSelected} onClick={()=>{message.success("重置成功")}} icon="reload" >重置级别</Button>
              </Col>
              <Col span={4}  >
                <Button  style={{width:'100%'}}   disabled={!hasSelected} type=""
                         onClick={
                           handleProdCollect
                         }
                         loading={this.props.loading.effects[LedgerType+'/prodcollect']}
                         icon="play-circle-o" >执行采集</Button>
              </Col>
            <Col span={4}  >
              <Button   type="" onClick={()=>{message.success("导出成功")}} icon="delete" >删除指标</Button>
            </Col>
              <Col span={4}  >
              <Button  style={{width:'100%'}}type="" onClick={()=>{message.success("导出成功")}} icon="edit" >修改指标</Button>
            </Col>*/}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
          {/*  {hasSelected ? <div style={{ marginBottom: 16 }}>
              <span style={{ marginLeft: 8 }}>
             已选 {selectedRowKeys.length} 条
                  </span>
            </div>: ''}*/}
            <Table
              rowKey={record => record.code}
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              bordered
              fixed
              columns={columns}
              dataSource={this.state.tableList}
              pagination={paginationProps}
              onChange={handleTableChange}
             /* rowSelection={rowSelection}*/
              loading={this.props.loading.effects[LedgerType+'/query']}
              scroll={{x:'120%'}}>
            </Table>

          </Col>
        </Row>
        {this.props.createmodalVisible && <CreateIndexModal {...createmodalProps} />}
        {this.state.MoveItemVisible && <MoveIndexModal {...moveIndexModalProps} />}
        {this.state.formulaModal && <Modal {...ModalProps} >
          <p>公式:{this.state.formulaModalText.formula}</p>
          <p>翻译:{this.state.formulaModalText.formulaText}</p>
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


