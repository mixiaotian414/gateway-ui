import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { GifButton,MenuButton } from 'components'
import { Button,Select,Tabs,Table, Card,Form ,Input,Modal, Switch, Radio, Badge, Icon,Row,Col, Divider, message, DatePicker,Pagination } from 'antd'
import styles from './index.less'
import moment from 'moment';

/**
 * @title:系统参数管理
 * @author:chenshuai
 * @time:2018/4/23
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const Option = Select.Option
const RadioGroup = Radio.Group;
const { TabPane } = Tabs
const Search = Input.Search
const { RangePicker } = DatePicker
const confirm = Modal.confirm

const statusMap = ['default', 'success'];
const status = ["否","是"];



class sysParam extends React.Component{

  state = {
    modalVisible: false,
    modalVisibleUpdate: false,
    formValues: {},
    addInputValue: '',
    sortedInfo: null,
    filteredInfo: null,
    btnStatus: [],
    modaltitle: "",
    start_date: '',
    end_date: '',
  }

  componentDidMount = ()=>{
    this.props.dispatch({
      type: 'sysParam/query'
    })
  }

  getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');



  render(){
    const FormItem = Form.Item
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFieldsValue } = this.props.form
    const { addInputValue } = this.state
    //获取功能集合
    const funclist = this.props.app.funcList

    let { sortedInfo, filteredInfo } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: '参数编号',
        dataIndex: 'paraCode',
        key: 'paraCode',
      }, {
        title: '参数名称',
        dataIndex: 'paraName',
        key: 'paraName',

      }, {
        title: '参数值',
        dataIndex: 'paraValue',
        key: 'paraValue',
      },{
        title: '是否只读',
        dataIndex: 'isReadonly',
        key: 'isReadonly',
        filteredValue: filteredInfo.isReadonly,
        onFilter: (value, record) => record.isReadonly.indexOf(value) === 0,
        sorter: (a, b) => a.isReadonly - b.isReadonly,
        sortOrder: sortedInfo.columnKey === 'isReadonly' && sortedInfo.order,
        filters: [
          {
            text: status[0],
            value: 0,
          },
          {
            text: status[1],
            value: 1,
          }
        ],
        render(val) {
          return <Badge status={statusMap[val]} text={status[val]} />;
        },
      },
      {
        title: '修改人员',
        dataIndex: 'username',
        key: 'username',
      },{
        title: '修改时间',
        dataIndex: 'lastUpdateTime',
        key: 'lastUpdateTime',
      },{
        title: '操作',
        render: (text, record) =>{
            return (
              <span>
              <a onClick={e=>updateState(e,record.appId, record.paraId)}><MenuButton FuncListBtn={funclist} btnCode="100903" btnText="编辑" /></a>
           </span>
            )
        }
      }
    ]
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 12 },
    };


    const { sysParam: {pagination, list, formValues, currentItem, item, selectedRowKeys, ids } } = this.props

    const handleTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props;
      const paraName = this.props.form.getFieldValue("paraName1");
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = this.getValue(filtersArg[key]);
        return newObj;
      }, {});

      this.setState({
        filteredInfo: filtersArg,
        sortedInfo: sorter,
      });

      const params = {
        paraName: paraName || '',
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...formValues,
        ...filters,
      };
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }

      dispatch({
        type: 'sysParam/querySuccess',
        payload:{
          formValues: {...formValues,...filters},
        }
      });

      dispatch({
        type: 'sysParam/query',
        payload: params,
      });
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };

    const handleSearch = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const paraName = this.props.form.getFieldValue("paraName1");
      const values = {
        ...formValues,
        paraName: paraName || '',
        page: 1,
        pageSize: 10,
      }
        dispatch({
          type: 'sysParam/querySuccess',
          payload: {
            formValues: values,
          },
        })
        dispatch({
          type: 'sysParam/query',
          payload: values,
        })
    }

    //生效时间
    const startTime = (date, datestr) => {
      this.setState({
        start_date: datestr
      })
    }
    //失效时间
    const endTime = (date, datestr) => {
      this.setState({
        end_date: datestr
      })
    }

    const handleFormReset = () => {
      this.props.form.resetFields();
    }

    const addState = () => {
      this.props.form.resetFields()
      handleModalVisible(true)
      this.setState({
        btnStatus: 2,
        modaltitle:"系统参数新增",

      })
    }

    const updateState = (e, appId, paraId) => {
      this.props.form.resetFields()
      this.props.dispatch({
        type: 'sysParam/queryid',
        payload: {
          appId: appId,
          paraId: paraId,
        },
      });

      this.setState({
        btnStatus: 1,
        modaltitle:"系统参数修改",

      })

      handleModalVisible(true)
    }

    const handleModalVisible = (flag) => {
      this.setState({
        modalVisible: !!flag,
      });
    }

    const okHandle = () => {
      if (this.state.btnStatus === 1) {
        okHandleUpdate()
      }
      if (this.state.btnStatus === 2) {
        okHandleAdd()
      }
    }
    //菜单新增保存
    const okHandleAdd = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'sysParam/add',
          payload: {
            appId: fieldsValue.appIdadd,
            paraCode: fieldsValue.paraCodeadd,
            paraName: fieldsValue.paraNameadd,
            paraValue: fieldsValue.paraValueadd,
            isReadonly: fieldsValue.isReadonlyadd,
          },
        })
        form.resetFields()
        this.setState({
          modalVisible: false,
        })
      })
    }
    //菜单修改保存
    const okHandleUpdate = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'sysParam/update',
          payload: {
            appId: fieldsValue.appIdadd,
            paraId: fieldsValue.paraIdadd,
            paraCode: fieldsValue.paraCodeadd,
            paraName: fieldsValue.paraNameadd,
            paraValue: fieldsValue.paraValueadd,
            isReadonly: fieldsValue.isReadonlyadd,
          },
        })

        this.setState({
          modalVisible: false,
        })
      })
    }
    //批量删除
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
              type: 'sysParam/delete',
              payload: {
                appId: aid,
                paraIdList: ids,
              },
            })
          },
        })

          }else {
        message.warning('请选择一条记录！');
        }

    }

    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record,e) => {
       this.props.dispatch({
          type: 'sysParam/updateState',
          payload: {
            selectedRowKeys: record,
            ids:e,
          },
        })
      },
    }
    const dateFormat = 'YYYY-MM-DD';

//鼠标失去焦点判断参数编号是否唯一
    const onBlurChange = () => {
      const paraCode =this.props.form.getFieldValue("paraCodeadd")
      this.props.dispatch({
        type: 'app/validateVal',
        payload: {
          tab: 'ap_parameter',
          col: 'PARA_CODE',
          val: paraCode,
        },
      }).then(()=>{
        if(this.props.app.flag){
          message.error("该参数编号:"+"【"+paraCode+"】"+"已存在,请重新输入")
          this.props.form.resetFields("paraCodeadd")
        }
      })

    }

    return (
      <div className={styles.divbackground}>
        <Row>
          <Form layout="inline" ref="form" onSubmit={handleSearch}>
            <FormItem  label="参数名称"  >
              {getFieldDecorator('paraName1', {
              })(
                <Input placeholder="请输入" />
              )}
            </FormItem>
            <FormItem>
              <Button type="primary"  loading={this.props.loading.effects['sysParam/query']} htmlType="submit"  >查询</Button>
            </FormItem>
            <FormItem>
              <Button onClick={handleFormReset} htmlType="submit" >重置</Button>
            </FormItem>
          </Form>
        </Row>
        <Row style={{marginTop: '10px'}}>
          <Col span={6}>
            <GifButton FuncListBtn={funclist}  onBtnClick={() => addState()} btnCode="100901" btnType="primary" btnIcon="plus" btnText="新建" />
            <GifButton FuncListBtn={funclist}  onBtnClick={() => showConfirm()} btnCode="100902" style={{marginLeft:'10px'}} btnType="primary" btnText="批量删除" />
          </Col>

        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowSelection={rowSelection}
              style={{ paddingLeft: '0px', paddingTop: '10px' }}
              bordered
              rowKey={record => record.paraId}
              columns={columns}
              dataSource={list}
              pagination={paginationProps}
              onChange={handleTableChange}
              loading={this.props.loading.effects['sysParam/query']}
            >
            </Table>
          </Col>
        </Row>
        <Modal
          title={this.state.modaltitle}
          wrapClassName="vertical-center-modal"
          visible={this.state.modalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
          okText="确定" cancelText="取消"
          width={650}
        ><Form layout="horizontal">
          <Row>
                {getFieldDecorator('appIdadd', {
                  initialValue: this.props.app.user.appId,
                })(
                  <Input type="hidden" />
                )}
            <Col span={12}>
              {
                this.state.modaltitle == "系统参数新增" ?
                  <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label="参数编号" hasFeedback >
                    {getFieldDecorator('paraCodeadd', {
                      initialValue: this.state.modaltitle == "系统参数新增" ? null: item.paraCode,
                      rules: [
                        {
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[A-Za-z0-9]{1,32}$/.test(value))) {
                              callback('【请输入"英文"或"数字"长度不能超过"32"位】')
                            }
                            else {
                              callback();
                            }
                          }
                        },
                        {
                          required: true,
                          message: '【"参数编号"不能为空】',
                        },
                      ],

                    })(
                      <Input onBlur={onBlurChange} placeholder="请输入" />
                    )}
                  </FormItem>
                  :<FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label="参数编号" >
                    {getFieldDecorator('paraCodeadd', {
                      initialValue: this.state.modaltitle == "系统参数新增" ? null: item.paraCode,
                      rules: [
                        {
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[A-Za-z0-9]{1,32}$/.test(value))) {
                              callback('【请输入"英文"或"数字"长度不能超过"32"位】')
                            }
                            else {
                              callback();
                            }
                          }
                        },
                        {
                          required: true,
                          message: '【"参数编号"不能为空】',
                        },
                      ],

                    })(
                      <Input onBlur={onBlurChange} placeholder="请输入"  disabled />
                    )}
                  </FormItem>
              }

            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label="参数名称" hasFeedback >
                {getFieldDecorator('paraNameadd', {
                  rules: [
                    {
                      required: true,
                      validator: (rule, value, callback) => {
                        if (!(/[\u4E00-\u9FA5]/.test(value))) {
                          callback('【请输入"中文汉字"】')
                        }
                        else {
                          callback();
                        }
                      }
                    }
                  ],
                  initialValue: this.state.modaltitle == "系统参数新增" ? null: item.paraName,
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>

            <Col span={12}>
              <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label="参数值" hasFeedback >
                {getFieldDecorator('paraValueadd', {
                  rules: [
                    {
                      required: true,
                   /*   validator: (rule, value, callback) => {
                        if (!(/^[+-_]?[A-Za-z0-9]{1,32}$/.test(value))) {
                          callback('【请输入"英文"或"数字"】')
                        }
                        else {
                          callback();
                        }
                      }*/
                    },{
                      required: true,
                      message: '【"参数值"不能为空】',
                    },
                  ],
                  initialValue: this.state.modaltitle == "系统参数新增" ? null: item.paraValue,
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} label="是否可读" hasFeedback >
                {getFieldDecorator('isReadonlyadd', {
                  rules: [
                    {
                      required: true,
                      message: '【是否可读不能为空】',
                    },
                  ],
                  initialValue: this.state.modaltitle == "系统参数新增" ? "1": item.isReadonly,
                })(
                  <Select  labelCol={{ span: 7 }} wrapperCol={{ span: 12 }} placeholder="请选择" >
                    <Select.Option value="1">是</Select.Option>
                    <Select.Option value="0">否</Select.Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {getFieldDecorator('paraIdadd', {
                initialValue: item.paraId,
              })(
                <Input type="hidden" />
              )}
            </Col>
          </Row>
        </Form>
        </Modal>
      </div>
    )
  }
}
export default connect(({ sysParam, loading, app }) => ({ sysParam, loading, app }))(Form.create()(sysParam))
