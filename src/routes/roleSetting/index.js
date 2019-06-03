import React,{Component} from 'react'
import styles from './index.less'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { GifButton,MenuButton } from 'components'
import { Loader } from '../../components'
import { Row, Col,Form,Tabs,Select,Input,Button,DatePicker,Table,Pagination ,Badge,message,Modal,Tree,Switch,Menu,Icon} from 'antd'

/**
 * @Title:组织机构——>角色管理
 * @Description:
 * @Author: dhn
 * @Time: 2018/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const statusMap = ['error', 'success'];
const status = ["停用","正常"];
const {TabPane} = Tabs
const TreeNode = Tree.TreeNode;
const confirm = Modal.confirm
const Option = Select.Option;
class roleSetting extends Component{
  state={
    treeData: [{ title: '系统菜单', key: '1' },]
    ,
    expandedKeys: ['1'],
    autoExpandParent: true,
    checkedKeys: [],
    selectedKeys: [],
    treeDataEx: [
      { title: '功能树', key: '1' },
    ],
    expandedKeysEx: ['1'],
    autoExpandParentEx: true,
    checkedKeysEx: [],
    selectedKeysEx: [],
    tableList: [],
    pagination:{
      total: 0,
      pageSize: 10,
      current: 1,
    },
    status:false,
    formValues:{},
    visibleAdd: false,
    visibleEdit: false,
    queryParamData:[],
    queryChannelData:[],
    queryTradeTypeData:[],
    switchVal:"1",
    switchBool:true
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys:checkedKeys.checked });
  }
  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.props.dispatch({
      type: 'roleSetting/queryMenuItem',
      payload: {
        menuId:info.node.props.dataRef.menuId,
        appId:this.props.app.user.appId
      },
    })
    this.setState({ selectedKeys });
  }

  onExpandEx = (expandedKeysEx) => {
    console.log('onExpand', arguments);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeysEx,
      autoExpandParent: false,
    });
  }
  onCheckEx = (checkedKeysEx) => {
    console.log('onCheck', checkedKeysEx);
    this.setState({ checkedKeysEx:checkedKeysEx.checked });
  }
  onSelectEx = (selectedKeysEx, info) => {
    console.log('onSelect', info);
    this.props.dispatch({
      type: 'roleSetting/queryFuncItem',
      payload: {
        funcId:info.node.props.dataRef.funcId,
        appId:this.props.app.user.appId
      },
    })
    this.setState({ selectedKeysEx });
  }

  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.menuNameShort} key={item.menuId} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.menuNameShort} key={item.menuId} dataRef={item} />;
    });
  }
  renderTreeNodesEx = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.funcName} key={item.funcId} dataRef={item}>
            {this.renderTreeNodesEx(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.funcName} key={item.funcId} dataRef={item} />;
    });
  }
  onRightClick = (e) =>{
  }

  showModalAdd = () => {
    this.setState({
      visibleAdd: true,
    });
  }
  handleOkAdd = () => {
    const { form, dispatch } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return
      dispatch({
        type: 'roleSetting/add',
        payload: {
          appId: fieldsValue.appIdAdd,
          roleName: fieldsValue.roleNameAdd,
          roleCode: fieldsValue.roleCodeAdd,
          roleType: fieldsValue.roleTypeAdd,
          roleDesc: fieldsValue.roleDescAdd,
          status: fieldsValue.statusAdd,
        },
      })
      form.resetFields()
      this.setState({
        visibleAdd: false,
      })
    })
  }
  handleCancelAdd = (e) => {
    this.setState({
      visibleAdd: false,
    });
  }
  handleModalVisible = (flag) => {
    this.setState({
      visibleEdit: !!flag,
    })
  }
  showModalEdit = (roleId,appId) => {
    this.props.form.resetFields()
    this.props.dispatch({
      type: 'roleSetting/queryid',
      payload: {
        roleId:roleId,
        appId:appId
      },
    }).then(() => {
      this.props.dispatch({
        type: 'roleSetting/menuTree',
        payload: {
          roleId:roleId,
          appId:appId
        },
      }).then(() => {
        this.setState({
          treeData:this.props.roleSetting.menulist,
          checkedKeys:this.props.roleSetting.menuchecked
        })
        this.props.dispatch({
          type: 'roleSetting/funcTree',
          payload: {
            roleId:roleId,
            appId:appId
          },
        }).then(() => {
          this.setState({
            treeDataEx:this.props.roleSetting.funclist,
            checkedKeysEx:this.props.roleSetting.funcchecked
          })
          this.handleModalVisible(true)
        })
      })

    })

  }
  handleOkEditMenu = () => {
    const { form, dispatch } = this.props
    if(this.state.checkedKeys.length>0) {
      dispatch({
        type: 'roleSetting/rmsave',
        payload: {
          appId: this.props.app.user.appId,
          roleId: this.props.roleSetting.item.roleId,
          menuids: this.state.checkedKeys
        },
      }).then(this.showModalEdit(this.props.roleSetting.item.roleId, this.props.app.user.appId))

    }else {
      message.error('未勾选菜单权限')
    }
  }
  handleOkEditFunc = () => {
    const { form, dispatch } = this.props

    dispatch({
      type: 'roleSetting/frsave',
      payload: {
        appId: this.props.app.user.appId,
        roleId:this.props.roleSetting.item.roleId,
        funcids:this.state.checkedKeysEx
      },
    }).then(
      dispatch({
        type: 'app/userFuncList'
      }).then(this.showModalEdit(this.props.roleSetting.item.roleId,this.props.app.user.appId))
    )


  }
  handleOkEdit = () => {
    const { form, dispatch } = this.props
    form.validateFields((err, fieldsValue) => {
      if (err) return
      dispatch({
        type: 'roleSetting/update',
        payload: {
          appId: fieldsValue.appIdEdit,
          roleName: fieldsValue.roleNameEdit,
          roleType: fieldsValue.roleTypeEdit,
          roleDesc: fieldsValue.roleDescEdit,
          status: fieldsValue.statusEdit,
          roleId:this.props.roleSetting.item.roleId,
          roleCode:this.props.roleSetting.item.roleCode
        },
      }).then(this.showModalEdit(this.props.roleSetting.item.roleId,this.props.app.user.appId))
      form.resetFields()
    })

  }
  handleCancelEdit = (e) => {
    this.setState({
      visibleEdit: false,
    });
  }

  getType() {
    const array = this.props.roleSetting.getTypeList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }
  getStatus() {
    const array = this.props.roleSetting.getStatusList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }

  componentDidMount=()=>{

    this.props.dispatch({
      type: 'roleSetting/query',
      payload: {
        appId:this.props.app.user.appId,
        page: 1,
        pageSize: 10
      },
    });
  }

  componentWillReceiveProps = (nextprops) => {


    const pagination = nextprops.roleSetting.pagination;
    const list = nextprops.roleSetting.list;
    this.setState({
      tableList: list,
      pagination,
    })
    if(nextprops.roleSetting.item.status==="1"){
      this.setState({
        switchBool:true,
        switchVal:"1"
      })
    }else if(nextprops.roleSetting.item.status==="0"){
      this.setState({
        switchBool:false,
        switchVal:"0"
      })
    }
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  render(){

    const { getFieldDecorator,resetFields} = this.props.form;
    const FormItem = Form.Item
    const {roleSetting:{item}} = this.props
    //获取功能集合
    const funclist = this.props.app.funcList

    const handleTableChange = (pagination) => {

      const params = {
        ...this.state.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };

      this.setState({
          formValues: {...this.state.formValues},
        }
      )

      this.props.dispatch({
        type: 'roleSetting/query',
        payload: params,
      });
    }
    const deleteRole = (roleId,appId) =>{
      const { dispatch } = this.props
      dispatch({
        type: 'roleSetting/delete',
        payload: {
          appId,
          roleId,
        },
      }).then(()=>{
        if(this.props.roleSetting.countFlag>0){
          confirm({
            title: '此角色已关联用户，是否继续删除？',
            okText:'确定',
            cancelText:'取消',
            onOk () {
              dispatch({
                type: 'roleSetting/delete',
                payload: {
                  count:'1',
                  appId,
                  roleId,
                },
              })
            },
          })
        }else {
          confirm({
            title: '确定删除吗',
            okText:'确定',
            cancelText:'取消',
            onOk () {
              dispatch({
                type: 'roleSetting/delete',
                payload: {
                  count:'1',
                  appId,
                  roleId,
                },
              })
            },
          })
        }
      })

    }
    const columns = [{
      title: '角色编号',
      dataIndex:"roleId",
      key:"roleId",
    },{
      title: '应用系统',
      dataIndex:"appName",
      key:"appName",
    },{
      title: '描述',
      dataIndex:"roleDesc",
      key:"roleDesc",
    },{
      title: '角色名称',
      dataIndex:"roleName",
      key:"roleName",
    },{
      title: '处理状态',
      dataIndex:"status",
      key:"status",
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
    },{
      title: '最新更新时间',
      dataIndex:"lastUpdate",
      key:"lastUpdate",
    }, {
      title: '操作',
      dataIndex: 'appId',
      key: "appId",
      width: 150,
      render: (text, record) => {
        if(record.roleCode === 'sysuser') {
          return (
            <span>
              <a onClick={e => this.showModalEdit(record.roleId, this.props.app.user.appId)}><MenuButton FuncListBtn={funclist} btnCode="100103" btnText="编辑及赋权" /></a>
            </span>
          )
        }else {
          return (
            <span>
              <a onClick={e => deleteRole(record.roleId, this.props.app.user.appId)}><MenuButton FuncListBtn={funclist} btnCode="100102" btnText="删除" /></a>
              &nbsp;&nbsp;&nbsp;
              <a onClick={e => this.showModalEdit(record.roleId, this.props.app.user.appId)}><MenuButton FuncListBtn={funclist} btnCode="100103" btnText="编辑及赋权" /></a>
            </span>
          )
        }
      }
    }];
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
          type: 'roleSetting/query',
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
    const onSwitchChange = () =>{

      if(this.state.switchVal==="1"){
        this.setState({
          switchVal: "0",
        })
      }else if(this.state.switchVal==="0"){
        this.setState({
          switchVal: "1",
        })
      }
    }


    return(
      <div  className={styles.tradeAntiFraud}>
        <Form layout="inline" onSubmit={handleSubmit.bind(this)}>
          <FormItem label="角色名称:">
            {getFieldDecorator('roleName',{
            })(
              <Input placeholder="请输入"  />
            )}
          </FormItem>
          <FormItem label="状态:">
            {getFieldDecorator('status',{
              /*  initialValue: '9'*/
            })(
              <Select placeholder="请选择" style={{width:80}}>
                {this.getStatus()}
              </Select>
            )}
          </FormItem>
          <FormItem>
            <Button type="primary" htmlType="submit" loading={this.props.loading.effects['roleSetting/query']} style={{marginRight:'15px'}}>查询</Button>
            <Button type="default" htmlType="submit"  onClick={reset.bind(this)} >重置</Button>
          </FormItem>

        </Form>
        <Row type="flex" justify="start" style={{marginTop:'10px'}}>
          <Col span={2}  >
            <GifButton FuncListBtn={funclist}  onBtnClick={() => this.showModalAdd()} btnCode="100101" btnType="primary" btnIcon="plus" btnText="新建" />
            {/*<Button   type="primary" icon="plus" onClick={this.showModalAdd} >新建</Button>*/}
            {this.state.visibleAdd && <Modal
              title="新建角色"
              visible={this.state.visibleAdd}
              onOk={this.handleOkAdd}
              onCancel={this.handleCancelAdd}
              okText={"保存"}
              cancelText={"取消"}
              width={500}
            >
              <Form layout="inline" style={{textAlign:'right'}}>
                {getFieldDecorator('appIdAdd',{
                  initialValue: this.props.app.user.appId
                })(
                  <Input placeholder="请输入" type="hidden" style={{width:350}} />

                )}
                <FormItem label="角色类型:" hasFeedback>
                  {getFieldDecorator('roleTypeAdd',{
                    initialValue: this.props.roleSetting.getTypeList[0].dictValue,
                    rules: [
                      {
                        required: true,
                        message: '角色类型不能为空',
                      },
                    ],
                  })(
                    <Select placeholder="请选择" style={{ width:350}} >
                      {this.getType()}
                    </Select>
                  )}
                </FormItem>
                <FormItem label="角色代码:"  style={{ marginTop:'20px' }} hasFeedback>
                  {getFieldDecorator('roleCodeAdd',{
                    /*  initialValue: '9'*/
                    rules: [
                      {
                        validator: (rule, value, callback) => {
                          console.info(value)
                          this.props.dispatch({
                            type: 'app/validateVal',
                            payload: {
                              tab:'ap_role',
                              col:'ROLE_CODE',
                              val:value
                            },
                          }).then(()=>{
                            if(this.props.app.flag){
                              callback('角色代码已存在')
                            }
                          }).then(()=>{
                            if(!this.props.app.flag){
                              callback()
                            }
                          })
                        }
                      }
                      ,
                      {
                        pattern: /^[0-9a-zA-Z]{0,64}$/g,
                        message: '请输入正确代码，代码不能为汉字且小于64位！',
                      },
                      {
                        required: true,
                        message: '角色代码不能为空',
                      },
                    ],
                  })(
                    <Input placeholder="请输入" style={{width:350}} />
                  )}
                </FormItem>
                <FormItem label="角色名称:" style={{ marginTop:'20px' }} hasFeedback>
                  {getFieldDecorator('roleNameAdd',{
                    rules: [
                      {
                        required: true,
                        message: '角色名称不能为空',
                      },
                    ],
                  })(
                    <Input placeholder="请输入" style={{width:350}} />
                  )}
                </FormItem>
                <FormItem label="状态:" style={{ marginTop:'20px',marginRight:'310px' }}>
                  {getFieldDecorator('statusAdd',{
                    initialValue: this.state.switchVal
                  })(
                    <Input placeholder="请输入" type="hidden" style={{width:350}} />

                  )}
                  <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked onChange={onSwitchChange}/>
                </FormItem>
                <FormItem label="角色描述:" style={{ marginTop:'20px' }}>
                  {getFieldDecorator('roleDescAdd',{
                  })(
                    <Input placeholder="请输入" style={{width:350}} />
                  )}
                </FormItem>

              </Form>
            </Modal>}
          </Col>
        </Row>
        <Row>

          <Col span={24}>
            {this.state.visibleEdit && <Modal
              title="编辑角色"
              visible={this.state.visibleEdit}
              width={800}
              onCancel={this.handleCancelEdit}
              footer={[
                <Button key="back" type="primary" onClick={this.handleCancelEdit}>关闭</Button>,
              ]}
            >
              <Loader spinning={this.props.loading.effects['roleSetting/queryid']} />
              <Tabs type="card">
                <TabPane tab="基本信息" key="1">

                  <Form layout="inline" style={{textAlign:'left',paddingLeft:170}}>
                    {getFieldDecorator('appIdEdit',{
                      initialValue: this.props.app.user.appId
                    })(
                      <Input placeholder="请输入" type="hidden" style={{width:350}} />

                    )}
                    <Row>
                      <Col span={21}>
                        <FormItem label="角色类型:" hasFeedback>

                          {getFieldDecorator('roleTypeEdit',{
                            initialValue: item.roleType,
                            rules: [
                              {
                                required: true,
                                message: '角色类型不能为空',
                              },
                            ],
                          })(
                            <Select placeholder="请选择" style={{ width:350}} >
                              {this.getType()}
                            </Select>
                          )}
                        </FormItem>
                      </Col>
                      <Col span={3}>
                        <Button type="primary" onClick={this.handleOkEdit}>保存</Button>
                      </Col>
                    </Row>
                    <Row>
                      <FormItem label="角色名称:" style={{ marginTop:'20px' }} hasFeedback>
                        {getFieldDecorator('roleNameEdit',{
                          initialValue: item.roleName,
                          rules: [
                            {
                              required: true,
                              message: '角色名称不能为空',
                            },
                          ],
                        })(
                          <Input placeholder="请输入" style={{width:350}} />
                        )}
                      </FormItem>
                    </Row>
                    <Row>
                      <FormItem label="状态:" style={{ marginTop:'20px'}}>
                        {getFieldDecorator('statusEdit',{
                          initialValue: this.state.switchVal
                        })(
                          <Input placeholder="请输入" type="hidden" />

                        )}
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" defaultChecked={this.state.switchBool} onChange={onSwitchChange}/>
                      </FormItem>
                    </Row>
                    <Row>
                      <FormItem label="角色描述:" style={{ marginTop:'20px' }}>
                        {getFieldDecorator('roleDescEdit',{
                          initialValue: item.roleDesc
                        })(
                          <Input placeholder="请输入" style={{width:350}} />
                        )}
                      </FormItem>
                    </Row>
                  </Form>
                </TabPane>
                <TabPane tab="菜单信息" key="2">
                  <Row>
                    <Col span={8}>
                      <div style={{overflow:'auto', width:'100%', height: '350px'}}>
                        <Tree
                          checkable
                          onRightClick={this.onRightClick}
                          onExpand={this.onExpand}
                          expandedKeys={this.state.expandedKeys}
                          autoExpandParent={this.state.autoExpandParent}
                          onCheck={this.onCheck}
                          checkedKeys={this.state.checkedKeys}
                          onSelect={this.onSelect}
                          selectedKeys={this.state.selectedKeys}
                          checkStrictly
                        >
                          {this.renderTreeNodes(this.state.treeData)}
                        </Tree>
                      </div>
                    </Col>
                    <Col span={16}>
                      <table style={{fontSize:14,border:'1px solid  #f4f4f4'}}>
                        <thead style={{background: '#f7f7f7',fontWeight:'bold'}}>
                        <tr style={{height:50}}>
                          <td style={{width:300}}>菜单属性</td>
                          <td style={{width:300}}>描述</td>
                          <td style={{paddingTop:2}}>
                            <Button type="primary" onClick={this.handleOkEditMenu}>保存</Button>
                          </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>菜单名称</td>
                          <td style={{width:300}}>{this.props.roleSetting.menuItem.menuNameShort}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>菜单URL</td>
                          <td style={{width:300}}>{this.props.roleSetting.menuItem.routeUri?this.props.roleSetting.menuItem.routeUri:"#"}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>状态</td>
                          <td style={{width:300}}>{this.props.roleSetting.menuItem.status?(this.props.roleSetting.menuItem.status==='1'?"正常":"停用"):""}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>备注</td>
                          <td style={{width:300}}>{this.props.roleSetting.menuItem.menuNameCh}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </TabPane>
                <TabPane tab="功能操作信息" key="3">
                  <Row>
                    <Col span={8}>
                      <div style={{overflow: 'scroll', width:'100%', height: '350px'}}>
                        <Tree
                          onRightClick={this.onRightClick}
                          checkable
                          onExpand={this.onExpandEx}
                          expandedKeys={this.state.expandedKeysEx}
                          autoExpandParent={this.state.autoExpandParentEx}
                          onCheck={this.onCheckEx}
                          checkedKeys={this.state.checkedKeysEx}
                          onSelect={this.onSelectEx}
                          selectedKeys={this.state.selectedKeysEx}
                          checkStrictly
                        >
                          {this.renderTreeNodesEx(this.state.treeDataEx)}
                        </Tree>
                      </div>
                    </Col>
                    <Col span={16}>
                      <table style={{fontSize:14,border:'1px solid  #f4f4f4'}}>
                        <thead style={{background: '#f7f7f7',fontWeight:'bold'}}>
                        <tr style={{height:50}}>
                          <td style={{width:300}}>功能属性</td>
                          <td style={{width:300}}>描述</td>
                          <td style={{paddingTop:2}}>
                            <Button type="primary" onClick={this.handleOkEditFunc}>保存</Button>
                          </td>
                        </tr>
                        </thead>
                        <tbody>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>功能名称</td>
                          <td style={{width:300}}>{this.props.roleSetting.funcItem.funcName}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>功能URL</td>
                          <td style={{width:300}}>{this.props.roleSetting.funcItem.funcUri?this.props.roleSetting.funcItem.funcUri:"#"}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>类型</td>
                          <td style={{width:300}}>{this.props.roleSetting.funcItem.funcTypeText}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        <tr style={{height:50,border:'1px solid  #f4f4f4'}}>
                          <td style={{width:300}}>备注</td>
                          <td style={{width:300}}>{this.props.roleSetting.funcItem.funcDesc}</td>
                          <td style={{paddingTop:2}}></td>
                        </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </TabPane>
              </Tabs>
            </Modal>}
            <Table
              style={{paddingLeft:'0px', paddingTop: '10px'}}
              bordered
              columns={columns}
              dataSource={this.state.tableList}
              pagination={paginationProps}
              onChange={handleTableChange}
              loading={this.props.loading.effects['roleSetting/query']}
            >
            </Table>


          </Col>
        </Row>
      </div>
    )
  }
}

export default connect(({roleSetting,loading,app }) => ({roleSetting,loading,app }))(Form.create()(roleSetting))
