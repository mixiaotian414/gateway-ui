import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Input,  Button,TreeSelect,Select} from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
import {OrganTree,CurSelect} from 'components'
/**
 * @Title:报表管理》自定义指标列表》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2018/3/16
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;

class Filter extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
  };
  handleFormReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.handleFormReset();
  }
  getType() {
    const array = this.props.getTypeList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }
  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const {querySelectTreeData,LedgerType,form}=this.props
    let   Format = 'YYYY-MM-DD';
    const onChange = (value) => {
    }
    return (
      <div>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="指标编号">
              {getFieldDecorator('code')(
                <Input  placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="指标名称">
              {getFieldDecorator('name')(
                <Input  placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="指标体系">
              {getFieldDecorator('directoryId')(
                <TreeSelect
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                   treeData={querySelectTreeData||[]}

                  placeholder="请选择"
                  treeDefaultExpandAll
                  onChange={onChange}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" loading={this.props.loading.effects['dayLedger/query']}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="取数周期">
              {getFieldDecorator('frequency')(
                <Select placeholder="请选择"  >
                  {/*  {queryCurData && queryCurData.map((item, key) => <Select.Option value={item.value} key={key}>{item.label}</Select.Option>)}*/}
                  {this.getType()}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="指标状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择"  >
                  {/*  {queryCurData && queryCurData.map((item, key) => <Select.Option value={item.value} key={key}>{item.label}</Select.Option>)}*/}
                  <Select.Option value='0' key='0'>无效</Select.Option>
                  <Select.Option value='1' key='1'>有效</Select.Option>
                </Select>
              )}
            </FormItem>
          </Col>


        </Row>
      </div>
    );
  }
  render() {
//处理提交数据
    const handleFields = (fields) => {
      //formValues 将所有表单数据存到state里，这样分页时会带着查询条件

      const {formValues,LedgerType}=this.props
      let   Format = 'YYYY-MM-DD';

      const {DATE_ID} = fields
      //要注意解构赋值的顺序
      let changefields={
        ...formValues,
        ...fields,
      };
      //方便以后前后台联调
      if (DATE_ID) {
        changefields={
          ...changefields,
          /* 'date': [DATE_ID[0].format('YYYY-MM-DD'), DATE_ID[1].format('YYYY-MM-DD')],
           'start_date':DATE_ID[0].format('YYYYMMDD'),
           'end_date':DATE_ID[1].format('YYYYMMDD'),*/
          'DATE_ID':DATE_ID.format(Format),
        }
      }else{
        changefields={
          ...changefields,
          /*  'date': undefined,
            'start_date':undefined,
            'end_date':undefined,*/
          'DATE_ID':undefined
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
        if (err) {
          return false
        }

        const changefields = handleFields(fieldsValue)
        toSubmit(changefields)
      });

    }
    return (
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>
          <Form onSubmit={handleSubmit} layout="inline">
            {this.renderSimpleForm()}
          </Form>
        </div>
      </div>
    );
  }
}
Filter.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
  formValues:PropTypes.object,
  queryCurData:PropTypes.array,
  querySelectTreeData:PropTypes.array,
  queryProductLevData:PropTypes.array,
  handleFormReset:PropTypes.func,
  toSubmit:PropTypes.func,
}
export default (Form.create()(Filter))


