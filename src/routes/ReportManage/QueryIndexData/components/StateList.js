import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input,Radio ,Select } from 'antd'
import { routerRedux } from 'dva/router'
import PropTypes from 'prop-types'
const FormItem = Form.Item
import styles from './StateList.less';
import { request } from 'utils'
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
/**
 * @Title:报表管理》指标数据查询》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/5/5
 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

let columns = [{
  title: '期次',
  dataIndex:"dateId",
  key:"dateId",
  // fixed: 'left',
  width: 100,
  align: 'left',
},{
  title: '机构编码',
  dataIndex:"branchId",
  key:"branchId",
  // fixed: 'left',
  width: 100,
  align: 'left',

},{
  title: '机构名称',
  dataIndex:"branchName",
  key:"branchName",
  // fixed: 'left',
  width: 150,
  align: 'left',
}]
let columns1 = []
let columns2 = []
let columns3 = []

class List extends Component{
  state={
    //1:不汇总
    //2:按机构
    //3:按日期
    tableType:"1",
    sortedInfo:null,

  }
  componentWillReceiveProps = (props) => {
    columns1 = [{
      title: '期次',
      dataIndex:"dateId",
      key:"dateId",
      fixed: 'left',
      width: 100,
      align: 'left',
    },{
      title: '机构编码',
      dataIndex:"branchId",
      key:"branchId",
      fixed: 'left',
      width: 100,
      align: 'left',

    },{
      title: '机构名称',
      dataIndex:"branchName",
      key:"branchName",
      fixed: 'left',
      width: 150,
      align: 'left',
    }]
    columns2 = [{
      title: '期次',
      dataIndex:"dateId",
      key:"dateId",
      fixed: 'left',
      width: 100,
      align: 'left',
    }]
    columns3 = [{
      title: '机构编码',
      dataIndex:"branchId",
      key:"branchId",
      fixed: 'left',
      width: 100,
      align: 'left',
    },{
      title: '机构名称',
      dataIndex:"branchName",
      key:"branchName",
      fixed: 'left',
      width: 200,
      align: 'left',
    }]
    if(props.formValues.productsName!==undefined){
      let newcolumns=[]

      props.formValues.productsName.map((item) => {
        newcolumns.push({
          title: item.label,
          dataIndex:item.value,
          key:item.value,
          /*width: 100,*/
          align: 'right',
          render: (text, record) => {
              return Number(text).toFixed(2)
          },
        })
      });

      columns1=[
        ...columns1,
        ...newcolumns
      ]
      columns2=[
        ...columns2,
        ...newcolumns
      ]
      columns3=[
        ...columns3,
        ...newcolumns
      ]
      switch (props.formValues.tableType){
        case "1":  columns =columns1
          break
        case "2":  columns =columns2
          break
        case "3":  columns =columns3
          break
        default:
          columns =columns1
      }
      newcolumns=[]
    }

  }

  fetch = () => {
    this.promise = request({
      url:"/gateway/derivedatanosumExport.expt",
      method: 'post',
      data: {
       title:"[a,b,c]",
        ...this.props.formValues
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.dictList
      this.setState({
        queryData,
      })
    })
  }


  handleTableTypeChange=(e)=>{
    const tableType=e.target.value
    this.setState({tableType})

    const params = {
      ...this.props.formValues,
      tableType
    };
    const filter = {
      tableType:tableType
    }
    this.props.onTableChange(filter,params)
  }

  render(){
    const { refresh,LedgerType,pagination,formValues,queryProductLevData} = this.props;
    const { getFieldDecorator,getFieldsValue,setFieldsValue,validateFields} = this.props.form;

    let colWidth=1000
    let count=0
    //如果没有指标项，不可以选择按日期，不汇总等
    let canChooseType=false
    if(formValues.productsName!==undefined){
      canChooseType=true
     formValues.productsName.map((item) => {
       count++
      });
    }
    if(count>4)
    colWidth=colWidth+count*100


    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    const indexDetailProps = {
      visible: this.props.modalVisible,
      maskClosable: false,
      title: '保存为指标报表',
      wrapClassName: 'vertical-double-center-modal',
      width:"400px",
      footer:<Button style={{float:'center'}}
                     type="primary"
                     onClick={()=>{
                       validateFields((errors,values) => {
                         if (errors) {
                           return
                         }
                         this.props.onCreat(getFieldsValue())
                       })

                     }}
      >完成</Button>,
      onCancel:()=>{
        this.props.changeModal(false)
      },
    }

    const handleTableChange = (pagination, filters, sorter) => {
      const params = {

        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };

      this.props.onTableChange(filters,params)

    };
    return(
      <div >
          <form ref="_form" action="/gateway/derivedatanosumExport.expt" method="post">
          <input type="hidden" name="title" value='["日期","机构编号","机构名称","指标1"]' />
        </form>
        <Row type="flex" justify="start">
          <Col span={10}   >
            {/*  <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>指标数据查询</span>*/}
            <Button   onClick={()=>{
              /* let win = window.open('/gateway/deriveprodexport.expt', '_blank');
                 win.focus();*/

          /*    window.location=""*/
              this.refs._form.submit()
               /*   this.fetch()*/
              /*   this._iframe.src="/gateway/deriveprodexport.expt?code='1'"
                 this._input.submit*/
            }} icon="plus" >导出</Button>
            <a style={{ fontSize: '13px',lineHeight: '32px',    paddingLeft: '20px'}}
               href="javascript:;"
               onClick={()=>{
                 if(formValues.products!==undefined){
                   this.props.changeModal(true)
                 }else {
                   message.warn("未选择指标")
                 }

               }} icon="plus" >表格中指标保存为模型</a>
          </Col>
          <Col span={14}   >
            <Row type="flex" justify="end"  >
              <Col  >
                <Radio.Group value={this.state.tableType} onChange={this.handleTableTypeChange} disabled={!canChooseType}>
                  <Radio.Button value="1">不汇总</Radio.Button>
                  <Radio.Button value="3">按机构</Radio.Button>
                  <Radio.Button value="2">按日期</Radio.Button>
                </Radio.Group>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className={styles.tableList}>
              <Table
                style={{paddingLeft:'0px', paddingTop: '10px'}}
                columns={columns}
                scroll={{ x:colWidth   }}
                fixed
                bordered
                dataSource={this.props.list}
                pagination={paginationProps}
                onChange={handleTableChange}
                loading={this.props.loading.effects[LedgerType+'/query']}
            /*    footer={() =>
                  <Table
                    columns={columns}
                /!*    scroll={{ x: '150%'  }}*!/
                    /!*fixed*!/
                    showHeader={false}
                    bordered
                    dataSource={this.props.sums}
                    pagination={false}
                    loading={this.props.loading.effects[LedgerType+'/query']}
                  >
                  </Table>}*/
              >
              </Table>
            </div>
          </Col>
        </Row>
        {this.props.modalVisible &&
        <Modal {...indexDetailProps} >
          <Form layout="horizontal">
          <FormItem    hasFeedback  label="模型编码"  {...formItemLayout}

          >
            {getFieldDecorator('code', {
              //检验节点
              validateTrigger: [ 'onBlur'],
              rules: [
                {
                  validator: (rule, value, callback) => {
                    this.promise = request({
                      url:"/gateway/utilsvalidateVal.json",
                      method: 'post',
                      data: {
                        tab: "pr_report_config",
                        col: "code",
                        val: value
                      },
                    }).then((result) => {
                      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
                        callback('系统错误')
                      }
                      if (result.RSP_BODY.flag) {
                        callback('编码已存在')
                      }
                      callback()
                    })
                  }
                } ,
                {
                  pattern: /^[0-9a-zA-Z]{0,11}$/g,
                  message: '请输入正确编码，编码只允许字母加数字组合且小于11位！',
                },
                {
                  required: true,
                  whitespace:true,
                  message: '编码不能为空',
                },
              ],
            })(<Input  placeholder="请输入"

                       style={{width:'70%'}} />)}
          </FormItem>
          <FormItem   hasFeedback   label="模型名称"  {...formItemLayout}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  whitespace:true,
                  message: '名称不能为空',
                },  {
                  max: 10,
                  message: '名称长度不能超过10',
                },
              ],
            })(<Input  placeholder="请输入"  style={{width:'70%'}} />)}
          </FormItem>
          <FormItem   hasFeedback   label="模型类型"  {...formItemLayout}>
            {getFieldDecorator('type', {
              rules: [
                {
                  required: true,
                  message: '请选择类型',
                },
              ],
            })((<Select placeholder="请选择" style={{width:'70%'}}>
              {queryProductLevData && queryProductLevData.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

            </Select>))}
          </FormItem>
          <FormItem   hasFeedback   label="模型描述"  {...formItemLayout}>
            {getFieldDecorator('remark', {
              rules: [
                {
                  required: true,
                  message: '请输入备注',
                },
              ],
            })(<Input  placeholder="请输入"  style={{width:'70%'}} />)}
          </FormItem>
          <FormItem>
            {getFieldDecorator('products', {
              initialValue: formValues.products,
            })(<Input  type="hidden" />)}
          </FormItem>
          </Form>
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


