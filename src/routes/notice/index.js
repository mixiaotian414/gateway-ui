import React,{Component} from 'react'
import styles from './index.less'
import {connect} from 'dva'
import { DropOption } from 'components'
import { Row, Col,Form,Input,Button,DatePicker,Table,Modal,Switch,message} from 'antd'

/**
 * @Title:日志查询
 * @Description:
 * @Author: dhn
 * @Time: 2018/5/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const confirm = Modal.confirm
class notice extends Component{
  state={
    tableList: [],
    tableListUser: [],
    pagination:{
      total: 0,
      pageSize: 10,
      current: 1,
    },
    paginationUser:{
      total: 0,
      pageSize: 10,
      current: 1,
    },
    formValues:{},
    Taketimevalue: '',
    switchVal:"1",
    visible:false,
    selectedRowKeys: [],
    notifyId:''
  }

  takeTime(date, datestr) {

    this.setState({
      Taketimevalue: datestr
    })
  }
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'notice/query',
      payload: {
        page: 1,
        pageSize: 10
      },
    });
  }

  componentWillReceiveProps = (nextprops) => {
    const pagination = nextprops.notice.pagination;
    const list = nextprops.notice.list;
    this.setState({
      tableList: list,
      pagination,
    })
    const paginationUser = nextprops.notice.paginationUser;
    const listUser = nextprops.notice.listUser;
    this.setState({
      tableListUser: listUser,
      paginationUser,
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
        type: 'notice/query',
        payload: params,
      });
    }
    const handleModalVisible = (flag) => {
      this.setState({
        visible: !!flag,
      });
    }
    const addNotice = (notifyId,appId,userId) =>{
      handleModalVisible(true)
      this.setState({
        notifyId
      })
      this.props.dispatch({
        type: 'notice/queryid',
      })
    }
    const addNoticeAll = (notifyId,appId,userId) =>{
      this.props.dispatch({
        type: 'notice/addAll',
        payload: {
          appId: appId,
          notifyId: notifyId,
          flag: 'all',
        },
      });
    }
    const okHandleNotice = () => {

      if(selectedRowKeys.length===0){
        message.warning('请至少选择一条记录！')
      }else{

        this.props.dispatch({
          type: 'notice/add',
          payload: {
            appId: this.props.app.user.appId,
            notifyId: this.state.notifyId,
            userIds: selectedRowKeys,
          },
        });
        this.setState({
          visible:false,
          selectedRowKeys:[]
        })
      }

    }
    const handleFormReset = () => {
      const { form } = this.props;
      form.resetFields();
    }
    const {selectedRowKeys} = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (record,e) => {
        this.setState({
          selectedRowKeys: record,
        })
      },
    }
    const onSwitchChange = (flag,notifyId,appId) =>{
      const updateFlag = flag==='1'?'0':'1'
      const { dispatch } = this.props
      confirm({
        title: flag==='1'?'确定撤销吗？':'确定重新发布吗？',
        okText:'确定',
        cancelText:'取消',
        onOk () {
          dispatch({
            type: 'notice/delete',
            payload: {
              appId,
              notifyId,
              flag:updateFlag
            },
          })
        },
      })

    }
    const yonghu = [
      {
        title: '员工号',
        dataIndex: 'userCode',
        key: 'userCode',
      },
      {
        title: '用户名称',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',

      }, {
        title: '状态',
        dataIndex: 'userStatusText',
        key: 'userStatusText',
      },
      {
        title: '所属机构',
        dataIndex: 'orgName',
        key: 'orgName',
      },
    ]

    const columns = [{
      title: '公告名称',
      dataIndex:"notifyTitle",
      key:"notifyTitle",
    },{
      title: '通知发布时间',
      dataIndex:"lastUpdateTime1",
      key:"lastUpdateTime1",
    },{
      title: '撤销',
      dataIndex:"flag",
      key:"flag",
      render: (text, record) => (
        <Switch checkedChildren="启用" unCheckedChildren="撤销" checked={record.flag==='1'?true:false} onChange={e => onSwitchChange(record.flag,record.notifyId,this.props.app.user.appId)}/>
      )
    },{
      title: '操作',
      dataIndex: 'notifyId',
      key:"notifyId",
      render: (text, record) => (
        <DropOption
          onMenuClick={e => handleMenuClick(record, e)}
          menuOptions={[{ key: '1', name: '发布' }, { key: '2', name: '发布全部' }]}>
        </DropOption>
      )}];
    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
      addNotice(record.notifyId,this.props.app.user.appId,this.props.app.user.userId)
    }  else {
      addNoticeAll(record.notifyId,this.props.app.user.appId,this.props.app.user.userId)
    }
  }
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
          type: 'notice/query',
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
    const paginationPropsUser = {
      ...this.state.paginationUser,
    };
    const handleUserSearch = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const userName = this.props.form.getFieldValue("userNameSelect");
      dispatch({
        type: 'notice/queryid',
        payload: {
          userName: userName || '',
        }
      })
    }

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
                {getFieldDecorator('lastUpdateTime',{
                  /*  initialValue: '9'*/
                })(
                  <DatePicker placeholder="请选择日期"  style={{ width: '210px' }} />
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
                  loading={this.props.loading.effects['notice/query']}
                  >
                </Table>
                {this.state.visible && <Modal
                  visible={this.state.visible}
                  wrapClassName="vertical-center-modal"
                  title="发布用户列表"
                  onCancel={() => handleModalVisible()}
                  onOk={okHandleNotice}
                  width={700}
                  okText="确定" cancelText="取消"
                >
                  <Form layout="inline" onSubmit={handleUserSearch}>
                    <FormItem    label="用户名称" >
                      {getFieldDecorator('userNameSelect', {
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                    <FormItem >
                      <Button type="primary" loading={this.props.loading.effects['notice/queryid']}  htmlType="submit" >查询</Button>
                    </FormItem>
                    <FormItem>
                      <Button onClick={handleFormReset} htmlType="submit" >重置</Button>
                    </FormItem>

                    <Table
                      bordered={false}
                      style={{ paddingLeft: '0px', paddingTop: '10px' }}
                      rowSelection={rowSelection}
                      rowKey={record => record.userId}
                      scroll={{ y: 300 }}
                      size="small"
                      rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                      columns={yonghu}
                      dataSource={this.state.tableListUser}
                      pagination={paginationPropsUser}
                      loading={this.props.loading.effects['notice/queryid']}
                    >
                    </Table>
                  </Form>

                </Modal>}
              </Col>
            </Row>
      </div>
    )
  }
}

export default connect(({notice,loading,app }) => ({notice,loading,app }))(Form.create()(notice))
