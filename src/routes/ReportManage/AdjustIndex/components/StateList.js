import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input, } from 'antd'
import { routerRedux } from 'dva/router'
import { request } from 'utils'
import PropTypes from 'prop-types'
const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
/**
 * @Title:报表管理》派生指标调整》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/5/5
 * @Update: dhn
 * @UpdateTime: 2018/6/25

 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class List extends Component{
  state={
    sortedInfo:null,
    currentItem:undefined,
  }
  fetch = () => {
    const { fetchData } = this.state
    this.promise = request({
      url:" /gateway/deriveprodexport.expt",
      method: 'post',
         data: {
          title:"a",
         },
    /*  responseType:'blob',*/
      headers: {
        'Content-type': 'application/json'
      },
      responseType: 'arraybuffer'
    })
    /*   .then(res => {
       const content = res

       const blob = new Blob([content])
       const fileName = 'excel.xls'
       this.setState({href:URL.createObjectURL(blob),
         download:fileName
       },()=>{
         console.log(this._a,"refs")
         this._a.click()
       })
     }) */
    /*  .then(res=>res.blob())*/
      .then(res => {

        const content = res
        /*  const blob =res.blob()*/
        let blobArgs = {type: 'application/vnd.ms-excel'};

        const blob = new Blob([res],blobArgs)
        const fileName = 'excel.xls'
        this.setState({href:window.URL.createObjectURL(blob),
          download:fileName
        },()=>{
          this._a.click()
        })
      })
    /*    .then(blob => {
          var url = window.URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url;
          a.download = "filename.xlsx";
          a.click();
        });*/
  }
  render(){
    const {  LedgerType,pagination} = this.props;
    const { getFieldDecorator,getFieldsValue} = this.props.form;
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const indexDetailProps = {
      visible: this.props.modalVisible,
      maskClosable: false,
      title: '指标详情',
      wrapClassName: 'vertical-double-center-modal',
      width:"400px",
      footer:<Button style={{float:'center'}} type="primary"
                     onClick={()=>{
                       const formvalue={
                         ...this.state.currentItem,
                         ...getFieldsValue()
                       }
                       this.props.onCreat(formvalue)
                     }}>完成</Button>,
      onCancel:()=>{
        this.props.changeModal(false)
      },
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
      title: '期次',
      dataIndex:"dateId",
      key:"dateId",
      align:"left",

    },{
      title: '机构编码',
      dataIndex:"branchId",
      key:"branchId",
      align:"left",
    },{
      title: '指标编码',
      dataIndex:"productId",
      key:"productId",
      align:"left",
    },{
      title: '指标名称',
      dataIndex:"productName",
      key:"productName",
      align:"left",
    },{
      title: '当前值',
      dataIndex: 'currBal',
      key:"currBal",
      align:"right",
      render: (text, record) => {
        return Number(text).toFixed(2)
      },
    },{
      title: '调整值',
      dataIndex: 'tuneBal',
      key:"tuneBal",
      align:"right",
      render: (text, record) => {
        return Number(text).toFixed(2)
      },
    },{
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) => <a href="javascript:;"
                                   onClick={()=>{
                                     this.setState({currentItem:{dateId:record.dateId,branchId:record.branchId,productId:record.productId,currId:record.currId,tuneBal:record.tuneBal}})
                                     this.props.changeModal(true)
                                   }} >调整</a>,
    }];

    return(
      <div>
        <Row type="flex" justify="start">
          <Col span={10}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>指标数据查询</span>
          </Col>
          <Col span={14}   >
            <Row type="flex" justify="end"  >
              <Col span={4}  >
                <Button   onClick={()=>{
                  /* let win = window.open('/gateway/deriveprodexport.expt', '_blank');
                   win.focus();*/
               /*   let param= {"a":"1"}
                  let url ='?param='+param
                  window.location='/gateway/deriveprodexport.expt'*/
                      this.fetch()
                 /*    this._iframe.src="/gateway/deriveprodexport.expt?code='1'"
                  this._input.submit*/
                }} icon="plus" >导出</Button>
              </Col>
              <a ref={a => {
                this._a = a
              }}
                 href={this.state.href} download={this.state.download} hidden/>

              <iframe name="testIframeName" ref={iframe=>{this._iframe=iframe}} hidden > </iframe>
              <form target="testIframeName" method="post"  >
                <input type="text" name="username" hidden readOnly value="1"/>
                <input type="password" name="password" hidden readOnly value="2"/>
                <input ref={input => {
                  this._input = input
                }} type="submit" hidden  value=" 提 交 " />
              </form>



            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              columns={columns}
              dataSource={this.props.list}
              onChange={handleTableChange}
              pagination={paginationProps}
              loading={this.props.loading.effects[LedgerType+'/query']}
            >
            </Table>

          </Col>
        </Row>
        {this.props.modalVisible &&
        <Modal {...indexDetailProps} >
          <FormItem      label="调整值"  {...formItemLayout}>
            {getFieldDecorator(`tuneBal`, {
              initialValue:this.state.currentItem.tuneBal,
              rules: [{
                required: true,
              }],
            })(
              < Input  placeholder="请输入"/>)
            }
          </FormItem>
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


