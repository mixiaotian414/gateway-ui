import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Modal,Input, Select } from 'antd'

/**
 * @Title:维度过滤组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const confirm = Modal.confirm;
const Option = Select.Option

class CollectionModal extends Component{
  state={

  }
  getReportType() {
    if (this.props.getReportType) {
      const select_list = this.props.getReportType.length && this.props.getReportType.map(k => ({ ...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}` }));
      if (select_list.length > 0) {
        return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
      }
      return null;
    }
  }


  render(){
    const { getFieldDecorator, validateFields } = this.props.form
    const {  LedgerType,item } = this.props;

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    }
    const ModalProps = {
      visible: this.props.visible,
      maskClosable: false,
      title:this.props.title,
      wrapClassName:"vertical-center-modal",
      width:'600px',
      onOk:()=>{handleOk()},
      onCancel:()=>{handleCancel()}
    }

    const handleOk = () => {
      validateFields((errors,values) => {
        if (errors) {
          return
        }
        values.productIds = this.props.selectIndexIds
        this.props.onOk(values)
        this.props.form.resetFields()
      })
    }

    const handleCancel = ()=>{
      this.props.onCancel()
      this.props.form.resetFields()
    }

    return(<div>
      <Modal
        {...ModalProps}
      >
        <Form>
          <Row>
            <FormItem {...formItemLayout} label="报表名称" hasFeedback >
              {getFieldDecorator('reportName', {
                //initialValue:item.title,
                rules: [
                  {
                    required: true,
                    message: '报表名称不能为空',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="所在目录" hasFeedback >
              {getFieldDecorator('reportDirName', {
                initialValue:item.reportDirName,
              })(<Input placeholder="请输入" disabled />)}
              {getFieldDecorator('reportDirId', {
                initialValue:item.id,
              })(<Input placeholder="请输入" type="hidden" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="报表类型" hasFeedback >
              {getFieldDecorator('reportType', {
                rules: [
                  {
                    required: true,
                    message: '报表类型不能为空',
                  },
                ],
              })(<Select placeholder="请选择" style={{width:'277px'}}>
                {this.getReportType()}
              </Select>)}
            </FormItem>
          </Row>
        </Form>

      </Modal>
    </div>)
  }
}

export default Form.create()(CollectionModal)
