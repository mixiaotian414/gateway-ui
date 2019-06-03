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

class AnalysisList extends Component{
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
    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        message.info("系统实例，无法删除")
      } else if (e.key === '2') {
        let win = window.open('https://www.baidu.com', '_blank');
        win.focus();
      }else if (e.key === '3') {
        if (record.key===2){
          let win = window.open('http://114.116.42.157:40085/?plugin=true&mode=view#query/open//homes/home:admin/%E6%97%A5%E6%80%BB%E8%B4%A6%E6%9F%A5%E8%AF%A2-%E7%A7%91%E7%9B%AE.saiku', '_blank');
          win.focus();
        }
        if (record.key===1){
          let win = window.open('http://114.116.42.157:40085/?plugin=true&mode=view#query/open//homes/home:admin/%E6%97%A5%E6%80%BB%E8%B4%A6%E6%9F%A5%E8%AF%A2-%E6%9C%BA%E6%9E%84.saiku ', '_blank');
          win.focus();
        }
      }
    }
    const showreport =(record, e)=>{
      if (record.key===2){
        let win = window.open('http://114.116.42.157:40085/?plugin=true&mode=view#query/open//homes/home:admin/%E6%97%A5%E6%80%BB%E8%B4%A6%E6%9F%A5%E8%AF%A2-%E7%A7%91%E7%9B%AE.saiku', '_blank');
        win.focus();
      }
      if (record.key===1){
        let win = window.open('http://114.116.42.157:40085/?plugin=true&mode=view#query/open//homes/home:admin/%E6%97%A5%E6%80%BB%E8%B4%A6%E6%9F%A5%E8%AF%A2-%E6%9C%BA%E6%9E%84.saiku ', '_blank');
        win.focus();
      }

    }
    const data=[{
      modelNum:'A1000101',
      modelName:'日总账查询-机构',
      createDate:'2018/05',
      'modelType':"0",
      'modelRemark':"日总账查询-机构",
      'key':1,
    },{
      modelNum:'A1000102',
      modelName:'日总账查询-科目',
      createDate:'2018/05',
      'modelType':"0",
      'modelRemark':"日总账查询-科目",
      'key':2,
    },]
    //列表表头
    const columns = [{
      title: '报表编码',

      dataIndex:"modelNum",
      key:"modelNum",

    },{
      title: '报表名称',
      dataIndex:"modelName",
      key:"modelName",
      render: (text, record) => {
        return (
          <span>
              <a onClick={() => showreport(record)}>{text}</a>
            </span>
        )
      }

    },{
      title: '描述',
      dataIndex:"modelRemark",
      key:"modelRemark",
    },{
      title: '创建时间',
      dataIndex:"createDate",
      key:"createDate",
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
    return(
      <div>
        <Row style={{marginTop: '10px',marginLeft:'0px'}}>
          <a href="http://114.116.42.157:40085/" target="_blank"><Button  type="primary" icon="plus" >创建模型</Button></a>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              columns={columns}
              //rowSelection={rowSelection}
              dataSource={data}
              onChange={handleTableChange}
              pagination="false"
              loading={this.props.loading.effects[LedgerType+'/query']}
            >
            </Table>

          </Col>
        </Row>
      </div>
    )
  }
}
AnalysisList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(AnalysisList)


