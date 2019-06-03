import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Card,Icon,Tree,Select,Menu } from 'antd'
import styles from './Connectionlist.less'


/**
 * @Title:初始化数据组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option
const confirm = Modal.confirm;

class Connectionlist extends Component{
  state = {
    visible: false,//鼠标右键
    tempStyle: {},//右键菜单样式
    rightkey:{},
    dbType:"",

  }



  render(){
    const {  LedgerType,changeTablePropsModal,changeLinkModal,changeDataViewModal,linkTitle,tablelist,changeExportModal,
      exportVisible,changeTableCode,changeDbType } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = this.props.form

    const columns = [
      {
        title: '表名称',
        dataIndex: 'table',
        key: 'table',
      },
    ]
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
          relaType: e.node.props.relaType,
          relaCode: e.node.props.eventKey,
          tableCode:e.node.props.tableCode,
          dbType:e.node.props.dbType,
        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)
    }

    const loop = data => data.map((item) => {
      if (item.list) {
        return <TreeNode key={item.relaCode} title={item.relaName}  relaType={item.relaType} tableCode={item.tableCode} dbType={item.dbType} >
          {loop(item.list)}
        </TreeNode>
      }
      return <TreeNode key={item.relaCode} title={item.relaName}  relaType={item.relaType} tableCode={item.tableCode} dbType={item.dbType} />
    })

    /*导入表*/
    const exportModalProps = {
      visible: exportVisible,
      maskClosable: false,
      title: '导入表',
      wrapClassName: 'vertical-center-modal',
      width:"500px",
      onCancel:()=>{
        changeExportModal(false)
      },
      onOk:()=>{
        exporttablesave()
      }
    }
    /*创建连接*/
    const connectionAdd = () => {
      changeLinkModal(true)
      linkTitle("create")
    }

    /*右键导入表*/
    const exporttable = () => {
      this.props.dispatch({
        type: LedgerType+'/linktablelist',
        payload:{
          linkCode:this.state.rightkey.relaCode
        }
      }).then(()=>{
        changeExportModal(true)
      })

    }
    /* 右键导入表保存*/
    const exporttablesave =()=>{
      this.props.dispatch({
        type: LedgerType+'/linktableadd',
        payload:{
          linkCode:this.state.rightkey.relaCode,
          tables:this.props.selectedRowKeys
        }
      })
    }

    /*右键数据浏览*/
    const dataView = () => {
      this.props.dispatch({
        type: LedgerType+'/linkdbshow',
        payload:{
          linkCode:this.state.rightkey.relaCode,
        }
      }).then(()=>{
        changeDataViewModal(true)
      })

    }
    /*右键编辑(relaType===01为连接，02为表,03为字段)*/
    const tableprops = () => {
      if(this.state.rightkey.relaType === '01'){
        this.props.dispatch({
          type:LedgerType+'/linksearchinfo',
          payload:{
            linkCode:this.state.rightkey.relaCode
          }
        })
        changeLinkModal(true)
        linkTitle("update")
        changeDbType(this.state.rightkey.dbType)


      }
      if(this.state.rightkey.relaType === '02'){
        this.props.dispatch({
          type: LedgerType+'/linktabletree',
          payload:{
            tableCode:this.state.rightkey.tableCode,
          }
        }).then(()=>{
          changeTableCode(this.state.rightkey.tableCode)
          changeTablePropsModal(true)
        })

      }
      if(this.state.rightkey.relaType === '03'){
        this.props.dispatch({
          type: LedgerType+'/linktabletree',
          payload:{
            tableCode:this.state.rightkey.tableCode,
          }
        }).then(()=>{
          changeTableCode(this.state.rightkey.tableCode)
          changeTablePropsModal(true)
        })
      }
    }

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        let tableArray = []
        if(selectedRows){
          selectedRows.map((item)=>{
            tableArray.push(item.table)
          })
        }
        this.props.dispatch({
          type: LedgerType+'/updateState',
          payload: {
            selectedRowKeys: tableArray,
          },
        })
      },
    };

    //删除
    const del =()=>{
      if(this.state.rightkey.relaType === '01'){
        linkdel()
      }
      if(this.state.rightkey.relaType === '02'){
        tabledel()
      }
      if(this.state.rightkey.relaType === '03'){
        coldel()
      }
    }

    //表删除
    const tabledel =()=>{
      const { dispatch } = this.props
      const tablecode = this.state.rightkey.relaCode
      confirm({
        title: '确定删除此表吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: LedgerType+'/linktabledel',
            payload:{
              tableCode:tablecode
            }
          })
        },
      });

    }
    const coldel =()=>{
      const { dispatch } = this.props
      const colcode = this.state.rightkey.relaCode
      confirm({
        title: '确定删除此字段吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: LedgerType+'/linkcoldel',
            payload:{
              colCode:colcode
            }
          })
        },
      });
    }

    //连接删除
    const linkdel =()=>{
      const { dispatch } =this.props
      const linkcode = this.state.rightkey.relaCode
      confirm({
        title: '确定删除此连接吗?',
        okText: '确定',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: LedgerType+'/linkdel',
            payload:{
              linkCode:linkcode
            }
          })
        },
      });
    }

    return(
      <div className="scrollable-container">
        <Card style={{height:'800px'}}>
          <Button style={{width:'100%'}} onClick={e => connectionAdd()}><Icon type="plus" />创建连接</Button>
          {/*<div style={{overflow: 'auto', width:'100%', height: '600px'}}>*/}
            <Tree
              showLine
              defaultExpandedKeys={['数据库连接']}
              onRightClick={onRightClick}
              //onSelect={onSelect}
            ><TreeNode key="数据库连接" title="数据库连接" relaType="link">
              {loop(this.props.list)}
            </TreeNode>
            </Tree>
          {/*</div>*/}
        </Card>
        <Modal
          {...exportModalProps}
        >
          <Table
            columns={columns}
            rowSelection={rowSelection}
            scroll={{ y: 300 }}
            size='small'
            dataSource={tablelist}
            pagination={false}
          />
        </Modal>

        <Menu
          visible={this.state.visible}
          style={this.state.tempStyle}
        >
          {
            this.state.rightkey.relaType==="link"?null:
              <Menu.Item key='1'><a onClick={e =>tableprops() }>编辑</a></Menu.Item>
          }
          {
            this.state.rightkey.relaType==="01"?
              <Menu.Item key='2'><a onClick={e =>exporttable() }>导入表</a></Menu.Item>
              : null
          }
          {
            this.state.rightkey.relaType==="01"?
          <Menu.Item key='3'><a onClick={e =>dataView() }>数据浏览</a></Menu.Item>
              : null
          }
          {
            this.state.rightkey.relaType==="link"?null:
              <Menu.Item key='4'><a onClick={e =>del()}>删除</a></Menu.Item>
          }
        </Menu>
      </div>
    )
  }
}
export default Form.create()(Connectionlist)
