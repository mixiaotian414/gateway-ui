import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Form, Input,Select,message,Tabs } from 'antd'

import { request } from 'utils'

const TabPane = Tabs.TabPane;
/**
 * @Title:指标库管理》指标管理》输入表单
 * @Description:表单
 * @Author: mxt
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
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

    this.setState({
      item
    })
  }


  render(){
    const { item} = this.state;
    const { getFieldDecorator,modalType } = this.props;
    let type=modalType==='create'?true:false


    return(
      <div>
        <Form layout="horizontal">
          {type ? "" : getFieldDecorator('id', {
            initialValue: item.id,
          })(<Input placeholder="请输入" hidden />)
          }
        <Tabs defaultActiveKey="1">
          <TabPane tab="基本信息" key="1">

            <FormItem label="模型名称" hasFeedback {...formItemLayout}>
              {getFieldDecorator('connectionName', {
                initialValue: item.connectionName,
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
            <FormItem label="URL" hasFeedback {...formItemLayout}>
              {getFieldDecorator('databaseJdbcUrl', {
                initialValue: item.databaseJdbcUrl,
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
            <FormItem label="模型类型" hasFeedback {...formItemLayout}>
              {getFieldDecorator('databaseType', {
                initialValue: item.databaseType,
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

            <FormItem label="帐号" hasFeedback {...formItemLayout}>
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

          </TabPane>
          <TabPane tab="数据字段"
                   //disabled
                   key="2">

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


          </TabPane>



        </Tabs>
        </Form>
      </div>
    )
  }
}
IndexForm.propTypes = {

}
export default Form.create()(IndexForm)


