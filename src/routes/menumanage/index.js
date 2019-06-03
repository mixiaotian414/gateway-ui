import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { GifButton } from 'components'
import { Button, Select, Form,Table, message, Input, Row, Col, Tree, Switch, Modal, Menu,Tabs, Icon, Card, Divider, Radio, Dropdown} from 'antd'
import { arrayToTree, queryArray } from 'utils'
import styles from './index.less'

/**
 * @title:菜单管理菜单树
 * @author:chenshuai
 * @time:2018/4/11
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm
const { TabPane } = Tabs
const Option = Select.Option
const RadioGroup = Radio.Group;

class menumanage extends Component {
    state = {
      modalVisible: false,
      visible: false,
      tempStyle: {},
      rightkey: {},
      btnStatus: [],
      modaltitle: "",
      treelist: [],
      menuid: [],
      selectedRowKeys: [],
      isleaf: null,
      selectedKeys:[],
      Switchvalue: true,
    };

  //初始化默认显示根节点下第一个子节点基本信息
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'menumanage/query',
    }).then(()=>{
      this.setState({
        selectedKeys:[this.props.menumanage.list[0].children[0].menuId]
      })
      this.props.dispatch({
        type: 'menumanage/queryid',
        payload: {
          appId:this.props.app.user.appId,
          menuId:this.props.menumanage.list[0].children[0].menuId,
        },
      })
      //角色明细
      this.props.dispatch({
        type: 'menumanage/queryPersonnelrole',
        payload: {
          appId: this.props.app.user.appId,
          menuId: this.props.menumanage.list[0].children[0].menuId,
        },
      })
      //路由明细
      this.props.dispatch({
        type: 'menumanage/queryrutelist',
        payload: {
          appId: this.props.app.user.appId,
          page: 1,
          pageSize: 10,
        }

      })
      //路由选中
      this.props.dispatch({
        type: 'menumanage/menucheckmenu',
        payload: {
          appId: this.props.app.user.appId,
          menuId: this.props.menumanage.list[0].children[0].menuId,
        }
      })
    })
  }

  //路由下拉列表
  getRouteType() {
    const array = this.props.menumanage.getRouteTypeList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }
  //是否显示菜单下拉列表
  getShowType() {
    const array = this.props.menumanage.getShowTypeList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }


  componentWillReceiveProps = (nextprops) => {
    let routeIdNew = []
    routeIdNew.push(this.props.menumanage.routeId)
    this.setState({
        selectedRowKeys:routeIdNew
    })

  }

  //改变switch
  handleSwitch(e) {
    const Switchvalue = e == true ? 1 : 0
    this.setState({
      Switchvalue: Switchvalue,
    })
  }


  render () {
    const FormItem = Form.Item
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFieldsValue } = this.props.form
    const { menumanage: { list, item, queryPersonnelrolelist,  queryroutelist, pagination } } = this.props

    //获取功能集合
    const funclist = this.props.app.funcList
    //鼠标右键功能键
    const menuAdd = funclist.map((item,key) =>(item.funcCode ==="100401"&& item.isRole === true?<Menu.Item key='100401'><a onClick={e => addState(e,this.state.rightkey.appId,this.state.rightkey.menuId)}><Icon type="plus-circle" />新增</a></Menu.Item>:null))
    const menuUpdate = funclist.map((item,key) =>(item.funcCode ==="100403"&& item.isRole === true?<Menu.Item key='100403'><a onClick={e => updateState(e,this.state.rightkey.appId,this.state.rightkey.menuId)}><Icon type="edit" />修改</a></Menu.Item>:null))
    const menuRemove = funclist.map((item,key) =>(item.funcCode ==="100402"&& item.isRole === true?<Menu.Item key='100402'><a onClick={e => remove(e, this.state.rightkey.appId,this.state.rightkey.menuId,this.state.rightkey.pMenuId)}><Icon type="minus-circle-o" />删除</a></Menu.Item>:null))
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

    const rutebind = [
      {
        title: '路由编码',
        dataIndex: 'routeCode',
        key: 'routeCode',
        width:'12%',
      },{
        title: '路由名称',
        dataIndex: 'routeName',
        key: 'routeName',
        width:'18%',
      },{
        title: '路由备注',
        dataIndex: 'routeDesc',
        key: 'routeDesc',
        width:'12%',
      },{
        title: '路由地址',
        dataIndex: 'routeUri',
        key: 'routeUri',
        width:'20%',
      },{
        title: '最后更新人',
        dataIndex: 'userName',
        key: 'userName',
        width:'14%',
      },
      {
        title: '最后更新时间',
        dataIndex: 'lastUpdateTime',
        key: 'lastUpdateTime',
        width:'25%',
      },
    ]
    //遍历树形
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode key={item.menuId} title={item.menuNameCh} appId={item.appId} menuId={ item.menuId } pMenuId={ item.pmenuId } isleaf={item.isLeaf} >
          {loop(item.children)}
          </TreeNode>
      }
      return <TreeNode key={item.menuId} title={item.menuNameCh} appId={item.appId} menuId={ item.menuId } pMenuId={ item.pmenuId } isleaf={item.isLeaf} />
    })

    const handleModalVisible = (flag) => {
      this.setState({
        modalVisible: !!flag,
      })
    }


    const formItemLayout = {
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
          menuId: e.node.props.menuId,
          pMenuId: e.node.props.pMenuId,
          rootkey: e.node.props.eventKey,
          isleaf: e.node.props.isleaf,

        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)

    }

    const remove = (e,appId, menuId, pMenuId) => {
      const { dispatch } = this.props
      dispatch({
        type: 'menumanage/delete',
        payload: {
          appId,
          menuId,
          pMenuId,
        },
      }).then(()=>{
        if(this.props.menumanage.countflag>0){
          confirm({
            title:'此菜单已配置角色 是否继续删除?',
            okText: "是",
            cancelText: "否",
            onOk (){
              dispatch({
                type: 'menumanage/delete',
                payload: {
                  count: "1",
                  appId,
                  menuId,
                  pMenuId,
                },
              })
              message.success('删除成功')
            }
          })
        }else if(this.props.menumanage.countflag ===0){
          confirm({
            title:'是否删除此菜单?',
            okText: "是",
            cancelText: "否",
            onOk (){
              dispatch({
                type: 'menumanage/delete',
                payload: {
                  count:"1",
                  appId,
                  menuId,
                  pMenuId,
                },
              })
              message.success('删除成功')
            }
          })
        }
      })
    }

    //modal保存
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
          type: 'menumanage/add',
          payload: {
            appId: fieldsValue.aId,
            pMenuId: fieldsValue.pId,
            menuCode: fieldsValue.mCode,
            menuNameCh: fieldsValue.mNameCh,
            menuNameEn: fieldsValue.mNameEn,
            menuNameShort: fieldsValue.mNameShort,
            seq: fieldsValue.seqq,
            displayOrder: fieldsValue.dpyOrder,
            user: fieldsValue.cuser,
            status: this.state.Switchvalue,
            iconPath: fieldsValue.iPath,
            isRoute: fieldsValue.isRouteadd,
            isShow: fieldsValue.isShowadd,
            level:fieldsValue.level1,
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
          type: 'menumanage/update',
          payload: {
            appId: fieldsValue.aId,
            pMenuId: fieldsValue.pId,
            menuCode: fieldsValue.mCode,
            menuNameCh: fieldsValue.mNameCh,
            menuNameEn: fieldsValue.mNameEn,
            menuNameShort: fieldsValue.mNameShort,
            seq: fieldsValue.seqq,
            displayOrder: fieldsValue.dpyOrder,
            user: fieldsValue.cuser,
            status: this.state.Switchvalue,
            iconPath: fieldsValue.iPath,
            menuId:fieldsValue.mId,
            isRoute: fieldsValue.isRouteadd,
            isLeaf: this.state.rightkey.isleaf,
            isShow: fieldsValue.isShowadd,
          },
        })

        this.setState({
          modalVisible: false,
        })
      })
    }
    //鼠标右键新增
    const addState = (e,appId,menuId) => {
        this.props.form.resetFields()
        this.props.dispatch({
          type: 'menumanage/queryid',
          payload: {
            appId:appId,
            menuId:menuId,
          },
        })
        handleModalVisible(true)
        this.setState({
          btnStatus: 2,
          modaltitle:"菜单新增",

        })
    }

    //鼠标右键修改回显
    const updateState = (e,appId,menuId) => {
        this.props.form.resetFields()
        this.props.dispatch({
          type: 'menumanage/queryid',
          payload: {
            appId:appId,
            menuId:menuId,
          },
        })
        this.setState({
          btnStatus: 1,
          modaltitle:"菜单修改",

        })

        handleModalVisible(true)

    }
    //鼠标左键点击菜单树事件
    const onSelect = (info) => {
        this.setState({
          menuid:info[0],
        })
        this.props.dispatch({
          type: 'menumanage/queryid',
          payload: {
            appId: this.props.app.user.appId,
            menuId: info[0],
          },
        })
        //角色明细
        this.props.dispatch({
          type: 'menumanage/queryPersonnelrole',
          payload: {
            appId: this.props.app.user.appId,
            menuId: info[0],
          },
        })
        //路由明细
        this.props.dispatch({
          type: 'menumanage/queryrutelist',
          payload: {
            appId: this.props.app.user.appId,
            menuId: info[0],
            page: 1,
            pageSize: 10,
          }

        })
        //路由选中
        this.props.dispatch({
          type: 'menumanage/menucheckmenu',
          payload: {
            appId: this.props.app.user.appId,
            menuId: info[0],
          }
        })
    }

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    }
    //路由列表
    const handleTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props
      const routeName = this.props.form.getFieldValue("roleName1");
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj }
        newObj[key] = this.getValue(filtersArg[key])
        return newObj
      }, {})

      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        routeName: routeName || '',
        ...filters,
      }
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`
      }

      dispatch({
        type: 'menumanage/queryrutelist',
        payload: params,
      })
    }

    //勾选路由
    const {selectedRowKeys} = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: (record,e) => {
        let temp = []
        if(record.length>1){
          temp[0] = record[record.length-1]
        }else{
          temp[0] = record[0]
        }
        this.setState({
          selectedRowKeys: [],
        },()=>{
          this.setState({selectedRowKeys:temp})
        })
      },
      onSelectInvert: (record,e) => {
        this.props.dispatch({
          type: 'menumanage/updateState',
          payload: {
            selectedRowKeys: record,
            ids: e,
          },
        })
      }
    };

    //绑定路由保存
    const okHandleApi = () => {
      const { dispatch } = this.props
      const selectkey = this.state.selectedRowKeys
      const aid = this.props.app.user.appId
      const mid = this.state.menuid
        confirm({
          title: selectkey[0] ===undefined?'确定与此路由解除绑定吗?':'确定绑定此路由吗?',
          okText: "确定",
          cancelText: "取消",
          onOk () {
            dispatch({
              type: 'menumanage/routebind',
              payload: {
                appId: aid,
                menuId: mid,
                routeId: selectedRowKeys[0],
              },
            })
          },
        })

    }
    //路由查询
    const handleSearchRoute = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const routeName = this.props.form.getFieldValue("roleName1");
      const values = {
        appId:this.props.app.user.appId,
        routeName: routeName || '',
        page: 1,
        pageSize: 10,
      }
      dispatch({
        type: 'menumanage/queryrutelist',
        payload: values,
      })
    }
    //重置
    const handleFormReset = () => {
      const { form } = this.props;
      form.resetFields();
    }
    //鼠标失去焦点判断菜单代码是否唯一
    const onBlurChange = () => {
      const menuCode =this.props.form.getFieldValue("mCode")
      this.props.dispatch({
        type: 'app/validateVal',
        payload: {
          tab: 'ap_menu',
          col: 'MENU_CODE',
          val: menuCode,
        },
      }).then(()=>{
        if(this.props.app.flag){
          message.error("该菜单代码:"+"【"+menuCode+"】"+"已存在,请重新输入")
          this.props.form.resetFields("mCode")
        }
      })

    }

    const onClick =(key)=>{
      const fields = getFieldsValue()
      const newFields = {
        ...fields,
        iPath:key
      }
      setFieldsValue(newFields)
    };
    const menuStyle={
      border:'1px solid rgba(0, 0, 0, 0.08)',
      position:'relative',
      display: 'block',
      background: '#fff',
      width:'345px',
      height:'auto',
    }
    const menu = (
      <div style={{...menuStyle}}>
        <a onClick={event => onClick("area-chart")}><Icon type="area-chart" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("pie-chart")}><Icon type="pie-chart" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("dashboard")}><Icon type="dashboard" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("user")}><Icon type="user" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("api")}><Icon type="api" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("camera-o")}><Icon type="camera-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("bars")}><Icon type="bars" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("search")}><Icon type="search" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("bar-chart")}><Icon type="bar-chart" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("book")}><Icon type="book" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("calendar")}><Icon type="calendar" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("cloud")}><Icon type="cloud" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("code")}><Icon type="code" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("copy")}><Icon type="copy" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("code-o")}><Icon type="code-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("delete")}><Icon type="delete" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("desktop")}><Icon type="desktop" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("download")}><Icon type="download" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("edit")}><Icon type="edit" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("ellipsis")}><Icon type="ellipsis" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("file")}><Icon type="file" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("file-text")}><Icon type="file-text" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("file-unknown")}><Icon type="file-unknown" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("file-pdf")}><Icon type="file-pdf" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("file-add")}><Icon type="file-add" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("folder")}><Icon type="folder" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("folder-open")}><Icon type="folder-open" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("hdd")}><Icon type="hdd" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("frown-o")}><Icon type="frown-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("meh")}><Icon type="meh" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("meh-o")}><Icon type="meh-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("smile")}><Icon type="smile" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("smile-o")}><Icon type="smile-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("inbox")}><Icon type="inbox" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("laptop")}><Icon type="laptop" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("appstore-o")}><Icon type="appstore-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("appstore")}><Icon type="appstore" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("line-chart")}><Icon type="line-chart" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("link")}><Icon type="link" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("mail")}><Icon type="mail" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("mobile")}><Icon type="mobile" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("reload")}><Icon type="reload" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("poweroff")}><Icon type="poweroff" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("picture")}><Icon type="picture" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("notification")}><Icon type="notification" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("setting")}><Icon type="setting" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("share-alt")}><Icon type="share-alt" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("shopping-cart")}><Icon type="shopping-cart" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("tablet")}><Icon type="tablet" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("tag")}><Icon type="tag" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("tag-o")}><Icon type="tag-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("tags")}><Icon type="tags" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("tags-o")}><Icon type="tags-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("to-top")}><Icon type="to-top" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("upload")}><Icon type="upload" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("video-camera")}><Icon type="video-camera" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("home")}><Icon type="home" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("cloud-o")}><Icon type="cloud-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("loading-3-quarte")}><Icon type="loading-3-quarte" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("star")}><Icon type="star" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("star-o")}><Icon type="star-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("heart")}><Icon type="heart" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("heart-o")}><Icon type="heart-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("wallet")}><Icon type="wallet" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("environment-o")}><Icon type="environment-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("bank")}><Icon type="bank" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("eye-o")}><Icon type="eye-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("idcard")}><Icon type="idcard" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("camera-o")}><Icon type="camera-o" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("form")}><Icon type="form" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("team")}><Icon type="team" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("solution")}><Icon type="solution" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("phone")}><Icon type="phone" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("filter")}><Icon type="filter" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("exception")}><Icon type="exception" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("export")}><Icon type="export" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("customer-service")}><Icon type="customer-service" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("table")}><Icon type="table" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("profile")}><Icon type="profile" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
        <a onClick={event => onClick("message")}><Icon type="message" style={{fontSize: 20,margin:'7px 7px 7px 7px'}} /></a>
      </div>
    );
    return (
        <div className={styles.divbackground}>
          <Row>
            <Col span={8}>
              <Row style={{ marginTop: '10px' }} />
              <div style={{overflow: 'auto', width:'100%', height: '450px'}}>
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
                      <Col span={4}>菜单代码：</Col><Col span={6}>{item.menuCode}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                    <Row>
                      <Col span={4}>菜单中文名称：</Col><Col span={6}>{item.menuNameCh}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                    <Row>
                      <Col span={4}>菜单简称：</Col><Col span={6}>{item.menuNameShort}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                    <Row>
                      <Col span={4}>菜单顺序码：</Col><Col span={6}>{item.displayOrder}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                    <Row>
                      <Col span={4}>最后更新人：</Col><Col span={6}>{item.updator}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                    <Row>
                      <Col span={4}>最后更新时间：</Col><Col span={6}>{item.lastUpdate}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                    <Row>
                      <Col span={4}>菜单图标路径：</Col><Col span={6}>{item.iconPath}</Col>
                    </Row>
                    <Divider style={{margin:'10px 0'}} />
                  </Card>

                </TabPane>
                <TabPane tab="角色信息" key="2">
                  <Table
                    style={{paddingLeft:'0px', paddingTop: '0px'}}
                    bordered={false}
                    scroll={{ y: 350 }}
                    rowKey={record => record.roleId}
                    size="small"
                    rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                    columns={jiaose}
                    dataSource={queryPersonnelrolelist}
                    pagination={false}
                    loading={this.props.loading.effects['menumanage/queryPersonnelrole']}
                  >
                  </Table>

                </TabPane>
                {item.isRoute === '0'? null
                :<TabPane tab="路由绑定" key="4">
                    <Form layout="inline" onSubmit={handleSearchRoute} >
                      <FormItem   label="路由名称" style={{marginLeft: '10px'}} >
                        {getFieldDecorator('roleName1', {
                        })(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                      <FormItem >
                        <Button type="primary" loading={this.props.loading.effects['menumanage/queryrutelist']}  htmlType="submit" >查询</Button>
                      </FormItem>
                      <FormItem>
                        <Button type="primary" onClick={handleFormReset}  htmlType="submit" >重置</Button>
                      </FormItem>
                      <FormItem >
                        <GifButton FuncListBtn={funclist} btnType="primary" onBtnClick={() =>okHandleApi()} btnCode="100404" btnText="绑定" />
                      </FormItem>
                    </Form>
                    <Table
                      style={{marginTop: '10px'}}
                      className={styles.aa}
                      rowSelection={rowSelection}
                      rowKey={record => record.routeId}
                      bordered={false}
                      size="small"
                      columns={rutebind}
                      rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                      dataSource={queryroutelist}
                      pagination={paginationProps}
                      onChange={handleTableChange}
                      loading={this.props.loading.effects['menumanage/queryrutelist']}
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
              <Col span={12}>
                  {getFieldDecorator('aId', {
                    initialValue: item.appId,
                  })(<Input  type="hidden" />)}
              </Col>
              <Col span={12}>
                  {getFieldDecorator('pId', {
                    initialValue: this.state.modaltitle == "菜单新增" ? item.menuId: item.pMenuId,
                  })(<Input  type="hidden"  />)}
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {this.state.modaltitle == "菜单新增" ?
                  <FormItem {...formItemLayout} label="菜单代码" hasFeedback >
                    {getFieldDecorator('mCode', {
                      initialValue: this.state.modaltitle == "菜单新增" ? null: item.menuCode,
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
                        },
                        {
                          required: true,
                          message: '【菜单代码不能为"空"】',
                        },
                      ],
                    })(<Input onBlur={onBlurChange} placeholder="请输入" />)}
                  </FormItem>
                  :<FormItem {...formItemLayout} label="菜单代码" >
                    {getFieldDecorator('mCode', {
                      initialValue: this.state.modaltitle == "菜单新增" ? null: item.menuCode,
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
                        },
                        {
                          required: true,
                          message: '【菜单代码不能为"空"】',
                        },
                      ],
                    })(<Input onBlur={onBlurChange} placeholder="请输入" disabled />)}
                  </FormItem>
                }

              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="菜单中文名称" hasFeedback >
                  {getFieldDecorator('mNameCh', {
                    initialValue: this.state.modaltitle == "菜单新增" ? null: item.menuNameCh,
                    rules: [
                      {
                        required: true,
                        validator: (rule, value, callback) => {
                          if (!(/[\u4E00-\u9FA5]{1,128}/.test(value))) {
                            callback('【请输入"中文汉字"长度不能超过"64"个汉字】')
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
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="菜单英文名称" hasFeedback >
                  {getFieldDecorator('mNameEn', {
                    initialValue: this.state.modaltitle == "菜单新增" ? null: item.menuNameEn,
                    rules: [{
                      validator: (rule, value, callback) => {

                        if (!(/^[a-zA-Z]+$/.test(value))) {
                          callback('【请输入"英文"】')
                        }
                        else {
                          callback();
                        }
                      }
                    }
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="菜单简称" hasFeedback >
                  {getFieldDecorator('mNameShort', {
                    initialValue: this.state.modaltitle == "菜单新增" ? null: item.menuNameShort,
                    rules: [
                      {
                        required: true,
                        validator: (rule, value, callback) => {
                          if (!(/[\u4E00-\u9FA5]{1,64}/.test(value))) {
                            callback('【请输入"中文汉字"长度不能超过"32"个汉字】')
                          }
                          else {
                            callback();
                          }
                        }
                      },
                    ],
                  })(<Input placeholder="请输入"  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="菜单图标路径" hasFeedback >
                  <Dropdown overlay={menu} trigger={'click'}>
                  {getFieldDecorator('iPath', {
                    initialValue: this.state.modaltitle == "菜单新增" ? undefined: item.iconPath,
                  })(
                    <Input placeholder="请选择" autoComplete="off" readOnly />
                  )}
                  </Dropdown>
                </FormItem>
              </Col>
              <Col span={12}>
                <FormItem {...formItemLayout} label="显示顺序" hasFeedback >
                  {getFieldDecorator('dpyOrder', {
                    initialValue: this.state.modaltitle == "菜单新增" ? null: item.displayOrder,
                    rules: [{
                      required: true,
                      validator: (rule, value, callback) => {
                        if (!(/^[0-9]{1,7}$/.test(value))) {
                          callback('【请输入"数字"长度不能大于6位】')
                        }
                        else {
                          callback();
                        }
                      }
                    }
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="是否路由" hasFeedback >
                  {getFieldDecorator('isRouteadd', {
                    initialValue: this.state.modaltitle == "菜单新增" ? this.props.menumanage.getRouteTypeList[0].dictValue: item.isRoute,
                  })( <Select placeholder="请选择"  >
                    {this.getRouteType()}
                  </Select>)}
                </FormItem>
              </Col>
              <Col span={12}>
                {item.isRoute ==='1'&&this.state.modaltitle == "菜单新增"?
                  <FormItem {...formItemLayout} label="是否显示菜单" hasFeedback >
                    {getFieldDecorator('isShowadd', {
                      initialValue: this.state.modaltitle == "菜单新增" ? this.props.menumanage.getShowTypeList[1].dictValue: item.isShow,
                    })( <Select placeholder="请选择" disabled >
                      {this.getShowType()}
                    </Select>)}
                  </FormItem>
                  :<FormItem {...formItemLayout} label="是否显示菜单" hasFeedback >
                    {getFieldDecorator('isShowadd', {
                      initialValue: this.state.modaltitle == "菜单新增" ? this.props.menumanage.getShowTypeList[0].dictValue: item.isShow,
                    })( <Select placeholder="请选择"  >
                      {this.getShowType()}
                    </Select>)}
                  </FormItem>
                }
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <FormItem {...formItemLayout} label="路由状态：">
                  {this.state.modaltitle =="菜单修改"&&item.status === '0' ?
                    getFieldDecorator('cstatus')
                    (<Switch onChange={(e) => this.handleSwitch(e)} defaultChecked={false} checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} />)
                    :
                    getFieldDecorator('cstatus')
                    (<span><Switch onChange={(e) => this.handleSwitch(e)} defaultChecked={true} checkedChildren="启用" unCheckedChildren="未启用" style={{ width: 70 }} /></span>)
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                  {getFieldDecorator('mId', {
                    initialValue: item.menuId,
                  })(
                    <Input type="hidden" />
                  )}
                {getFieldDecorator('level1', {
                  initialValue: item.level,
                })(
                  <Input type="hidden" />
                )}
              </Col>
            </Row>
          </Form>
        </Modal>
          <Menu
            visible={this.state.visible}
            style={this.state.tempStyle}
          >
            {menuAdd}
            {menuUpdate}
            {
              this.state.rightkey.isleaf === true ? menuRemove : null
            }
          </Menu>
        </div>
    )
  }
}

export default connect(({ menumanage, loading, app }) => ({ menumanage, loading, app }))(Form.create()(menumanage))
