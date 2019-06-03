import React,{Component} from 'react'
import { Page } from 'components'
import { Row, Col,Form,Button,Modal,Card,Icon,Tree,Anchor,Menu,message } from 'antd'

/**
 * @Title:业务模型树形图组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const { Link } = Anchor;
const confirm = Modal.confirm

class BusinessTree extends Component{
  state = {
    connectionVisible:false,
    tempStyle: {},//右键菜单样式
    visible: false,//鼠标右键
    rightkey:{},
  }

  componentDidMount = ()=> {
    this.props.dispatch({
      type: this.props.LedgerType+'/modelsyntree',
    })
  }

  render(){
    const {  LedgerType,changeAddBusinsessModal,changeBusinsessTableModal,changeTableAddModal,changeBusinessRelationsModal,businessTitle,
    relationTitle,changeModelCode,changeTableCode } = this.props;
    const connectionAdd = () => {
      this.props.dispatch({
        type:LedgerType+'/modelinfoadd'
      }).then(()=>{
        changeAddBusinsessModal(true)
        businessTitle('create')
      })


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
          rootkey: e.node.props.eventKey,
          isleaf: e.node.props.isleaf,
          relaType: e.node.props.relaType,
          modelCode:e.node.props.modelCode,
          tableCode:e.node.props.tableCode,
          colCode:e.node.props.colCode,
          relationalCode:e.node.props.relationalCode,

        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)

    }

    const businesstableprops = () => {
      /*relatype 02：表，03：字段，04：模型，05：关系*/
      if(this.state.rightkey.relaType === '04'){
        this.props.dispatch({
          type: LedgerType+'/modelinfo',
          payload:{
            modelCode:this.state.rightkey.modelCode
          }
        })
        changeAddBusinsessModal(true)
        businessTitle('update')
      }
      if(this.state.rightkey.relaType === '02'){
        this.props.dispatch({
          type: LedgerType+'/modeltabletree',
          payload:{
            tableCode:this.state.rightkey.tableCode
          }
        }).then(()=>{
          changeTableCode(this.state.rightkey.tableCode)
          changeBusinsessTableModal(true)
        })
        this.props.dispatch({
          type: LedgerType+'/modellinkcollist',
          payload:{
            modelCode:this.state.rightkey.modelCode,
            tableCode:this.state.rightkey.tableCode,
          }
        })
      }
      if(this.state.rightkey.relaType === '03'){
        this.props.dispatch({
          type: LedgerType+'/modeltabletree',
          payload:{
            tableCode:this.state.rightkey.tableCode
          }
        }).then(()=>{
          changeTableCode(this.state.rightkey.tableCode)
          changeBusinsessTableModal(true)
        })
        this.props.dispatch({
          type: LedgerType+'/modellinkcollist',
          payload:{
            modelCode:this.state.rightkey.modelCode,
            tableCode:this.state.rightkey.tableCode,
          }
        })
      }
      if(this.state.rightkey.relaType === '05'){
        /*初始化来源表下拉*/
        this.props.dispatch({
          type:LedgerType+'/modelfromtablelist',
          payload:{
            modelCode:this.state.rightkey.modelCode
          }
        })
        /*初始化目标表下拉*/
        this.props.dispatch({
          type:LedgerType+'/modeltargettablelist',
          payload:{
            modelCode:this.state.rightkey.modelCode
          }
        })
        this.props.dispatch({
          type: LedgerType+'/modelrelationalinfo',
          payload:{
            relationalCode:this.state.rightkey.relationalCode
          }
        }).then(()=>{
          this.props.dispatch({
            type: LedgerType+'/modelfcollist',
            payload:{
              tableCode:this.props.relationList.tableCode1,
            }
          })
          this.props.dispatch({
            type: LedgerType+'/modeltcollist',
            payload:{
              tableCode:this.props.relationList.tableCode2,
            }
          })
          changeBusinessRelationsModal(true)
          relationTitle('update')
        })
      }


    }
    /*创建业务关系*/
    const businessRelationsAdd = ()=>{
      /*初始化来源表下拉*/
      this.props.dispatch({
        type:LedgerType+'/modelfromtablelist',
        payload:{
          modelCode:this.state.rightkey.modelCode
        }
      })
      /*初始化目标表下拉*/
      this.props.dispatch({
        type:LedgerType+'/modeltargettablelist',
        payload:{
          modelCode:this.state.rightkey.modelCode
        }
      })
      relationTitle('create')
      changeModelCode(this.state.rightkey.modelCode)
      changeBusinessRelationsModal(true)

    }

    const businessDel =()=>{
      if(this.state.rightkey.relaType ==='04'){
        modelDel()
      }
      if(this.state.rightkey.relaType ==='02'){
        tableDel()
      }
      if(this.state.rightkey.relaType ==='03'){
        colDel()
      }
      if(this.state.rightkey.relaType ==='05'){
        relationDel()
      }
    }
    /*模型删除*/
    const modelDel = ()=>{
      const { dispatch } = this.props
      const modelcode = this.state.rightkey.modelCode
      confirm({
        title:"确定删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk (){
          dispatch({
            type: LedgerType+'/modeldel',
            payload:{
              modelCode:modelcode
            }
          })
        }
      })
    }
    /*表删除*/
    const tableDel = ()=>{
      const { dispatch } = this.props
      const tablecode = this.state.rightkey.tableCode
      confirm({
        title:"确定删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk (){
          dispatch({
            type: LedgerType+'/modeltabledel',
            payload:{
              tableCode:tablecode
            }
          })
        }
      })
    }
    /*列删除*/
    const colDel = ()=>{
      const { dispatch } = this.props
      const colcode = this.state.rightkey.colCode
      confirm({
        title:"确定删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk (){
          dispatch({
            type: LedgerType+'/modelcoldel',
            payload:{
              colCode:colcode
            }
          })
        }
      })
    }
    /*关系删除*/
    const relationDel =()=>{
      const { dispatch } = this.props
      const relationalCode = this.state.rightkey.relationalCode
      confirm({
        title:"确定删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk (){
          dispatch({
            type: LedgerType+'/modelrelationaldel',
            payload:{
              relationalCode:relationalCode
            }
          })
        }
      })
    }

    const tableAddModal = () => {
      this.props.dispatch({
        type:LedgerType+'/modellinktablelist',
        payload:{
          modelCode:this.state.rightkey.modelCode
        }
      })

      changeTableAddModal(true)
    }
    const loop = data => data.map((item) => {
      if (item.modelName) {
        return <TreeNode key={item.modelName} title={item.modelName} relaType={item.relaType} modelCode={item.modelCode}>
          <TreeNode key="业务表" title="业务表" relaType="table" modelCode={item.modelCode}>
            {looptable(item.BusinessTables)}
          </TreeNode>
          <TreeNode key="业务关系" title="业务关系" relaType="relation" modelCode={item.modelCode} >
            {looprelation(item.Relationships)}
          </TreeNode>
        </TreeNode>
      }
    })
    const looptable = data => data.map((item) => {
      if (item.tableName) {
        return <TreeNode key={item.tableCode} title={item.tableName} relaType={item.relaType} tableCode={item.tableCode}  modelCode={item.modelCode} >
          {looptable(item.colList)}
        </TreeNode>
      }
      return <TreeNode key={item.colCode} title={item.colName} relaType={item.relaType} colCode={item.colCode} tableCode={item.tableCode}  modelCode={item.modelCode}>
      </TreeNode>
    })
    const looprelation = data => data.map((item) => {
      if (item.relationalName) {
        return <TreeNode key={item.relationalCode} title={item.relationalName} relaType={item.relaType} relationalCode={item.relationalCode} modelCode={item.modelCode}/>
      }
    })

    return(
      <div>
        <Card style={{height:'800px'}}>

          <Button style={{width:'100%'}} onClick={e => connectionAdd()}><Icon type="plus" />创建业务模型</Button>
          <Tree
            showLine
            defaultExpandedKeys={['业务模型']}
            onRightClick={onRightClick}
            //onSelect={onSelect}
          >
            <TreeNode key="业务模型" title="业务模型" relaType="business">
              {loop(this.props.modelList)}
            </TreeNode>
          </Tree>

        </Card>
        <Menu
          visible={this.state.visible}
          style={this.state.tempStyle}
        >{
          this.state.rightkey.relaType ==="table"?
            <Menu.Item key='1'><a onClick={e =>tableAddModal() }>导入表</a></Menu.Item>
            :null
        }{
          this.state.rightkey.relaType ==="02"||this.state.rightkey.relaType ==="03"||this.state.rightkey.relaType ==="04"||this.state.rightkey.relaType ==="05"?
            <Menu.Item key='3'><a onClick={e =>businesstableprops() }>编辑</a></Menu.Item>
            :null
        }{
          this.state.rightkey.relaType ==="02"||this.state.rightkey.relaType ==="03"||this.state.rightkey.relaType ==="04"||this.state.rightkey.relaType ==="05"?
            <Menu.Item key='4'><a onClick={e =>businessDel()}>删除</a></Menu.Item>
            :null
        }{
          this.state.rightkey.relaType ==="relation"?
            <Menu.Item key='2'><a onClick={e =>businessRelationsAdd() }>创建关系</a></Menu.Item>
            :null
        }{
          this.state.rightkey.relaType ==="business"?
          <Menu.Item key='5'><a onClick={e =>connectionAdd() }>创建</a></Menu.Item>
            :null
        }

        </Menu>
      </div>
    )
  }
}
export default Form.create()(BusinessTree)
