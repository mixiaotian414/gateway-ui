import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Button, DatePicker,Input,InputNumber,Select,TreeSelect,Collapse} from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
/**
 * @Title:指标库管理=》维度管理过滤器
 * @Description:Filter查询组件(生命周期模式)
 * @Author: chenshuai
 * @Time: 2019/4/9
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

  render() {
    const { LedgerType } =this.props
    const { getFieldDecorator } = this.props.form;
//处理提交数据
    const handleFields = (fields) => {
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const {formValues}=this.props
      //要注意解构赋值的顺序
      let changefields={
        ...formValues,
        ...fields,
      };
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
    return (
      <div className={styles.tableList}>
        <Form layout="inline" ref="form" onSubmit={handleSubmit}>
          <FormItem label="类型:">
            {getFieldDecorator('dimensionType',{
            })(
              <Select placeholder="请选择" style={{width:180}}>
                {this.getType()}
              </Select>
            )}
          </FormItem>
          <FormItem label="维度名称:">
            {getFieldDecorator('dimensionName',{
            })(
              <Input  placeholder="请输入" />
            )}
          </FormItem>
          <FormItem>
            <Button type="primary"  loading={this.props.loading.effects[LedgerType+'/query']} htmlType="submit"  >查询</Button>
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


