import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select,message} from 'antd'

import { request } from 'utils'
import TransferSelect from "./TransferSelect";


/**
 * @Title:报表管理》自定义指标》创建模型》输入表单
 * @Description:指标树组件
 * @Author: mxt
 * @Time: 2018/6/20
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
let  Format = 'YYYY-MM-DD';
const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
class IndexForm extends Component{
  state={
    item:this.props.item||{},

    queryProductLevData:this.props.queryProductLevData||[]
  }
  componentWillMount = () => {
    const item = this.props.item||{};
    let isShow=false
    if (item.status==="1")
    {
      isShow=true
    }
    this.setState({
      item,
      isShow
    })
  /*  //目录树形
    this.fetch()*/
  }
  fetch = () => {

    this.promise = request({
      url:"/gateway/deriveproddirtree.json",
      method: 'post',
      data: {
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if (result.RSP_BODY) {

        const treeData =result.RSP_BODY.deriveProdList
        let treeString=JSON.stringify(treeData)
        let treeTrans=treeString.replace(/shortName/g,"title").replace(/code/g,"value")

       let treeDataJson= JSON.parse(treeTrans);
        this.setState({
          treeData:treeDataJson
        })
      }

    })
  }



  render(){
    const { item} = this.state;
    const { getFieldDecorator,modalType } = this.props;
    let type=modalType==='create'?true:false
    let initvalue=[]
    if (item.products&&item.products.length>0){
      initvalue=item.products.map((item)=>{
        let obj={
          'key':item.productCode,
          /*  'name':data.props.title,*/
          'name':item.productCode,
          'title':item.productName
        }

        return obj
      })
    }




    return(
      <div>
        <Form layout="horizontal">
          <FormItem label="模型编码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              //检验节点
              validateTrigger: [ 'onBlur'],
              rules: [
                type?{
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
                }:{} ,
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
                       disabled={!type}
                       style={{width:'70%'}} />)}
          </FormItem>

          <FormItem label="模型名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  //必选时，空格是否会被视为错误
                  whitespace:true,
                  message: '名称不能为空',
                },  {
                  max: 10,
                  message: '名称长度不能超过10',
                },
              ],
            })(<Input placeholder="请输入"  style={{width:'70%'}}/>)}
          </FormItem>
          <FormItem label="模型类型" hasFeedback {...formItemLayout}>
            {getFieldDecorator('type', {
              initialValue: item.type,
              rules: [
                {
                  required: true,
                  message: '请选择类型',
                },
              ],
            })(<Select placeholder="请选择" style={{width:'70%'}}>
              {this.state.queryProductLevData && this.state.queryProductLevData.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

            </Select>)}
          </FormItem>

          <FormItem label="模型备注" hasFeedback {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: item.remark,
              rules: [
                {
                  required: true,
                  message: '请输入备注',
                },
              ],
            })(<Input placeholder="请输入"  style={{width:'70%'}}/>)}
          </FormItem>
          <FormItem label="指标项"   {...formItemLayout}>
            {getFieldDecorator('products', {
              initialValue: initvalue,
              rules: [
                {
                  required: true,
                  message: '请选择指标项',
                },
              ],
            })(<TransferSelect  />)}
          </FormItem>
        </Form>
      </div>
    )
  }
}
IndexForm.propTypes = {

}
export default Form.create()(IndexForm)


