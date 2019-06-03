import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Input,Icon } from 'antd'
import { GifButton,MenuButton } from 'components'
import { Sales } from '../components'
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
/**
 * @Title:列表DEMO——>List组件
 * @Description:List组件(生命周期模式)
 * @Author: dhn
 * @Time: 2018/6/26
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class List extends Component{
  state={
    sortedInfo:null,
    btnStatus: [],
    modaltitle: "",
    modalItem:[],
    currentItem:undefined,
    modalVisibleSale:false,
    loglist:[{"funcName":"通知","funcCode":"101215","count":640,"icon":"idcard","funcId":148,"funcType":"2","status":"1"},{"funcName":"获取登录用户信息","funcCode":"101202","count":639,"icon":"global","funcId":141,"funcType":"2","status":"1"},{"funcName":"系统公告列表","funcCode":"101303","count":310,"icon":"fork","funcId":145,"funcType":"2","status":"1"},{"funcName":"日志列表","funcCode":"101301","count":310,"icon":"shopping-cart","funcId":143,"funcType":"2","status":"1"}],
    loglistbytime:[{"日志列表":93,"name":"2018-06-27","通知":127,"系统公告列表":92,"获取登录用户信息":127},{"日志列表":190,"name":"2018-06-26","通知":377,"系统公告列表":190,"获取登录用户信息":376},{"日志列表":28,"name":"2018-06-25","通知":136,"系统公告列表":28,"获取登录用户信息":136},{"日志列表":0,"name":"2018-06-24","通知":0,"系统公告列表":0,"获取登录用户信息":0},{"日志列表":0,"name":"2018-06-23","通知":0,"系统公告列表":0,"获取登录用户信息":0},{"日志列表":0,"name":"2018-06-22","通知":0,"系统公告列表":0,"获取登录用户信息":0},{"日志列表":0,"name":"2018-06-21","通知":0,"系统公告列表":0,"获取登录用户信息":0}],
  }
  //导出相关  方法之一
  fetch = () => {
    const { fetchData } = this.state
    this.promise = request({
      url:" /gateway/deriveprodexport.expt",
      method: 'post',
   /*   data: {
        ...fetchData,
      },*/
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
        const blob = new Blob([content])
      const fileName = 'excel.xls'
        console.log(window.URL,"rul")
      this.setState({href:window.URL.createObjectURL(blob),
        download:fileName
      },()=>{
        console.log(this._a,"refs")
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
    //批量删除
    const showConfirm = () => {
      const { dispatch } = this.props
      if (!selectedRowKeys) {
        message.warning('请选择一条记录！');
      }else if(selectedRowKeys.length>0){
        const aid = this.props.app.user.appId
        console.info(ids)
        confirm({
          title: '确定删除吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: LedgerType+'/delete',
              payload: {
                appId: aid,
                demoIdList: ids,
              },
            }).then(()=>{
              dispatch({
                type: LedgerType+'/updateState',
                payload: {
                  selectedRowKeys: [],
                  ids:[],
                },
              })
            })
          },
        })
      }else {
        message.warning('请选择一条记录！');
      }
    }
    //删除
    const remove = (appId, dateId, branchId,productId,currId) => {
      const { dispatch } = this.props
      const demoids=[{
        appId:appId,
        dateId:dateId,
        branchId:branchId,
        productId:productId,
        currId:currId,
      }]
      confirm({
        title: '确定删除吗?',
        okText:'确定',
        cancelText:'取消',
        onOk() {
          dispatch({
            type: LedgerType+'/delete',
            payload: {
              demoIdList:demoids
            },
          })
        },
      })
    }
    //model保存
    const okHandle = () => {
      if (this.state.btnStatus === 1) {
        okHandleUpdate()
      }
      if (this.state.btnStatus === 2) {
        okHandleAdd()
      }
    }
    //新增保存
    const okHandleAdd = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type:  LedgerType+'/add',
          payload: {
            appId: this.props.app.user.appId,
            branchId: fieldsValue.branchId,
            dateId: fieldsValue.dateId,
            productId: fieldsValue.productId,
            currId: "1",
            val1: fieldsValue.val1,
            val2: fieldsValue.val2,
            val3: fieldsValue.val3,
          },
        })
        form.resetFields()
        changeModal(false)
      })
    }
    //修改保存
    const okHandleUpdate = () => {
      const { form, dispatch } = this.props
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type:  LedgerType+'/update',
            payload: {
              appId: this.props.app.user.appId,
              branchId: fieldsValue.branchId,
              dateId: fieldsValue.dateId,
              productId: fieldsValue.productId,
              currId: "1",
              val1: fieldsValue.val1,
              val2: fieldsValue.val2,
              val3: fieldsValue.val3,
            },
          })
          form.resetFields()
          changeModal(false)
        })
    }
    //modal框属性
    const indexDetailProps = {
      visible: this.props.modalVisible,
      maskClosable: false,
      title: this.state.modaltitle,
      wrapClassName: 'vertical-double-center-modal',
      width:"600px",
      footer:this.state.btnStatus===0?
        [<Button style={{float:'center'}} type="primary" onClick={e=>changeModal(false)}>关闭</Button>]:
        [<Button style={{float:'center'}} type="primary" onClick={e=>changeModal(false)}>取消</Button>,
         <Button style={{float:'center'}} type="primary" onClick={okHandle}>保存</Button>],
      onCancel:()=>{
        changeModal(false)
      },
    }
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
    //列表表头
    const columns = [{
      title: '期次',
      dataIndex:"dateId",
      key:"dateId",
    },{
      title: '机构编码',
      dataIndex:"branchId",
      key:"branchId",
    },{
      title: '指标编码',
      dataIndex:"productId",
      key:"productId",
    },{
      title: '指标名称',
      dataIndex:"productName",
      key:"productName",
    },{
      title: '1值',
      dataIndex: 'val1',
      key:"val1",
    },{
      title: '2值',
      dataIndex: 'val2',
      key:"val2",
    },{
      title: '3值',
      dataIndex: 'val3',
      key:"val3",
    },{
      title: '操作',
      dataIndex: 'operate',
      key:"operate",
      render: (text, record) =>
        <span>
          <a href="javascript:;" onClick={
            ()=>{this.setState({btnStatus: 0, modaltitle: "详情",modalItem:record})
              changeModal(true)
            }
          } ><MenuButton FuncListBtn={funclist} btnCode="100901" btnText="详情" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="javascript:;" onClick={
            ()=>{this.setState({btnStatus: 1, modaltitle: "编辑",modalItem:record})
                 changeModal(true)
                 }
          } ><MenuButton FuncListBtn={funclist} btnCode="100903" btnText="编辑" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="javascript:;" onClick={event => remove(this.props.app.user.appId,record.dateId,record.branchId,record.productId,record.currId)
          } ><MenuButton FuncListBtn={funclist} btnCode="100902" btnText="删除" /></a>
        </span>
          ,
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
        <Row type="flex" justify="start">
          <Col span={10}   >
            <span style={{ fontSize: '17px',lineHeight: '32px',    paddingLeft: '10px'}}>指标数据查询</span>
          </Col>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col span={6}>
            <GifButton FuncListBtn={funclist}  onBtnClick={() => {this.setState({btnStatus: 2, modaltitle: "新建",});this.props.changeModal(true)}} btnCode="100901" btnType="primary" btnIcon="plus" btnText="新建" />
            <GifButton FuncListBtn={funclist}  onBtnClick={() => showConfirm()} btnCode="100902" style={{marginLeft:'10px'}} btnType="primary" btnText="批量删除" />
          </Col>
          <Col span={18}   >
            <Row type="flex" justify="end"  >
              <Col span={4}  >
                <Button   onClick={()=>{
                  /* let win = window.open('/gateway/deriveprodexport.expt', '_blank');
                   win.focus();*/
                  let param= {"a":"1"}
                  let url ='?param='+param
                  window.location='/gateway/deriveprodexport.expt'
                  /*    this.fetch()*/
                  /*   this._iframe.src="/gateway/deriveprodexport.expt?code='1'"
                     this._input.submit*/
                }} icon="plus" >导出</Button>
              </Col>
              {/*<a ref={a => {*/}
                {/*this._a = a*/}
              {/*}}*/}
                 {/*href={this.state.href} download={this.state.download} hidden/>*/}

              {/*<iframe name="testIframeName" ref={iframe=>{this._iframe=iframe}} hidden > </iframe>*/}
              {/*<form target="testIframeName" method="post"  >*/}
                {/*<input type="text" name="username" hidden  value="1"/>*/}
                {/*<input type="password" name="password" hidden  value="2"/>*/}
                {/*<input ref={input => {*/}
                  {/*this._input = input*/}
                {/*}} type="submit" hidden  value=" 提 交 " />*/}
              {/*</form>*/}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              columns={columns}
              rowSelection={rowSelection}
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
          <Row>
            <Col span={12}>
              <FormItem label="期次" {...formItemLayout}>
                {getFieldDecorator(`dateId`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.dateId,
                })(
                  this.state.modaltitle == "详情" ?< Input  placeholder="请输入" readOnly />:< Input  placeholder="请输入" />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="机构编码" {...formItemLayout}>
                {getFieldDecorator(`branchId`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.branchId,
                })(
                  this.state.modaltitle == "详情" ?< Input  placeholder="请输入" readOnly />:< Input  placeholder="请输入" />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="指标编码" {...formItemLayout}>
                {getFieldDecorator(`productId`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.productId,
                })(
                  this.state.modaltitle == "详情" ?< Input  placeholder="请输入" readOnly />:< Input  placeholder="请输入" />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="1值" {...formItemLayout}>
                {getFieldDecorator(`val1`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.val1,
                })(
                  this.state.modaltitle == "详情" ?< Input  placeholder="请输入" readOnly />:< Input  placeholder="请输入" />)
                }
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem label="2值" {...formItemLayout}>
                {getFieldDecorator(`val2`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.val2,
                })(
                  this.state.modaltitle == "详情" ?< Input  placeholder="请输入" readOnly />:< Input  placeholder="请输入" />)
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem label="3值" {...formItemLayout}>
                {getFieldDecorator(`val3`, {
                  initialValue: this.state.modaltitle == "新建" ? null : this.state.modalItem.val3,
                })(
                  this.state.modaltitle == "详情" ?< Input  placeholder="请输入" readOnly />:< Input  placeholder="请输入" />)
                }
              </FormItem>
            </Col>
          </Row>
        </Modal>}
        <Row style={{textAlign:'right'}}>
          <a  onClick={()=>{this.setState({modalVisibleSale:true})}}><Icon type="bar-chart" style={{ fontSize: 14, color: '#08c' }} />条形</a>&nbsp;&nbsp;
          <a  onClick={()=>{this.setState({modalVisibleSale:false})}}><Icon type="line-chart" style={{ fontSize: 14, color: '#08c' }} />折线</a>
        </Row>
        <Row>
          <Sales data={this.state.loglistbytime} modalVisible={this.state.modalVisibleSale} loglist={this.state.loglist} />
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


