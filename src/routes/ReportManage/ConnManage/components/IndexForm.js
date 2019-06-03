import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select,message} from 'antd'

import { request } from 'utils'


/**
 * @Title:指标管理》创建链接》输入表单
 * @Description:表单
 * @Author: mxt
 * @Time: 2019/3/28
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item
const { TextArea } = Input;
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

    queryProductLevData:this.props.queryProductLevData||[],
    URL:""
  }
  componentWillMount = () => {
    const item = this.props.item||{};

    this.setState({
      item
    })
  }


  render(){
    const { item} = this.state;
    const { getFieldDecorator,modalType,setFieldsValue } = this.props;
    let type=modalType==='create'?true:false

    const onChangeUrl=(value)=>{
      if(value ==='MYSQL'){
        setFieldsValue({"databaseJdbcUrl": "jdbc:mysql://192.168.0.1:3306/[数据库名]"})

      }else {
        setFieldsValue({"databaseJdbcUrl": "jdbc:oracle:thin:@192.168.0.1:1521:[数据库名]"})

      }
    }


    return(
      <div>
        <Form layout="horizontal">
          {type ? "" : getFieldDecorator('id', {
            initialValue: item.id,
          })(<Input placeholder="请输入" hidden />)
          }
          <FormItem label="连接名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('connectionName', {
              initialValue: item.connectionName,
              validateTrigger: [ 'onBlur'],
              rules: [
                {
                  required: true,
                  //必选时，空格是否会被视为错误
                  whitespace:true,
                  message: '名称不能为空',
                },  /*{
                  max: 10,
                  message: '名称长度不能超过10',
                },*/
              ],
            })(<Input placeholder="请输入"  style={{width:'70%'}}/>)}
          </FormItem>

          <FormItem label="连接类型" hasFeedback {...formItemLayout}>
            {getFieldDecorator('databaseType', {
              initialValue: item.databaseType,
              validateTrigger: [ 'onBlur'],
              rules: [
                {
                  required: true,
                  message: '请选择类型',
                },
              ],
            })(<Select placeholder="请选择" style={{width:'70%'}} onChange={onChangeUrl}>
              {this.state.queryProductLevData && this.state.queryProductLevData.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

            </Select>)}
          </FormItem>
          <FormItem label="JDBC URL" hasFeedback {...formItemLayout}>
            {getFieldDecorator('databaseJdbcUrl', {
              initialValue: modalType ==='create'?this.state.URL:item.databaseJdbcUrl,
              //检验节点
              validateTrigger: [ 'onBlur'],
              rules: [

                {
                  required: true,
                  whitespace:true,
                  message: 'URL不能为空',
                },
              ],
            })(<Input  placeholder="请输入"

                       style={{width:'70%'}} />)}
          </FormItem>
          <FormItem label="用户名" hasFeedback {...formItemLayout}>
            {getFieldDecorator('databaseUsername', {
              initialValue: item.databaseUsername,
              //检验节点
              validateTrigger: [ 'onBlur'],
              rules: [

                {
                  required: true,
                  whitespace:true,
                  message: '帐号不能为空',
                },
              ],
            })(<Input  placeholder="请输入"

                       style={{width:'70%'}} />)}
          </FormItem>
          <FormItem label="密码" hasFeedback {...formItemLayout}>
            {getFieldDecorator('databasePassword', {
              initialValue: item.databasePassword,
              //检验节点
              validateTrigger: [ 'onBlur'],
              rules: [

                {
                  required: true,
                  whitespace:true,
                  message: '密码不能为空',
                },
              ],
            })(<Input  placeholder="请输入"

                       style={{width:'70%'}} />)}
          </FormItem>
         <FormItem label="连接描述" hasFeedback {...formItemLayout}>
            {getFieldDecorator('databaseDesc', {
              initialValue: item.databaseDesc,
              /*rules: [
                {
                  required: true,
                  message: '请输入描述',
                },
              ],*/
            })(<TextArea autosize={{ minRows: 3, maxRows: 6 }} placeholder="请输入" style={{ width: '70%' }} />)}
          </FormItem>

        </Form>
      </div>
    )
  }
}
IndexForm.propTypes = {

}
export default Form.create()(IndexForm)


