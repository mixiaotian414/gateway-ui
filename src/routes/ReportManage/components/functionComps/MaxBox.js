import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Card,Icon, Radio, Row,Col ,Select,Button,message } from 'antd'
const FormItem = Form.Item;

import { request } from 'utils'
import styles from './MaxBox.less';
import { arrayToSelectTree } from 'utils'
import IndexCard from './../IndexCard';
/**
 * @Title:报表管理》自定义指标》公式配置》MAX或MIN函数BOX
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/4/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

let uuid =2;


class MaxBox extends React.Component {

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



  //表单
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  add = () => {
    const { form } = this.props;

    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    // can use data-binding to set
    // important! notify form to detect changes
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  handleSubmit = (e) => {
    const { param } = this.props;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let revStr =param+'('
        for (let key of values.names){
          revStr+=key+','
        }
        revStr=revStr.substr(0,revStr.length-1)+')'
      /*  console.log(revStr)*/
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
    getFieldDecorator('keys', { initialValue: [0,1] });
    const keys = getFieldValue('keys');

    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...(index === 0 ? formItemLayout : formItemLayoutWithOutLabel)}
          label={index === 0 ? 'Param' : ''}
          required={false}
          key={k}
        >
          {getFieldDecorator(`names[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [{
              required: true,
              whitespace: true,
              message: "请输入",
            }],
          })(
            <Input placeholder="参数可选可编辑可嵌套"
                   onFocus={(e)=>{ this.focusIndex(`names[${k}]`)} }
                   ref={c => this.setState({['names['+k+']']:c})}
                   style={{ width: '80%', marginRight: 8 }} />
          )}
          {keys.length > 2? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 2}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });




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
          <Col span={12}>
            <Card
              bodyStyle={{height:'400px'}}
              title={this.state.param+"函数参数"} style={{   }} >
              <Form  style={{height:'350px',overflowY:"scroll"}} onSubmit={this.handleSubmit}>
                {formItems}
                <FormItem {...formItemLayoutWithOutLabel}>
                  <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                    <Icon type="plus" /> Add Params
                  </Button>
                </FormItem>
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

MaxBox.propTypes = {
  /*form: PropTypes.object,
  fetchData: PropTypes.string,*/
}

export default (Form.create()(MaxBox))
