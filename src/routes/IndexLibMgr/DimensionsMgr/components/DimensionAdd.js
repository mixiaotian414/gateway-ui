import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Table,Modal,Button,message,Select,TreeSelect,Input } from 'antd'

/**
 * @Title:维度新增模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
class DimensionAdd extends Component{
  state={
    item:this.props.item||{},
    status:"",
    dataSourceId:""
  }
  componentWillMount = () => {
    const item = this.props.item||{};
    this.setState({
      item
    })
  }
  getType() {
    if (this.props.getType) {
      const select_list = this.props.getType.length && this.props.getType.map(k => ({ ...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}` }));
      if (select_list.length > 0) {
        return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
      }
      return null;
    }
  }

  render(){
    const { getFieldDecorator, validateFields,validateFieldsAndScroll } = this.props.form
    const {  LedgerType,item,datasourceList,dimensiontableList,dimensionValueList,modalType } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 17
      },
    };

    const ModalProps = {
      visible: this.props.visible,
      maskClosable: false,
      title:this.props.title,
      wrapClassName:"vertical-center-modal",
      width:'850px',
      onOk:()=>{handleOk()},
      onCancel:()=>{handleCancel()}
    }

    const handleOk = () => {
      validateFields((errors,values) => {
        if (errors) {
          return
        }
        const params = {
          id:values.id,
          dimensionCode:values.dimensionCode,
          dimensionName:values.dimensionName,
          dimensionDatasource:this.state.dataSourceId ===""?item.dimensionDatasource:values.dimensionDatasource,
          dimensionTable:values.dimensionTable,
          dimensionKey:values.dimensionKey,
          dimensionValue:values.dimensionValue,
          dimensionType:values.dimensionType
        }

        this.props.onOk(params)
        this.setState({
          dataSourceId:""
        })
        this.props.form.resetFields()
      })
    }

    const handleCancel = ()=>{
      this.props.onCancel()
      this.props.form.resetFields()
    }
    /*选择类型下拉*/
    const selectValue =(value)=>{
      this.setState({
        status:value
      })
    }
    /*数据源下拉*/
    const selectDataSource =(value)=>{
      this.setState({
        dataSourceId:value
      })
      this.props.dispatch({
        type:LedgerType+'/dimensiontable',
        payload: {
          modelDatasource:value
        },
      })
    }
    /*纬度值下拉*/
    const selectDataTable =(value)=>{
      this.props.dispatch({
        type:LedgerType+'/dimensionvalue',
        payload: {
          modelDatasource:this.state.dataSourceId ===""?item.dimensionDatasource:this.state.dataSourceId,
          txt:value,
          isTable:"table"
        },
      })

    }
    //this.state.status ==='0'||(modalType ==='update'&& item.dimensionType ==='0')
    return(<div>
      <Modal
        {...ModalProps}
      >
        <Form>
          <Row gutter={24}>
            <Col span={12}>
            <FormItem {...formItemLayout} label="类型" hasFeedback >
              {getFieldDecorator('dimensionType', {
                initialValue: item.dimensionType,
                rules: [
                  {
                    required: true,
                    message: '维度编码不能为空',
                  },
                ],
              })(
                <Select placeholder="请选择"  style={{width:'276px'}} onChange={selectValue}  >
                  {this.getType()}
                </Select>
              )}
            </FormItem>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              {getFieldDecorator('id', {
                initialValue: item.id,
              })(
                <Input  placeholder="请输入" type="hidden"/>
              )}
              <FormItem {...formItemLayout} label="维度编码" hasFeedback >
                {getFieldDecorator('dimensionCode', {
                  initialValue: item.dimensionCode,
                  validateTrigger: [ 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '维度编码不能为空',
                    },
                  ],
                })(
                  <Input  placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="维度名称" hasFeedback >
                {getFieldDecorator('dimensionName', {
                  initialValue: item.dimensionName,
                  validateTrigger: [ 'onBlur'],
                  rules: [
                    {
                      required: true,
                      message: '维度名称不能为空',
                    },
                  ],
                })(
                  <Input  placeholder="请输入" />
                )}
              </FormItem>
            </Col>
          </Row>
            <Row gutter={24}>
              <Col span={12}>
                <FormItem {...formItemLayout} label="数据源" hasFeedback >
                  {getFieldDecorator('dimensionDatasource', {
                    initialValue: item.connectionName,
                    validateTrigger: [ 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: '数据源不能为空',
                      },
                    ],
                  })(
                    <Select placeholder="请选择"  style={{width:'276px'}} onChange={selectDataSource} >
                      {datasourceList && datasourceList.map((item, key) => <Select.Option key={key} value={item.id} >{item.connectionName}</Select.Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem  {...formItemLayout} label="维度表" hasFeedback >

                  {getFieldDecorator('dimensionTable', {
                    initialValue: item.dimensionTable,
                    validateTrigger: [ 'onBlur'],
                    rules: [
                      {
                        required: true,
                        message: '维度表不能为空',
                      },
                    ],
                  })(
                    <Select placeholder="请选择"  style={{width:'276px'}} onChange={selectDataTable} >
                      {dimensiontableList && dimensiontableList.map((item, key) => <Select.Option key={key} value={item.value} >{item.text}</Select.Option>)}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
              <Row gutter={24}>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="维度值" hasFeedback >
                    {getFieldDecorator('dimensionValue', {
                      initialValue: item.dimensionValue,
                      rules: [
                        {
                          required: true,
                          message: '维度值不能为空',
                        },
                      ],

                    })(
                      <Select placeholder="请选择"  style={{width:'276px'}}  >
                        {dimensionValueList && dimensionValueList.map((item, key) => <Select.Option key={key} value={item.tableColumn} >{item.tableColumn}</Select.Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="维度中文字段" hasFeedback >
                    {getFieldDecorator('dimensionKey', {
                      initialValue: item.dimensionKey,
                      rules: [
                        {
                          required: true,
                          message: '维度中文字段不能为空',
                        },
                      ],
                    })(
                      <Select placeholder="请选择"  style={{width:'276px'}}  >
                        {dimensionValueList && dimensionValueList.map((item, key) => <Select.Option key={key} value={item.tableColumn} >{item.tableColumn}</Select.Option>)}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
        </Form>
      </Modal>
    </div>)
  }
}

export default Form.create()(DimensionAdd)
