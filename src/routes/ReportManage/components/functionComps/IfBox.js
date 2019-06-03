import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Card,Icon, Modal, Row,Col ,Select,Button,message ,DatePicker } from 'antd'
const FormItem = Form.Item;
const { TextArea } = Input;
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



class IfBox extends React.Component {

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
    }
  }
  componentDidMount () {

  }
  focusIndex =(name)=>{
      this.setState({
        currentFocus:name
      })

  }



  handleSubmit = (e) => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        const {param} =this.props
        let revStr =param+'('+values.names+'）'

      /*  console.log(revStr)*/
       this.props.onSave(revStr)

      }
    });
  }


  render () {
    const { getFieldDecorator, getFieldValue,setFieldsValue } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 0 },
        sm: { span: 0 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 4, offset:20},
        sm: { span: 4, offset: 20 },
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



    return (
      <div className={styles.configMain}>

        <Row gutter={16}>
          <Col span={24}>
            <Card
              bodyStyle={{height:'200px'}}
              title={this.state.param+"函数参数"} style={{   }} >
              <Form   onSubmit={this.handleSubmit}>
                <FormItem
                  {...formItemLayout}
                  label=""
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
                    <TextArea placeholder="逻辑表达式：x>0.5&&x<20||x>30 取值:10+0.5*x，其中,x可以是指标代码，常量，表达式。
逻辑运算符：等于==、大于>、小于<、小于等于<=、大于等于>=、不等于!=、并且&&、或者||
算术运算符：+-*/^()
注：不允许“100<=x<=200”，应换写成“100<=x&&x<=200”"
                              autosize={{ minRows: 4, maxRows: 4 }}
                           onFocus={(e)=>{ this.focusIndex(`names`)} }
                           ref={c => this.setState({names:c})}
                           style={{ width: '100%', }} />
                  )}
                </FormItem>

                <FormItem {...formItemLayoutWithOutLabel}>
                  <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
              </Form>

            </Card>
          </Col>

        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <IndexCard {...cardprops}></IndexCard>
          </Col>
        </Row>
      </div>
    )
  }
}

IfBox.propTypes = {
  /*form: PropTypes.object,
  fetchData: PropTypes.string,*/
}

export default (Form.create()(IfBox))
