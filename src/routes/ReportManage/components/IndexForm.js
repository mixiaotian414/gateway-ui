import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {Form, Input, TreeSelect, Radio, Modal, Row, Col, Select, Button, DatePicker, message} from 'antd'
import moment from 'moment'
import {request} from 'utils'

const {TextArea} = Input;

import AllocateModal from './AllocateModal'

/**
 * @Title:报表管理》自定义指标》创建指标》输入表单
 * @Description:指标树组件
 * @Author: mxt
 * @Time: 2018/4/12
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
let Format = 'YYYY-MM-DD';
const FormItem = Form.Item
//TODO 添加分类时，数据重写

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}

class IndexForm extends Component {
  state = {
    isShow: false,
    //公式配置
    allocateModalVisible: false,
    //添加类别
    addTypeVisible: false,
    currentItem: {},
    valueText: "",
    item: this.props.item || {},

    treeData: []
  }
  componentWillMount = () => {
    const item = this.props.item || {};
    let valueText = item.formula
    let translate = item.formulaText
    let isShow = false
    if (item.status === "1") {
      isShow = true
    }
    this.setState({
      item,
      isShow,
      valueText,
      translate
    })
    //目录树形
    this.fetch()
  }
  fetch = () => {

    this.promise = request({
      url: "/gateway/deriveproddirtree.json",
      method: 'post',
      data: {},
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS !== '1') {
        return
      }
      if (result.RSP_BODY) {

        const treeData = result.RSP_BODY.deriveProdList
        let treeString = JSON.stringify(treeData)
        let treeTrans = treeString.replace(/name/g, "title").replace(/code/g, "value")

        let treeDataJson = JSON.parse(treeTrans);
        this.setState({
          treeData: treeDataJson
        })
      }

    })
  }
  onRadioChange = (e) => {
    this.setState({
      isShow: e.target.value === "1" ? true : false
    })
  }

  getType() {
    const array = this.props.getTypeList
    const select_list = array.length && array.map(k => ({
      ...k,
      dict_Name: `${k.dictName}`,
      dict_Value: `${k.dictValue}`
    }));
    if (select_list.length > 0) {
      return select_list.map(k => <Select.Option key={JSON.stringify(k)} title={k.dict_Name}
                                                 value={k.dict_Value}>{k.dict_Name}</Select.Option>)
    }
    return null;
  }

  render() {
    const {item} = this.state;
    const {getFieldDecorator, setFieldsValue, BussList, modalType} = this.props;
    //写死的业务功能1001
    let ispublic = BussList && BussList.includes(1001)
    let type = modalType === 'create' ? true : false

    const allocatemodalProps = {
      valueText: this.state.valueText,
      translate: this.state.translate,
      visible: this.state.allocateModalVisible,
      maskClosable: false,
      title: '配置公式',
      wrapClassName: 'vertical-double-center-modal',
      width: "800px",
      okText: "保存",
      cancelText: "取消",
      /*   footer:<Button style={{float:'center'}} type="primary" onClick={()=>{this.setState({allocateModalVisible:false})}}>完成</Button>,*/
      onOk: (data) => {
        /* dispatch({
           type: `user/${modalType}`,
           payload: data,
         })*/
        setFieldsValue({"formula": data.valueText})

        this.setState({
          allocateModalVisible: false,
          valueText: data.valueText
        })
      },
      onCancel: () => {
        this.setState({allocateModalVisible: false})
      },
    }
    const addTypeVisibleProps = {
      item: this.state.currentItem,
      visible: this.state.addTypeVisible,
      maskClosable: false,
      title: '添加分类',
      wrapClassName: 'vertical-double-center-modal',
      width: "400px",
      footer: <Button style={{float: 'center'}} type="primary"
                      onClick={
                        () => {
                          message.info("添加成功")
                          this.setState({addTypeVisible: false})
                        }
                      }>完成</Button>,
      onCancel: () => {
        this.setState({addTypeVisible: false})
      },
    }

    return (
      <div>
        <Form layout="horizontal">
          <FormItem label="指标编号" hasFeedback {...formItemLayout}>
            {getFieldDecorator('code', {
              initialValue: item.code,
              //检验节点
              validateTrigger: ['onBlur'],
              rules: [
                type ? {
                  validator: (rule, value, callback) => {
                    if (!value) {
                      this.setState({
                        validateSuccess: false
                      })
                      return
                    }
                    this.promise = request({
                      url: "/gateway/utilsvalidateVal.json",
                      method: 'post',
                      data: {
                        tab: "pr_derive_product",
                        col: "code",
                        val: value
                      },
                    }).then((result) => {
                      if (result.RSP_HEAD.TRAN_SUCCESS !== '1') {
                        callback('系统错误')
                      }
                      if (result.RSP_BODY.flag) {
                        callback('编码已存在')

                      }
                      callback()
                    })
                  }
                } : {},
                {
                  pattern: /^[0-9a-zA-Z]{0,11}$/g,
                  message: '请输入正确编码，编码只允许字母加数字组合且小于11位！',
                },
                {
                  required: true,
                  whitespace: true,
                  message: '编码不能为空',
                },
              ],
            })(<Input placeholder="请输入"
                      disabled={!type}
                      style={{width: '70%'}}/>)}
          </FormItem>
          <FormItem label="指标名称" hasFeedback {...formItemLayout}>
            {getFieldDecorator('name', {
              initialValue: item.name,
              rules: [
                {
                  required: true,
                  //必选时，空格是否会被视为错误
                  whitespace: true,
                  message: '名称不能为空',
                }, {
                  max: 10,
                  message: '名称长度不能超过10',
                },
              ],
            })(<Input placeholder="请输入" style={{width: '70%'}}/>)}
          </FormItem>
          <FormItem label="指标目录" hasFeedback {...formItemLayout}>
            {getFieldDecorator('directoryId', {
              initialValue: item.directoryId,
              /*    trigger:"onSelect",
                  valuePropName:"key",*/
              rules: [
                {
                  required: true,
                  message: '请选择目录',
                },
              ],
            })(<TreeSelect
              style={{width: '70%'}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              treeData={this.state.treeData}
              placeholder="请选择"
              treeDefaultExpandAll

            />)}
            {/*<Row   >
              <Col span={8}>
                <Button onClick={()=>{ this.setState({addTypeVisible:true})}} style={{marginTop:'5px'}} icon="plus">添加目录</Button>
              </Col>
            </Row>*/}
          </FormItem>
          <FormItem label="指标公式" {...formItemLayout}>
            <Row>
              <Col span={20}>
                {getFieldDecorator('formula', {
                  initialValue: item.formula,
                  rules: [
                    {
                      required: true,
                      message: '请配置公式',
                    },
                  ],
                  /*      rules: [{ required: true, message: 'Please input the captcha you got!' }],*/
                })(
                  <TextArea disabled autosize={{minRows: 4, maxRows: 6}}/>
                )}
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Button onClick={() => {
                  this.setState({allocateModalVisible: true})
                }} style={{marginTop: '5px'}} icon="tool">配置公式</Button>
              </Col>
            </Row>
          </FormItem>

          {type && ispublic && <FormItem label="是否公开"  {...formItemLayout}>
            {getFieldDecorator('isPublic', {
              initialValue: item.isPublic,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(<Radio.Group>
              <Radio value="0">否</Radio>
              <Radio value="1">是</Radio>
            </Radio.Group>)}
          </FormItem>}

          <FormItem label="指标频度" hasFeedback {...formItemLayout}>
            {getFieldDecorator('frequency', {
              initialValue: item.frequency,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(<Select style={{width: '70%'}} placeholder="请选择">
              {/*  {queryProductLevData && queryProductLevData.map((item, key) => <Select.Option value={item.value} key={key}>{item.label}</Select.Option>)}*/}
              {this.getType()}
            </Select>)}
          </FormItem>
          <FormItem label="指标类别"  {...formItemLayout}>
            {getFieldDecorator('category', {
              initialValue: item.category,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(<Radio.Group>
              <Radio value="1">计划类</Radio>
              <Radio value="0">进度类</Radio>
              <Radio value="2">其他</Radio>
            </Radio.Group>)}
          </FormItem>
          <FormItem label="可否汇总"  {...formItemLayout}>
            {getFieldDecorator('canSum', {

              initialValue: item.canSum,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(<Radio.Group>
              <Radio value="1">是</Radio>
              <Radio value="0">否</Radio>
            </Radio.Group>)}
          </FormItem>

          <FormItem label="指标状态"  {...formItemLayout}>
            {getFieldDecorator('status', {
              initialValue: item.status,
              rules: [
                {

                  required: true,
                  message: '请选择',
                },
              ],
            })(<Radio.Group onChange={this.onRadioChange}>
              <Radio value="1">启用</Radio>
              <Radio value="0">停用</Radio>
            </Radio.Group>)}
          </FormItem>
          {!this.state.isShow && <FormItem label="停用时间" hasFeedback {...formItemLayout}>
            {getFieldDecorator('unuseDate', {
              initialValue: item.unuseDate ? moment(item.unuseDate) : item.unuseDate,
              rules: [
                {
                  required: true,
                  message: '请选择',
                },
              ],
            })(<DatePicker
              format={Format}
              placeholder="请选择">
            </DatePicker>)}
          </FormItem>}
          <FormItem label="指标备注" hasFeedback {...formItemLayout}>
            {getFieldDecorator('remark', {
              initialValue: item.remark,
              rules: [
                {
                  required: true,
                  message: '请输入备注',
                },
              ],
            })(<Input placeholder="请输入" style={{width: '70%'}}/>)}
          </FormItem>

        </Form>
        {this.state.allocateModalVisible && <AllocateModal {...allocatemodalProps} />}
        {this.state.addTypeVisible &&
        <Modal {...addTypeVisibleProps} >
          <p><Input placeholder="请输入类别"></Input></p>
        </Modal>}
      </div>
    )
  }
}

IndexForm.propTypes = {}
export default Form.create()(IndexForm)


