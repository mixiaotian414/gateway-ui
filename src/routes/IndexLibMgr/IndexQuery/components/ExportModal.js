import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Modal,Input, Select } from 'antd'

/**
 * @Title:导出文件modal
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/5/16
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const confirm = Modal.confirm;
const Option = Select.Option

class ExportModal extends Component{
  state={

  }
  render(){
    const { getFieldDecorator, validateFields } = this.props.form
    const {  LedgerType } = this.props;

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
        const params ={
          ...values,
          ...this.props.exportparams
        }
        this.props.onOk(params)
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
            <FormItem {...formItemLayout} label="文件名称" hasFeedback >
              {getFieldDecorator('fileName', {
                initialValue:this.props.indexName ===""?undefined:this.props.indexName,
              })(<Input placeholder="可以为空（默认为指标查询报表.xlsx）" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="sheet页名称" hasFeedback >
              {getFieldDecorator('sheet', {
              })(<Input placeholder="可以为空" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="每个sheet页最大条数" hasFeedback >
              {getFieldDecorator('sheetRows', {

              })(<Input placeholder="可以为空（默认为50000）"  />)}
            </FormItem>
          </Row>
        </Form>

      </Modal>

    </div>)
  }

}

export default Form.create()(ExportModal)
