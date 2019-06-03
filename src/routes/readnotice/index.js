import React,{Component} from 'react'
import styles from './index.less'
import {connect} from 'dva'
import { Row, Col,Form,Input,Button,DatePicker,Table,Modal} from 'antd'

/**
 * @Title:日志查询
 * @Description:
 * @Author: dhn
 * @Time: 2018/5/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const confirm = Modal.confirm
class readnotice extends Component{
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
console.info(this)

  }
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'readnotice/query',
      payload: {
        page: 1,
        pageSize: 10
      },
    });
  }

  componentWillReceiveProps = (nextprops) => {
    const pagination = nextprops.readnotice.pagination;
    const list = nextprops.readnotice.list;
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
        type: 'readnotice/query',
        payload: params,
      });
    }
    const deleteRole = (notifyId,appId,userId) =>{
      const { dispatch } = this.props
      confirm({
        title: '确定删除吗',
        okText:'确定',
        cancelText:'取消',
        onOk () {
          dispatch({
            type: 'readnotice/delete',
            payload: {
              appId,
              notifyId,
              userId
            },
          })
        },
      })
    }
    const columns = [{
      title: '公告名称',
      dataIndex:"notifyTitle",
      key:"notifyTitle",
    },{
      title: '通知发布时间',
      dataIndex:"lastUpdateTime2",
      key:"lastUpdateTime2",
    },{
      title: '通知阅读时间',
      dataIndex:"lastUpdateTime1",
      key:"lastUpdateTime1",
    },{
      title: '操作',
      dataIndex: 'notifyId',
      key:"notifyId",
      render: (text, record) => (
        <span>
          <a onClick={e => deleteRole(record.notifyId,this.props.app.user.appId,this.props.app.user.userId)}>删除</a>
        </span>
      )}];
    //处理提交数据
    const handleFields = (fields) => {
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const formvalues = this.state.formValues
      //要注意解构赋值的顺序
      let changefields={
        ...formvalues
      };
      //方便以后前后台联调

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
          type: 'readnotice/query',
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
    const dateFormat = 'YYYY-MM-DD'

    return(
      <div  className={styles.tradeAntiFraud}>
            <Form layout="inline" onSubmit={handleSubmit.bind(this)}>
              <FormItem label="公告名称:">
                {getFieldDecorator('notifyTitle',{
                })(
                  <Input placeholder="请输入" style={{width:150}} />
                )}
              </FormItem>
              <FormItem label="发布时间:">
                {getFieldDecorator('time',{
                  /*  initialValue: '9'*/
                })(
                  <DatePicker format={dateFormat} placeholder="请选择日期" onChange={this.takeTime} style={{ width: '210px' }} />
                )}
              </FormItem>
              <FormItem>
                <Button   type="primary" icon="search"  htmlType="submit"  style={{marginRight:'15px'}}>查询</Button>
                <Button   type="default" icon="search"  htmlType="submit"  onClick={reset.bind(this)} >重置</Button>
              </FormItem>

            </Form>
            <Row>

              <Col span={24}>
                <Table
                  style={{paddingLeft:'0px', paddingTop: '10px'}}
                  bordered
                  columns={columns}
                  dataSource={this.state.tableList}
                  pagination={paginationProps}
                  onChange={handleTableChange}
                  loading={this.props.loading.effects['readnotice/query']}
                  >
                </Table>
              </Col>
            </Row>
      </div>
    )
  }
}

export default connect(({readnotice,loading,app }) => ({readnotice,loading,app }))(Form.create()(readnotice))
