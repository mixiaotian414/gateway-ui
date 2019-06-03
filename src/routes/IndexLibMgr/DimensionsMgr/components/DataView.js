import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Table,Modal,Button,message,Select,TreeSelect,Input } from 'antd'
import styles from '../index.less'
/**
 * @Title:数据查看维度信息
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const Option = Select.Option
const confirm = Modal.confirm;
const TreeNode = TreeSelect.TreeNode;
class DataView extends Component{
  state = {
  }

  handleFormReset = () => {

    const { resetFields } = this.props.form;
    resetFields();
  }
  render(){
    const { LedgerType,pagination1 } = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;
    const columns = [{
      title: '维度值',
      dataIndex: "dimensionValue",
      key: "dimensionValue",
      align: 'left',
    },{
      title: '维度值中文',
      dataIndex: "dimensionKey",
      key: "dimensionKey",
      align: 'left',
    },];
    //分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination1,
    };
    //列表切换分页时所用取数据方法
    const handleTableChange = ( pagination1 ) => {
      const filterkey = this.props.form.getFieldValue("filterKey");
      const filtervalue = this.props.form.getFieldValue("filterValue");

      const params = {
        ...this.props.dataViewFormValues,
        filterKey: filterkey || '',
        filterValue: filtervalue || '',
        page: pagination1.current,
        pageSize: pagination1.pageSize,
      };
      this.props.onDataViewTableChange(params)

    }
    const ModalProps = {
      visible: this.props.dataViewVisible,
      maskClosable: false,
      title:'数据查看',
      wrapClassName:"vertical-center-modal",
      width:'780px',
      footer:
        [
          <Button key="1" type="primary" onClick={e=>this.props.onDataViewCancel(false)}>关闭</Button>
        ],
      onCancel:()=>{this.props.onDataViewCancel(false)}
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      const onDataViewOk = this.props.onDataViewOk

      this.props.form.validateFields(function (err, fieldsValue) {
       onDataViewOk(fieldsValue)
      });
      return false;
    }

    return(<div>
      <Modal
        {...ModalProps}
      >
        <Row>
          <Form layout="inline" ref="form" onSubmit={handleSubmit} >
            <FormItem  label="维度值" >
              {getFieldDecorator('filterValue', {
              })(
                <Input  placeholder="请输入" />
              )}
            </FormItem>
            <FormItem  label="维度值中文" >
              {getFieldDecorator('filterKey', {
              })(
                <Input  placeholder="请输入" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary" loading={this.props.loading.effects[LedgerType+'/queryDataView']}  htmlType="submit"  >查询</Button>
            </FormItem>
            <FormItem>
              <Button onClick={this.handleFormReset} htmlType="submit" >重置</Button>
            </FormItem>
          </Form>
        </Row>
        <Row>
          <Table
            size="small"
            rowKey={record => record.dimensionValue}
            style = {{ paddingTop:'10px' }}
            columns={columns}
            rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
            dataSource={this.props.dataViewList}
            loading={this.props.loading.effects[LedgerType+'/queryDataView']}
            pagination={paginationProps}
            onChange={handleTableChange}
          />
        </Row>
      </Modal>
    </div>)
  }
}
export default Form.create()(DataView)
