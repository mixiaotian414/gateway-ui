import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select,message} from 'antd'

import { request } from 'utils'
import TransferSelect from "./TransferSelect";
import { connect } from 'dva'



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
    span: 24,
  },
}
class IndexForm extends Component{
  state={
    item:this.props.item||{},
    type: this.props.type,
    // queryProductLevData:this.props.queryProductLevData||[]
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
  
  }
  
  render(){
    const { item} = this.state;
    const { getFieldDecorator,type } = this.props;
    // let type=modalType1==='create'?true:false
    let initvalue=[];

    
      if (item.products&&item.products.length>0){
        initvalue=item.products.map((item)=>{
          let obj={
            'key':item.value,
            /*  'name':data.props.title,*/
            'name':item.value,
            'title':item.label
          }
  
          return obj
        })
      }
      if (item.branches&&item.branches.length>0){
        initvalue=item.branches.map((item)=>{
          let obj={
            'key':item.value,
            'name':item.value,
            'title':item.label
          }
  
          return obj
        })
      }

      const indexFromProps={
        type
      }

    return(
      <div>
        <Form layout="horizontal">
          <FormItem {...formItemLayout}>
            {type=="quota"?getFieldDecorator('products', {
              initialValue: initvalue,
              rules: [
                {
                  required: false,
                  message: "请选择指标",
                },
              ],
            })(<TransferSelect {...indexFromProps} />):getFieldDecorator('branches', {
              initialValue: initvalue,
              rules: [
                {
                  required: false,
                  message: "请选择机构",
                },
              ],
            })(<TransferSelect {...indexFromProps} />)}

          </FormItem>
        </Form>
      </div>
    )
  }
}
IndexForm.propTypes = {

}
export default Form.create()(IndexForm)



