import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,DatePicker,Table,message } from 'antd'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'


/**
 * @Title:报表管理》模型管理》报表查询详情》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/5/17
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const bank=["江苏泗阳商业银行","人力资源部","审计稽核部","人力资源A部","审计稽核部子部","人力资源B部"]
const cur=["折本外币","人民币","折人民币","折美元"]
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

    currentItem:{}
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

    const { refresh,LedgerType} = this.props;





    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        this.setState({
          modalVisible: true,
            currentItem: record,
           })
      } else if (e.key === '2') {
        this.props.tohistoryAna(record)
      }else if (e.key === '3') {
          this.props.dispatch(routerRedux.push({
            pathname:"modelManageDetail/"+record.key,
          }))

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
      title: '科目代号',
      dataIndex:"kemu",
      key:"kemu",
      width:'10%'
    },{
      title: '项目名称',
      dataIndex:"name",
      key:"name",
      align:"left",
      width:'15%'
    },{
      title: '期初余额',
      children: [{
        title: '借方',
        dataIndex: 'jiefang',
        key: 'jiefang',
        align:"right",
        render: text => (<span>0</span>),
      }, {
        title: '贷方',
        dataIndex: 'daifang',
        key: 'daifang',
        align:"right",
        render: text => (<span>0</span>),
      }],
    },{
      title: '本期发生额',
      children: [{
        title: '借方',
        dataIndex: 'jiefang1',
        key: 'jiefang1',
        align:"right",
        render: text => (<span>0</span>),
      }, {
        title: '贷方',
        dataIndex: 'daifang1',
        key: 'daifang1',
        align:"right",
        render: text => (<span>0</span>),
      }],
    },{
      title: '期末余额',
      children: [{
        title: '借方',
        dataIndex: 'jiefang2',
        key: 'jiefang2',
        align:"right",
        render: text => (<span>0</span>),
      }, {
        title: '贷方',
        dataIndex: 'daifang2',
        key: 'daifang2',
        align:"right",
        render: text => (<span>0</span>),
      }],
    },{
      title: '科目代号',
      dataIndex:"kemu",
      key:"kemu1",
    }];


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };

    return(
      <div>
        <Row type="flex" justify="center">
        <Col span={8}   >
          <span style={{ fontSize: '30px',lineHeight: '32px',}}>江苏省农村信用社业务状况表</span>
        </Col>
        {/*  <Col span={14}   >
            <Row type="flex" justify="end"  >

              <Col span={4}  >
              <Button  style={{width:'100%'}}type="" onClick={()=>{message.success("导出成功")}} icon="export" >导出Excel</Button>
            </Col>
            </Row>
          </Col>
*/}

      </Row>
        <Row >
          <Col span={7}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>单位名称：江苏泗阳农村合作银行(321323000)</span>
          </Col>
           <Col span={3}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>月报</span>
          </Col>
          <Col span={5}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>日期：2018年5月</span>
          </Col>
        <Col span={5}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>币种:人民币</span>
          </Col>
        <Col span={4}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>单位:元</span>
          </Col>

        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              bordered
              fixed
              columns={columns}
              dataSource={this.state.tableList}
              pagination={false}
              onChange={handleTableChange}
              loading={this.props.loading.effects[LedgerType+'/query']}
        >
            </Table>

          </Col>
        </Row>
        <Row >
          <Col span={5}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>理(董)事长：</span>
          </Col>
          <Col span={5}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>理(董)事长：</span>
          </Col>
          <Col span={5}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>处（科）长：</span>
          </Col>
          <Col span={5}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>复核：</span>
          </Col>
          <Col span={4}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',}}>制表:</span>
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


