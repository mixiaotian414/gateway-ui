import React, { Component } from 'react';
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input,Icon } from 'antd'
import { routerRedux } from 'dva/router'
import { request } from 'utils'
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

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
let sr = "测试共有维度.xlsx"
class CustommetricList extends Component{
  state={
    sortedInfo:null,
    btnStatus: [],
    modaltitle: "",
    modalItem:[],
    currentItem:undefined,
    modalVisibleSale:false,
  }

  render(){
    //父组件方法 可在props中取到
    const {  LedgerType,pagination,onCreat,changeModal,ids,selectedRowKeys} = this.props;
    const { getFieldDecorator,getFieldsValue} = this.props.form;
    //获取功能集合
    const funclist = this.props.app.funcList
    //分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    //列表切换分页时所用取数据方法
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
      console.log('formValues',this.props.formValues)
      console.log('filters',filters)
      console.log('params',params)

      this.props.onTableChange(filters,params)

    }
    const handleMenuClick = (record, e,text) => {
      if (e.key === '1') {
        // message.info("系统实例，无法删除")
        const {dispatch} = this.props
        confirm({
          title:"确定删除吗？",
          okText: "确定",
          cancelText: "取消",
          onOk (){
            dispatch({
              type: LedgerType+'/del',
              payload:{
                fileName: record.fileName,
              }
            })
          }
        })
      } else if (e.key === '2') {
        let win = window.open('https://www.baidu.com', '_blank');
        win.focus();
      }else if (e.key === '3') {
      }
    }
    const showreport =(record, e)=>{
        let url = str+"/zssapp-designer/#"+record.fileName;
        let win = window.open(url, '_blank');

        win.focus();

    }
    const data=[{
      modelNum:'A1000101',
      name:'损益表',
      createTime:'2018/05',
      'modelType':"0",
      'modelRemark':"损益表",
      'key':1,
    },{
      modelNum:'A1000102',
      name:'资产负债表',
      createTime:'2018/05',
      'modelType':"0",
      'modelRemark':"资产负债表",
      'key':2,
    },]
    //列表表头
    const columns = [{
    //   title: '报表编码',

    //   dataIndex:"modelNum",
    //   key:"modelNum",

    // },{
      title: '报表名称',
      dataIndex:"fileName",
      key:"fileName",
      align:"left",
      render: (text, record) => {
        return (
          <span>
              <a onClick={() => showreport(record)}>{text}</a>
            </span>
        )
      }

    },{
      title: '描述',
      dataIndex:"description",
      key:"description",
      align:"left",
    },{
      title: '创建时间',
      dataIndex:"createTime",
      key:"createTime",
      align:"left",
    },{
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => {
        return (
          <span>
            <a onClick={()=>{
              const {dispatch} = this.props
              confirm({
                title:"确定删除吗？",
                okText: "确定",
                cancelText: "取消",
                onOk (){
                  dispatch({
                    type: LedgerType+'/del',
                    payload:{
                      fileName: record.fileName,
                    }
                  })
                }
              })
            }}>删除</a>&nbsp;&nbsp;
              {<Link to={{
                pathname: `CustomReportQuery`,
                //hash: this.props.engineUrl,
                search:encodeURIComponent(record.fileName)
              }} target="_blank" toolbar="no">查看</Link>
              }
            </span>
        )
      },
    }];

    //列表多选属性
    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record,e) => {
        this.props.dispatch({
          type: LedgerType+'/updateState',
          payload: {
            selectedRowKeys: record,
            ids:e,
          },
        })
      },
    }
    let i = this.props.engineUrl.lastIndexOf("/")
    const str = this.props.engineUrl.substr(0,this.props.engineUrl.lastIndexOf("/",i-1))
    console.log("str:",str)
    return(
      <div>
        <Row style={{marginTop: '10px',marginLeft:'0px'}}>
          <a href={str+"/zssapp-designer/#"} target="_blank"><Button  type="primary" icon="plus" >创建报表</Button></a>&nbsp;&nbsp;
        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              rowKey={(record, index) => `${index+1}`}
              columns={columns}
              dataSource={this.props.list}
              onChange={handleTableChange}
              //pagination={paginationProps}
              loading={this.props.loading.effects[LedgerType+'/query']}
            >
            </Table>

          </Col>
        </Row>
      </div>
    )
  }
}
CustommetricList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(CustommetricList)


