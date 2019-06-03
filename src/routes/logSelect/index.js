import React,{Component} from 'react'
import styles from './index.less'
import {connect} from 'dva'
import { Row, Col,Form,Input,Button,DatePicker,Table,Modal,message} from 'antd'

/**
 * @Title:日志查询
 * @Description:
 * @Author: dhn
 * @Time: 2018/5/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const confirm = Modal.confirm
class logSelect extends Component{
  state={
    tableList: [],
    pagination:{
      total: 0,
      pageSize: 10,
      current: 1,
    },
    formValues:{},
    Taketimevalue: '',
  }

  takeTime(date, datestr) {

    this.setState({
      Taketimevalue: datestr
    })
  }
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'logSelect/query',
      payload: {
        page: 1,
        pageSize: 10
      },
    });
  }

  componentWillReceiveProps = (nextprops) => {
    const pagination = nextprops.logSelect.pagination;
    const list = nextprops.logSelect.list;
    this.setState({
      tableList: list,
      pagination,
    })
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render(){

    const { getFieldDecorator} = this.props.form;
    const FormItem = Form.Item
    const handleTableChange = (pagination) => {

      const params = {
        ...this.state.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      console.log('formValues',this.state.formValues)

      this.setState({
          formValues: {...this.state.formValues},
        }
      )

      this.props.dispatch({
        type: 'logSelect/query',
        payload: params,
      });
    }
    const deleteRole = (roleId,appId) =>{
      const { dispatch } = this.props
      confirm({
        title: '确定删除吗',
        okText:'确定',
        cancelText:'取消',
        onOk () {
          dispatch({
            type: 'logSelect/delete',
            payload: {
              appId,
              roleId,
            },
          })
        },
      })
    }
    const columns = [{
      title: '操作员名称',
      dataIndex:"userName",
      key:"userName",
    },{
      title: '操作内容',
      dataIndex:"logContent",
      key:"logContent",
    },{
      title: '操作时间',
      dataIndex:"lastUpdateTime",
      key:"lastUpdateTime",
    },{
      title: '备注',
      dataIndex:"remark",
      key:"remark",
    }];
    //处理提交数据
    const handleFields = (fields) => {
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const formvalues = this.state.formValues
      const {times} = fields
      //要注意解构赋值的顺序
      let changefields={
        ...formvalues
      };
      //方便以后前后台联调
      if (times) {
        changefields={
          ...changefields,
          ...fields,
          'startDate':times[0].format('YYYY-MM-DD HH:mm:ss'),
          'endDate':times[1].format('YYYY-MM-DD HH:mm:ss'),
          page: 1,
          pageSize: 10,
        }
      }else{
        changefields={
          ...changefields,
          ...fields,
          'startDate':undefined,
          'endDate':undefined,
          page: 1,
          pageSize: 10,
          'times':undefined
        }
      }
        changefields={
          ...fields,
          page:1,
          pageSize:10
        }

      if(changefields.paramValue)
      {
        changefields[changefields.queryParam]=changefields.paramValue
      }

      return changefields
    }

    /**
     * 点击搜索按钮
     * */
    const handleSubmit = (e) => {
      e.preventDefault();
      const dispatch = this.props.dispatch

      const that=this;
      this.props.form.validateFields(function (err, fieldsValue) {
        const changefields = handleFields(fieldsValue)
        that.setState({formValues:changefields})
        dispatch({
          type: 'logSelect/query',
          payload: changefields
        })
      });

      return false;
    }

    const reset = () =>{
      this.props.form.resetFields()
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };

    const { RangePicker } = DatePicker;
    const showConfirm = () => {
      const { dispatch } = this.props
      if (!selectedRowKeys) {
        message.warning('请选择一条记录！');
      }else if(selectedRowKeys.length>0){
        const aid = this.props.app.user.appId
        confirm({
          title: '确定删除吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: 'logSelect/delete',
              payload: {
                logIds: selectedRowKeys,
              },
            })
          },
        })

      }else {
        message.warning('请选择一条记录！');
      }

    }
    const {  selectedRowKeys, ids  } = this.props.logSelect
    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record,e) => {
        this.props.dispatch({
          type: 'logSelect/updateState',
          payload: {
            selectedRowKeys: record,
            ids:e,
          },
        })
      },
    };
    return(
      <div  className={styles.tradeAntiFraud}>
            <Form layout="inline" onSubmit={handleSubmit.bind(this)}>
              <FormItem label="用户名称:">
                {getFieldDecorator('userName',{
                })(
                  <Input placeholder="请输入"/>
                )}
              </FormItem>
              <FormItem label="操作时间:">
                {getFieldDecorator('times',{
                  /*  initialValue: '9'*/
                })(
                  <RangePicker style={{ width: '230px' }} />
                )}
              </FormItem>
              <FormItem>
                <Button   type="primary"  htmlType="submit"  style={{marginRight:'15px'}}>查询</Button>
                <Button   type="default"  htmlType="submit"  onClick={reset.bind(this)} >重置</Button>
              </FormItem>

            </Form>
            <Row style={{marginTop:10}}>
              <Col>
                <Button  type="primary" icon="export" onClick={this.showModalAdd} >导出</Button>
                <Button type="primary" style={{marginLeft:'10px'}} onClick={() => showConfirm()} >批量删除</Button>
              </Col>
            </Row>
            <Row>

              <Col span={24}>
                <Table
                  style={{paddingLeft:'0px', paddingTop: '10px'}}
                  rowKey={record => record.logId}
                  bordered
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={this.state.tableList}
                  pagination={paginationProps}
                  onChange={handleTableChange}
                  loading={this.props.loading.effects['logSelect/query']}
                  >
                </Table>
              </Col>
            </Row>
      </div>
    )
  }
}

export default connect(({logSelect,loading,app }) => ({logSelect,loading,app }))(Form.create()(logSelect))
