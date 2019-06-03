import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Input, Select, Button,message } from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
import {OrganTree,CurSelect} from 'components'
import { request } from 'utils'
/**
 * @Title:指标库管理》指标管理》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;

class Filter extends Component {
  state = {
    indexList:[]
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

  render() {

    const { getFieldDecorator,setFieldsValue,getFieldValue } = this.props.form;
    const {LedgerType,form,loading,IndexTypeList}=this.props

    const {indexList}=this.state

    const onSelect=(value,option)=>{//选择指标类型
      setFieldsValue({id:""})
      console.log(option,'aa')

        this.promise = request({
          url:"/gateway/indexlist.json",
          method: 'post',
          data: {
            productType:value,
            id:"-1",

          },
        }).then((result) => {
          if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
            return
          }
          const indexList = result.RSP_BODY.indexList||[]


          this.setState({indexList})
        })


    }

   const onChange=(value,option)=>{//选择指标类型

      setFieldsValue({id:""})

        this.promise = request({
          url:"/gateway/indexlist.json",
          method: 'post',
          data: {
            productType:[value],
            id:"-1",

          },
        }).then((result) => {
          if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
            return
          }
          const indexList = result.RSP_BODY.indexList||[]


          this.setState({indexList})
        })


    }


    /**
     * 点击搜索按钮
     * */
    const handleSubmit = (e) => {
      e.preventDefault();
      const toSubmit = this.props.toSubmit
      this.props.form.validateFields(function (err, fieldsValue) {
        if(err){
          message.error("请选择指标")
          return
        }

        toSubmit(fieldsValue)
      });
      return false;
    }
    return (
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={handleSubmit} layout="inline">
                <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                  <Col md={8} sm={24}>
                    <FormItem label="指标类型">
                      {getFieldDecorator('productType',{
                          rules: [{
                            required: true,
                            message:"请选择"
                          }]
                        }
                      )(
                        <Select
                        /*  onSelect={onSelect} */

                                onChange={onChange}  placeholder="请选择">
                          {IndexTypeList && IndexTypeList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}
                        </Select>
                      )}
                    </FormItem>

                  </Col>
                  <Col md={6} sm={24}>
                    <FormItem label="指标名称">
                      {getFieldDecorator('id',{
                        rules: [{
                          required: true,
                          message:"请选择"
                        }]
                      })(
                        <Select  placeholder="请选择">
                          {indexList && indexList.map((item, key) => <Select.Option value={item.id} key={key}>{item.productName}</Select.Option>)}
                        </Select>
                      )}
                    </FormItem>
                  </Col>
                  <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit"
                      loading={loading.effects[LedgerType + '/query']}
              >查询</Button>
      {/*        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>*/}

            </span>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
    );
  }
}
Filter.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
  handleFormReset:PropTypes.func,
  toSubmit:PropTypes.func,
}
export default (Form.create()(Filter))


