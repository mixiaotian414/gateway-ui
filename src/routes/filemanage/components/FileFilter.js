import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,Icon,  Form, Button, DatePicker,Input,Modal,message,Select,Upload,TreeSelect,Collapse} from 'antd';
import PropTypes from 'prop-types'

import styles from './Filter.less';
/**
 * @Title:列表DEMO——>查询，上传组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: chenshuai
 * @Time: 2019/3/12
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { RangePicker } = DatePicker;
const Option = Select.Option

class FileFilter extends Component {
  state = {
    selectedRowKeys:[],
    fileList: [],
    uploading: false,
    filename:"",
  };

  handleFormReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.handleFormReset();
  }

  render() {
    const { LedgerType,changeModal,modalVisible,ids,selectedRowKeys } =this.props
    const { getFieldDecorator } = this.props.form;


    let   Format = 'YYYY-MM-DD';
//处理提交数据
    const handleFields = (fields) => {
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const {formValues}=this.props
      let  Format = 'YYYYMMDD';
      const {dateId} = fields
      //要注意解构赋值的顺序
      let changefields={
        ...formValues,
        ...fields,
      };
      //方便以后前后台联调
      if (dateId) {
        changefields={
          ...changefields,
          'dateId':dateId.format(Format),
        }
      }else{
        changefields={
          ...changefields,
          'dateId':undefined
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
        <Form layout="inline" ref="form" onSubmit={handleSubmit}>
          <FormItem  label="文件名称"  >
            {getFieldDecorator('name', {
            })(
              <Input placeholder="请输入" disabled={true}/>
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
FileFilter.propTypes = {
  loading: PropTypes.object,
  handleFormReset:PropTypes.func,
  toSubmit:PropTypes.func,
}
export default (Form.create()(FileFilter))


