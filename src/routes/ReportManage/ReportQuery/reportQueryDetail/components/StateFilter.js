import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Select, Button, DatePicker,Checkbox, message } from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
const {  RangePicker } = DatePicker;
import {OrganTree,CurSelect} from 'components'
/**
 * @Title:报表管理》模型管理》报表查询详情》》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2018/5/17
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;
const { Option } = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


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


  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }

  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const {queryCurData,querySelectTreeData,LedgerType,form}=this.props

    let Format ='YYYY-MM-DD';

    const ComProps ={
      form
    }
    return (
      <div>
        <Row gutter={{ md: 6, lg: 12, xl: 24 }}>
          <Col md={6} sm={24}>
            <OrganTree {...ComProps}/>
          </Col>

          <Col md={6} sm={24}>
            <CurSelect {...ComProps}/>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" loading={this.props.loading.effects['dayLedger/query']}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={{/*this.handleFormReset*/}}>重置</Button>

            </span>
          </Col>
        </Row>

        <Row gutter={{ md: 6, lg: 12, xl: 24 }}>
          <Col md={6} sm={24}>
            <FormItem label="期次">
              {getFieldDecorator('DATE_ID')(
                <RangePicker
                  format={Format}>
                </RangePicker>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
                  <Button  style={{ marginLeft: 8 }}type="" onClick={()=>{message.success("导出成功")}} icon="export" >导出Excel</Button>
            </span>
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
      let Format
      switch(LedgerType) {
        case "dayLedger":
          Format = 'YYYY-MM-DD';
          break;
        case "monthLedger":
          Format = 'YYYY-MM';
          break;
        case "yearLedger":
          Format = 'YYYY';
          break;
        default:
          Format = 'YYYY-MM-DD';
      }
      const {DATE_ID} = fields
      //要注意解构赋值的顺序
      let changefields={
        ...formValues,
        ...fields,
      };
      //方便以后前后台联调
      if (DATE_ID) {
        changefields={
          ...fields,
         /* 'date': [DATE_ID[0].format('YYYY-MM-DD'), DATE_ID[1].format('YYYY-MM-DD')],
          'start_date':DATE_ID[0].format('YYYYMMDD'),
          'end_date':DATE_ID[1].format('YYYYMMDD'),*/
          'DATE_ID':DATE_ID.format(Format),
        }
      }else{
        changefields={
          ...fields,
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
        const changefields = handleFields(fieldsValue)
        toSubmit(changefields)
      });
      return false;
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


