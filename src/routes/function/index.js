import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { GifButton } from 'components'
import { Button, Select, Form,Table, message,Input, Row, Col, Tree, Switch, Modal, Menu,Tabs, Icon, Card, Divider, Radio  } from 'antd'
import { arrayToTree, queryArray } from 'utils'
import styles from './index.less'

/**
 * @title:功能管理菜单树
 * @author:chenshuai
 * @time:2018/4/16
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm
const Option = Select.Option
const { TabPane } = Tabs
const RadioGroup = Radio.Group;


class Function extends Component {
  state = {
    modalVisible: false,
    visible: false,
    tempStyle: {},
    checkedKeys: [],
    formValues: {},
    rightkey: {},
    btnStatus: [],
    modaltitle: "",
    funcParentId:[],
    selectedRowKeys: [],
    funcid: [],
    selectedKeys: [],
    dictStatus:"",
    functionuri:null,
    flag1:"",
    visibleApi: false,
    pagination:{
      total: 0,
      pageSize: 10,
      current: 1,
    },
    tableList: [],
  };

  //初始化默认显示根节点下第一个子节点基本信息
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'Function/query',
    }).then(()=>{
      this.setState({
        selectedKeys:[this.props.Function.list[0].children[0].funcId]
      })
      this.props.dispatch({
        type: 'Function/queryid',
        payload: {
          appId:this.props.app.user.appId,
          funcId:this.props.Function.list[0].children[0].funcId,

        },
      })
      //角色明细
      this.props.dispatch({
        type: 'Function/queryPersonnelrole',
        payload: {
          appId: this.props.app.user.appId,
          funcId: this.props.Function.list[0].children[0].funcId,
        },
      })
      //接口列表
      /*this.props.dispatch({
        type: 'Function/queryapi',
        payload: {
          appId: this.props.app.user.appId,
          page: 1,
          pageSize: 10,
        },
      })*/
      //接口取值
      this.props.dispatch({
        type: 'Function/functionapis',
        payload: {
          appId: this.props.app.user.appId,
          funcId: this.props.Function.list[0].children[0].funcId,
        },
      })
    })
  }


  //获取功能树类型
  getFunctionType() {
    if(this.props.Function.getFunctionTypeList[0]) {
      const array = this.props.Function.getFunctionTypeList
      const select_list = array.length && array.map(k => ({...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}`}));
      if (select_list.length > 0) {
        return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
      }
      return null;
    }
  }
  //功能点状态
  getFuncType() {
    if(this.props.Function.getFuncTypeList[0]) {
      const array = this.props.Function.getFuncTypeList
      const select_list = array.length && array.map(k => ({...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}`}));
      if (select_list.length > 0) {
        return select_list.map(k => <Radio key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Radio>)
      }
      return null;
    }
  }
  //是否启用拦截
  getInterceptorType() {
    if(this.props.Function.getInterceptor[0]) {
      const array = this.props.Function.getInterceptor
      const select_list = array.length && array.map(k => ({...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}`}));
      if (select_list.length > 0) {
        return select_list.map(k => <Radio key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Radio>)
      }
      return null;
    }
  }
  handleProvinceChange = (value) => {
    if(value ==='1'){
      this.setState({
        dictStatus: "1",
        functionuri: '#',
        flag1:2,
      });
    }else {
      this.setState({
        dictStatus: "0",
        functionuri: null,
        flag1:1,
      });
    }

  }

  componentWillReceiveProps = (nextprops) =>{
    this.setState({
      selectedRowKeys:this.props.Function.apiidslist
    })
    const queryapilist = this.props.Function.queryapilist
    const pagination = this.props.Function.pagination
    this.setState({
      tableList: queryapilist,
      pagination,
    })
  }


  render () {
    const FormItem = Form.Item
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFieldsValue } = this.props.form
    const { Function: { list, item, formValues,pagination, queryapilist, queryPersonnelrolelist, funcitem, ids } } = this.props
    //获取功能集合
    const funclist = this.props.app.funcList
    //鼠标右键功能键
    const funcAdd = funclist.map((item,key) =>(item.funcCode ==="100601"&& item.isRole === true?<Menu.Item key='100601'><a onClick={e => addState(e,this.state.rightkey.appId,this.state.rightkey.funcId)}><Icon type="plus-circle" />新增</a></Menu.Item>:null))
    const funcUpdate = funclist.map((item,key) =>(item.funcCode ==="100603"&& item.isRole === true?<Menu.Item key='100603'><a onClick={e => updateState(e,this.state.rightkey.appId,this.state.rightkey.funcId)}><Icon type="edit" />修改</a></Menu.Item>:null))
    const funcRemove = funclist.map((item,key) =>(item.funcCode ==="100602"&& item.isRole === true?<Menu.Item key='100602'><a onClick={e => remove(e, this.state.rightkey.appId,this.state.rightkey.funcId,this.state.rightkey.funcParentId)}><Icon type="minus-circle-o" />删除</a></Menu.Item>:null))

    const api = [
      {
        title: '接口编码',
        dataIndex: 'apiCode',
        key: 'apiCode',
        width:'15%',
      },
      {
        title: '接口名称',
        dataIndex: 'apiName',
        key: 'apiName',
        width:'45%',
        render: (text, record) =>{
          return(
            <span>
                <a onClick={() => apidetail(this.props.app.user.appId,record.apiId)}>{text}</a>
            </span>
          )
        }
      },{
        title: '接口地址',
        dataIndex: 'apiUri',
        key: 'apiUri',
        width:'40%',
      },
    ]
    const jiaose = [
      {
        title: '系统名称',
        dataIndex: 'appName',
        key: 'appName',
      },{
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      },{
        title: '角色类型',
        dataIndex: 'roleTypeText',
        key: 'roleTypeText',
      },
    ]


    //遍历树形
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.funcId} title={item.funcName} funcParentId ={item.funcParentId} appId={this.props.app.user.appId} isleaf={item.isLeaf} >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.funcId} title={item.funcName} funcParentId ={item.funcParentId}  appId={this.props.app.user.appId} isleaf={item.isLeaf} />;

    })
    const handleModalVisible = (flag) => {
      this.setState({
        modalVisible: !!flag,
        dictStatus:"0",
      })
    }

    const apidetail = (appId,apiId) =>{
      this.setState({
        visibleApi:true
      })
      this.props.dispatch({
        type: 'Function/apidetail',
        payload: {
          appId,
          apiId,
        },
      })

    }
    const handleModalVisibleTwo = (flag) => {
      this.setState({
        visibleApi: !!flag,
      })
    }

    const formItemLayout2 = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    }
    //鼠标右键菜单弹窗
    const onRightClick = (e) => {
      const left = e.event.pageX
      const top = e.event.pageY
      this.setState({
        visible: true,
        tempStyle: {
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          width: '110px',
          background: '#F0F0F0',
        },
        rightkey: {
          appId: this.props.app.user.appId,
          funcId: e.node.props.eventKey,
          funcParentId: e.node.props.funcParentId,
          isleaf: e.node.props.isleaf,
        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)
    }

    const remove = (e,appId, funcId,funcParentId) => {
      const { dispatch } = this.props
      dispatch({
        type: 'Function/delete',
        payload: {
          appId,
          funcId,
          funcParentId,
        },
      }).then(()=>{
        if(this.props.Function.countflag>0){
          confirm({
            title:'此功能已配置角色 是否继续删除?',
            okText: "是",
            cancelText: "否",
            onOk (){
              dispatch({
                type: 'Function/delete',
                payload: {
                  count: "1",
                  appId,
                  funcId,
                  funcParentId,
                },
              })
              message.success('删除成功')
            }
          })
        }else if(this.props.Function.countflag ===0){
          confirm({
            title:'是否删除此功能?',
            okText: "是",
            cancelText: "否",
            onOk (){
              dispatch({
                type: 'Function/delete',
                payload: {
                  count:"1",
                  appId,
                  funcId,
                  funcParentId,
                },
              })
              message.success('删除成功')
            }
          })
        }
      })
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
          type: 'Function/add',
          payload: {
            appId: fieldsValue.appIdadd,
            //funcId: fieldsValue.funcIdadd,
            funcCode: fieldsValue.funcCodeadd,
            funcName: fieldsValue.funcNameadd,
            funcDesc: fieldsValue.funcDescadd,
            funcParentId: fieldsValue.funcParentIdadd,
            funcUri:  fieldsValue.funcUriadd,
            funcType: fieldsValue.funcTypeadd,
            funcLevel: fieldsValue.funcLeveladd,
            funcOrder: fieldsValue.funcOrderadd,
            isLeaf: fieldsValue.isLeafadd,
            status: fieldsValue.statusadd,
            INTERCEPTOR:fieldsValue.INTERCEPTORAdd,
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
          type: 'Function/update',
          payload: {
            appId: fieldsValue.appIdadd,
            funcId: fieldsValue.funcIdadd,
            funcCode: fieldsValue.funcCodeadd,
            funcName: fieldsValue.funcNameadd,
            funcDesc: fieldsValue.funcDescadd,
            funcParentId: fieldsValue.funcParentIdadd,
            funcUri:  fieldsValue.funcUriadd,
            funcType: fieldsValue.funcTypeadd,
            funcLevel: fieldsValue.funcLeveladd,
            funcOrder: fieldsValue.funcOrderadd,
            isLeaf: fieldsValue.isLeafadd,
            status: fieldsValue.statusadd,
            INTERCEPTOR:fieldsValue.INTERCEPTORADD,
          },
        })
        this.setState({
          modalVisible: false,
        })
      })
    }
    //鼠标右键新增
    const addState = (e,appId,funcId) => {
      this.props.form.resetFields()
      this.props.dispatch({
        type: 'Function/queryid',
        payload: {
          appId: appId,
          funcId: funcId,
        },
      })
      handleModalVisible(true)
      this.setState({
        btnStatus: 2,
        modaltitle:"功能新增",
        functionuri:'#',
        dictStatus:"1",
      })
    }

    //鼠标右键修改回显
    const updateState = (e,appId,funcId) => {
      this.props.form.resetFields()
        this.props.dispatch({
          type: 'Function/queryid',
          payload: {
            appId: appId,
            funcId: funcId,
          },
        })
        this.setState({
          btnStatus: 1,
          modaltitle:"功能修改",
          flag1: 2,
        })
        handleModalVisible(true)
    }
    //鼠标左键点击节点查询
    const onSelect = (info,e) => {

        this.setState({
          funcid:info[0],
        })
        this.props.dispatch({
          type: 'Function/queryid',//应该用功能节点查询接口，目前用的编辑取值接口
          payload: {
            appId: this.props.app.user.appId,
            funcId: info[0],
            //funcParentId:funcParentId,
          },
        })
        //角色明细
        this.props.dispatch({
          type: 'Function/queryPersonnelrole',
          payload: {
            appId: this.props.app.user.appId,
            funcId: info[0],
          },
        })
        //接口取值
        this.props.dispatch({
          type: 'Function/functionapis',
          payload: {
            appId: this.props.app.user.appId,
            funcId: info[0],
          },
        })
      const apiName = this.props.form.getFieldValue("apiName1");
      const values = {
        appId:this.props.app.user.appId,
        apiName: apiName || '',
        funcId: info[0],
        page: 1,
        pageSize: 10,
      }
      this.props.dispatch({
        type: 'Function/queryapi',
        payload: values,
      })
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    }
    const handleTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props
      const apiName = this.props.form.getFieldValue("apiName1");
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj }
        newObj[key] = this.getValue(filtersArg[key])
        return newObj
      }, {})

      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        apiName: apiName || '',
        ...filters,
      }
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`
      }
      dispatch({
        type: 'Function/queryapi',
        payload: params,
      })
    }
    //勾选取值
    const {selectedRowKeys} = this.state
    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record,e) => {
        this.setState({
          selectedRowKeys: record,
        })
      },
      onSelectInvert: (record,e) => {
        this.props.dispatch({
          type: 'Function/updateState',
          payload: {
            selectedRowKeys: record,
            ids: e,
          },
        })
      }
    };
    //绑定接口
    const okHandleApi = () => {
      const { dispatch } = this.props
      const apiid = this.props.app.user.appId
      const funcid = this.state.funcid
        confirm({
          title: '确定绑定此接口吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: 'Function/functionapisave',
              payload: {
                appId: apiid,
                funcId: funcid,
                apiids: selectedRowKeys,
              },
            })
          },
        })
    }
    //接口查询
   const handleSearchApi = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const apiName = this.props.form.getFieldValue("apiName1");
      const values = {
        appId:this.props.app.user.appId,
        apiName: apiName || '',
        funcId: this.state.funcid,
        page: 1,
        pageSize: 10,
      }
      dispatch({
        type: 'Function/queryapi',
        payload: values,
      })
    }
    //重置
    const handleFormReset = () => {
      const { form } = this.props;
      form.resetFields();
    }
    //鼠标失去焦点判断功能代码是否唯一
    const onBlurChange = () => {
      const funcCode =this.props.form.getFieldValue("funcCodeadd")
      this.props.dispatch({
        type: 'app/validateVal',
        payload: {
          tab: 'ap_func_tree',
          col: 'FUNC_CODE',
          val: funcCode,
        },
      }).then(()=>{
        if(this.props.app.flag){
          message.error("该功能代码:"+"【"+funcCode+"】"+"已存在,请重新输入")
          this.props.form.resetFields("funcCodeadd")
        }
      })

    }
    return (
        <div className={styles.divbackground}>
          <Row>
            <Col span={8}>
              <Row style={{ marginTop: '10px' }} />
              <div style={{overflow: 'auto', width:'100%', height: '400px'}}>
                <Tree
                  showLine
                  defaultExpandedKeys={['1']}
                  onRightClick={onRightClick}
                  onSelect={onSelect}
                >
                  {loop(list)}
                </Tree>
              </div>
            </Col>
            <Col span={16}>
              <Tabs type="card">
                <TabPane tab="基本信息" key="1">
                  <Card>
                    <Row>
                      <Col span={4}>功能名称：</Col><Col span={6}>{item.funcName}</Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col span={4}>功能代码：</Col><Col span={6}>{item.funcCode}</Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col span={4}>功能URL：</Col><Col span={6}>{item.funcUri}</Col>
                    </Row>
                    <Divider />
                    <Row>
                      <Col span={4}>功能描述：</Col><Col span={6}>{item.funcDesc}</Col>
                    </Row>
                  </Card>

                </TabPane>
                <TabPane tab="角色信息" key="2">
                  <Table
                    style={{paddingLeft:'0px', paddingTop: '0px'}}
                    rowKey={record => record.roleId}
                    bordered={false}
                    size="small"
                    rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                    columns={jiaose}
                    pagination={false}
                    dataSource={queryPersonnelrolelist}
                    loading={this.props.loading.effects['Function/queryPersonnel']}
                  >
                  </Table>

                </TabPane>
                { item.funcTreeType ==='1'? null
                  :
                <TabPane tab="接口列表" key="3">
                    <Form layout="inline" onSubmit={handleSearchApi}>
                      <FormItem   label="接口名称" style={{marginLeft: '10px'}} >
                        {getFieldDecorator('apiName1', {
                        })(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                      <FormItem >
                        <Button type="primary" loading={this.props.loading.effects['Function/queryapi']}  htmlType="submit" >查询</Button>
                      </FormItem>
                      <FormItem>
                        <Button type="primary" onClick={handleFormReset}  htmlType="submit" >重置</Button>
                      </FormItem>
                      <FormItem>
                        <GifButton FuncListBtn={funclist} btnType="primary" onBtnClick={() =>okHandleApi()} btnCode="100604" btnText="绑定" />
                      </FormItem>
                    </Form>
                    <Table
                      style={{paddingLeft:'0px', paddingTop: '10px'}}
                      rowSelection={rowSelection}
                      rowKey={record => record.apiId}
                      bordered={false}
                      size="small"
                      columns={api}
                      rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                      pagination={paginationProps}
                      onChange={handleTableChange}
                      dataSource={this.state.tableList}
                      loading={this.props.loading.effects['Function/queryapi']}
                    >
                    </Table>
                  </TabPane>
                }

              </Tabs>
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
          >
            <Form layout="horizontal"  onSubmit={okHandle}>
              <Row>
                    {getFieldDecorator('appIdadd', {
                      initialValue: item.appId,
                    })(<Input type="hidden" />)}
                    {getFieldDecorator('funcIdadd', {
                      initialValue: item.funcId,
                    })(<Input type="hidden" />)}
                    {getFieldDecorator('funcLeveladd', {
                      initialValue: item.funcLevel,
                    })(<Input type="hidden" />)}
                <Col span={12}>
                  {
                    (this.state.modaltitle == "功能修改") ?
                    <FormItem {...formItemLayout2} label="功能类型" >
                      {getFieldDecorator('funcTypeadd', {
                        initialValue: this.state.modaltitle == "功能新增" ? undefined: item.funcTreeType,
                        rules: [
                          {
                            required: true,
                            message: '【功能"类型"不能为空】',
                          },
                        ],
                      })(<Select placeholder="请选择" onChange={this.handleProvinceChange} disabled >
                        {this.getFunctionType()}
                      </Select>)}
                    </FormItem>
                      :
                      <FormItem {...formItemLayout2} label="功能类型" hasFeedback >
                        {getFieldDecorator('funcTypeadd', {
                          initialValue: this.state.modaltitle == "功能新增" ? this.props.Function.getFunctionTypeList[0].dictValue: item.funcTreeType,
                          rules: [
                            {
                              required: true,
                              message: '【功能"类型"不能为空】',
                            },
                          ],
                        })(<Select placeholder="请选择" onChange={this.handleProvinceChange} >
                          {this.getFunctionType()}
                        </Select>)}
                      </FormItem>
                  }
                </Col>
                <Col span={12}>
                  {this.state.modaltitle == "功能新增" ?
                    <FormItem {...formItemLayout2} label="功能代码" hasFeedback >
                      {getFieldDecorator('funcCodeadd', {
                        initialValue: this.state.modaltitle == "功能新增" ? null: item.funcCode,
                        rules: [
                          {
                            required: true,
                            validator: (rule, value, callback) => {
                              if (!(/^[A-Za-z0-9]{1,64}$/.test(value))) {
                                callback('【请输入"英文"或"数字"长度不能超过"64"位】')
                              }
                              else {
                                callback();
                              }
                            }
                          },{
                            required: true,
                            message: '【"功能代码"不能为空】',
                          },
                        ],
                      })(<Input onBlur={onBlurChange} placeholder="请输入" />)}
                    </FormItem>
                    :<FormItem {...formItemLayout2} label="功能代码" >
                      {getFieldDecorator('funcCodeadd', {
                        initialValue: this.state.modaltitle == "功能新增" ? null: item.funcCode,
                        rules: [
                          {
                            required: true,
                            validator: (rule, value, callback) => {
                              if (!(/^[A-Za-z0-9]{1,64}$/.test(value))) {
                                callback('【请输入"英文"或"数字"长度不能超过"64"位】')
                              }
                              else {
                                callback();
                              }
                            }
                          },{
                            required: true,
                            message: '【"功能代码"不能为空】',
                          },
                        ],
                      })(<Input onBlur={onBlurChange} placeholder="请输入" disabled />)}
                    </FormItem>
                  }
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout2} label="功能名称" hasFeedback >
                    {getFieldDecorator('funcNameadd', {
                      initialValue: this.state.modaltitle == "功能新增" ? null: item.funcName,
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
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout2} label="功能描述" hasFeedback >
                    {getFieldDecorator('funcDescadd', {
                      initialValue: this.state.modaltitle == "功能新增" ? null: item.funcDesc,
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout2} label="功能URI" hasFeedback >
                    {getFieldDecorator('funcUriadd', {
                      initialValue: this.state.modaltitle == "功能新增" ? (this.state.dictStatus==="1"?this.state.functionuri: null): (this.state.dictStatus==="1"?this.state.functionuri: item.funcUri),
                      rules: [
                        {
                          required: true,
                          validator: (rule, value, callback) => {
                            if ((/[\u4E00-\u9FA5]/.test(value))) {
                              callback('【请输入除"中文汉字"以外的其他字符】')
                            }
                            else {
                              callback();
                            }
                          }
                        },
                        {
                          required: true,
                          message: '【"URI"不能为空】',
                        },
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout2} label="功能排序" hasFeedback >
                    {getFieldDecorator('funcOrderadd', {
                      initialValue: this.state.modaltitle == "功能新增" ? null: item.funcOrder,
                      rules: [
                        {
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[1-9]\d{0,10}$/.test(value))) {
                              callback('【请输入"数字1-9"长度不能超过11位】')
                            } else {
                              callback();
                            }
                          }
                        }
                      ],
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col span={12}>
                  {getFieldDecorator('funcParentIdadd', {
                    initialValue: this.state.modaltitle == "功能新增" ? item.funcId: item.funcParentId,
                  })(<Input type="hidden" />)}
                </Col>
              </Row>
              <Row>

                <Col span={12}>
                  {(this.state.dictStatus==="1" || ((this.state.flag1===2&&item.funcTreeType ==='1')&&this.state.modaltitle == "功能修改") ) ? null
                  :<FormItem {...formItemLayout2} label="状态" >
                      {getFieldDecorator('statusadd', {
                        initialValue: this.state.modaltitle == "功能新增" ? null: item.status,
                        rules:[
                          {
                            required: true,
                            message: '【请选择"状态"】',
                          },
                        ]
                      })( <RadioGroup>
                        {this.getFuncType()}
                      </RadioGroup>)}
                    </FormItem>
                  }
                </Col>
                <Col span={12}>
                  {(this.state.dictStatus==="1" || ((this.state.flag1===2&&item.funcTreeType ==='1')&&this.state.modaltitle == "功能修改") ) ? null
                    :<FormItem {...formItemLayout2} label="是否启用拦截" >
                      {getFieldDecorator('INTERCEPTORADD', {
                        initialValue: this.state.modaltitle == "功能新增" ? null: item.status,
                        rules:[
                          {
                            required: true,
                            message: '【请选择"是否启用拦截"】',
                          },
                        ]
                      })( <RadioGroup>
                        {this.getInterceptorType()}
                      </RadioGroup>)}
                    </FormItem>
                  }
                </Col>
              </Row>
            </Form>
          </Modal>
          <Modal
            title="接口详情"
            wrapClassName="vertical-center-modal"
            visible={this.state.visibleApi}
            onCancel={() => handleModalVisibleTwo()}
            footer={[
              <Button key="back" type="primary" onClick={e=>handleModalVisibleTwo()}>关闭</Button>,
            ]}
          ><Form layout="inline">
            <Row>
              <Col span={24}>
                <FormItem label="接口编码">
                  <span>{this.props.Function.apiDetailList.apiCode}</span>

                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="接口名称">
                  <span>{this.props.Function.apiDetailList.appName}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="接口地址">
                  <span>{this.props.Function.apiDetailList.apiUri}</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem label="接口描述">
                  <span>{this.props.Function.apiDetailList.apiDesc}</span>
                </FormItem>
              </Col>
            </Row>
          </Form>
          </Modal>
          <Menu
            visible={this.state.visible}
            style={this.state.tempStyle}
          >
            {funcAdd}
            {this.state.rightkey.funcParentId ==='-1' ? null
            :funcUpdate
            }
            {
              this.state.rightkey.isleaf ===true ?
                funcRemove
                : null
            }

          </Menu>
        </div>
    )
  }
}

export default connect(({ Function, loading,app }) => ({ Function, loading,app }))(Form.create()(Function))
