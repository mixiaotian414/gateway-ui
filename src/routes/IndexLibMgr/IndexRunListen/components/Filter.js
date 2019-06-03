import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Button, DatePicker,Input,InputNumber,Select,TreeSelect,Collapse} from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
/**
 * @Title:指标库管理=》指标跑数监控过滤器
 * @Description:Filter查询组件(生命周期模式)
 * @Author: chenshuai
 * @Time: 2019/4/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const Option = Select.Option
class Filter extends Component {
  state = {
  };

  handleFormReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.handleFormReset();
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
  handleChange(value) {
    console.log(`selected ${value}`);
  }


  render() {
    const { LedgerType } =this.props
    const { getFieldDecorator } = this.props.form;
//处理提交数据
    const handleFields = (fields) => {
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const {formValues}=this.props
      //要注意解构赋值的顺序
      let  Format = 'YYYYMMDD';
      const {etlDate} = fields
      let changefields={
        ...formValues,
        ...fields,
      };
      if (etlDate) {
        changefields={
          ...changefields,
          'etlDate':etlDate.format(Format),
        }
      }else{
        changefields={
          ...changefields,
          'etlDate':undefined
        }
      }
      return changefields
    }

    /**
     * 点击搜索按钮
     * */
    const handleSubmit = (e) => {
      e.preventDefault();
      const toSubmit = this.props.toSubmit

      this.props.form.validateFields(function (err, fieldsValue) {
        const changefields = handleFields(fieldsValue)
        toSubmit(changefields)
      });
      return false;
    }
    const onChange=(date, dateString)=> {
     //console.log(date, dateString);
    }
    return (
      <div className={styles.tableList}>
        <Form layout="inline" ref="form" onSubmit={handleSubmit}>
          <FormItem label="数据日期:">
            {getFieldDecorator('etlDate',{
            })(
              <DatePicker
                //onChange={onChange}
                style={{width:150}}
              />
            )}
          </FormItem>
          <FormItem label="指标名称:">
            {getFieldDecorator('productName',{
            })(
              <Input  placeholder="请输入" style={{width:150}} />
            )}
          </FormItem>
          <FormItem label="指标编码:">
            {getFieldDecorator('productCode',{
            })(
              <Input  placeholder="请输入" style={{width:150}} />
            )}
          </FormItem>
          <FormItem label="跑批状态:">
            {getFieldDecorator('taskSts',{
            })(
              <Select placeholder="请选择" style={{width:150}} mode="multiple"
                      //defaultValue={['a10', 'c12']}
                      onChange={this.handleChange} >
                {this.getType()}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary"  loading={this.props.loading.effects[LedgerType+'/query']}  htmlType="submit"  >查询</Button>
          </FormItem>
          <FormItem>
            <Button onClick={this.handleFormReset} htmlType="submit" >重置</Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}
Filter.propTypes = {
  loading: PropTypes.object,
  handleFormReset:PropTypes.func,
  toSubmit:PropTypes.func,
}
export default (Form.create()(Filter))


