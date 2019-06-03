import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Card,Icon, Modal, Row,Col ,Select,Button,message ,DatePicker } from 'antd'
const FormItem = Form.Item;

import { request } from 'utils'
import styles from './IfBox.less';
import { arrayToSelectTree } from 'utils'
import IndexCard from './../IndexCard';
let Format='YYYY-MM-DD'
/**
 * @Title:报表管理》自定义指标》公式配置》if函数
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/4/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */



class TIMEBox extends React.Component {

  constructor (props) {
    super(props)
    const {
      fetchData={},
      param
    } = props
    this.state = {
      param,
      currentFocus:undefined,
      inputRef:undefined,
      timeInputAble:false,
    }
  }
  componentDidMount () {

  }
  focusIndex =(name)=>{
      this.setState({
        currentFocus:name
      })

  }

  handleFields = (fields) => {
    const { timeValue } = fields
    if (timeValue) {
      fields.timeValue =  fields.timeValue.format('YYYY-MM-DD')
    }
    return fields
  }

  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {param} =this.props
        values = this.handleFields(values)
        let revStr =param+'('
        for (let key in values){
          if(key==='timeType'){
              if(values[key]!=='1'){
                revStr+=values[key]+','
              }
          }else{
            revStr+=values[key]+','
          }
        }
        revStr=revStr.substr(0,revStr.length-1)+')'
       this.props.onSave(revStr)

      }
    });
  }


  render () {
    const { getFieldDecorator, getFieldValue,setFieldsValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 20, offset: 4 },
      },
    };

    const cardprops ={
      onSelect :  (selectedKeys, info) => {
        let  currentFocus= this.state.currentFocus
        if (!currentFocus){
          message.info("请选择输入框")
          return
        }
        if(selectedKeys.length>0)
        {
          let rev = info.selectedNodes[0].props.title
          let treenode={value:selectedKeys[0],type:'index',title:rev}
          const currentText = !getFieldValue(currentFocus)?treenode.value:getFieldValue(currentFocus)+treenode.value;
          setFieldsValue({
            [currentFocus]:currentText
          })
          const inputRef=this.state[currentFocus]
          /*  console.log("inputRef",inputRef)*/
          inputRef.focus()

        }
      }
    }
    const names = getFieldValue('names')?getFieldValue('names'):"参数一";
    let property
    const timeType = getFieldValue('timeType')?getFieldValue('timeType'):"参数二";
    if(timeType&&timeType==='1')
    {
      const timeValue = getFieldValue('timeValue')?getFieldValue('timeValue').format('YYYY-MM-DD'):"参数二";
      property=timeValue
    }else{
      property=timeType
    }
    return (
      <div className={styles.configMain}>
        <Row gutter={16}>
          <Col span={24}>
            <FormItem
              {...formItemLayout}
              label="预览"
              required={false}
            >
              <span>TIME({names},{property})</span>

            </FormItem>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card
              bodyStyle={{height:'400px'}}
              title={this.state.param+"函数参数"} style={{   }} >
              <Form  style={{height:'350px',overflowY:"scroll"}} onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="参数"
                  required={false}

                >
                  {getFieldDecorator(`names`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: "请输入",
                    }],
                  })(
                    <Input placeholder="参数可选可编辑可嵌套"
                           onFocus={(e)=>{ this.focusIndex(`names`)} }
                           ref={c => this.setState({names:c})}
                           style={{ width: '80%', marginRight: 8 }} />
                  )}
                </FormItem>
                <FormItem {...formItemLayout}
                          label="时间"
                          required={false}
                >
                    {getFieldDecorator(`timeType`, {
                    validateTrigger: ['onChange', 'onBlur'],
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: "Please select",
                    }],
                  })(
                      <Select placeholder="请选择"  style={{ width: '80%', marginRight: 8 }} onSelect={(value)=>{value!=="1"?this.setState({timeInputAble:false}):this.setState({timeInputAble:true})}}>
                      {/*  {queryCurData && queryCurData.map((item, key) => <Select.Option value={item.value} key={key}>{item.label}</Select.Option>)}*/}
                        <Select.Option value='1' key='1'>MMDD/YYMMDD</Select.Option>
                        <Select.Option value='2' key='2'>上月</Select.Option>
                        <Select.Option value='3' key='3'>上季</Select.Option>
                        <Select.Option value='4' key='4'>去年</Select.Option>
                      </Select>
                  )}
                </FormItem>
                {this.state.timeInputAble&&<FormItem {...formItemLayout}
                          label="值"
                          required={false}>
                    {getFieldDecorator(`timeValue`, {
                    rules: [{
                      required: true,
                    }],
                  })(
                      <DatePicker format={Format}  style={{ width: '80%', marginRight: 8 }}/>
                  )}
                </FormItem>}
                <FormItem {...formItemLayoutWithOutLabel}>
                  <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
              </Form>
            </Card>
          </Col>

          <Col span={12}>
            <IndexCard {...cardprops}></IndexCard>

          </Col>
        </Row>
      </div>
    )
  }
}

TIMEBox.propTypes = {
  /*form: PropTypes.object,
  fetchData: PropTypes.string,*/
}

export default (Form.create()(TIMEBox))
