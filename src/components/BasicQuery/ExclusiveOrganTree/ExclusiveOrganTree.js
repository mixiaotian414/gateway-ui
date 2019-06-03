import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Form,Tree,TreeSelect} from 'antd'
import { routerRedux } from 'dva/router'
import { request } from 'utils'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;


import PropTypes from 'prop-types'

/**
 * @Title:基础查询组件》单选机构树
 * initialValue:2999999,交通银行山东省分行
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/9/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
class ExclusiveOrganTree extends Component{
  state={

    treeData: [
     /* { title: '长沙市办', key: '0',value:'0', isLeaf: false  },
      { title: '常德市办', key: '1',value:'1', isLeaf: false  },
      { title: '郴州市办', key: '2' ,value:'2',isLeaf: true },*/
    ],
    appId :undefined,
    orgId:undefined,

  }
  componentWillReceiveProps = (props) => {
    const {appId,orgId}=props.app.user
    let stateAppId =this.state.appId
    let stateOrgId =this.state.orgId
    console.log(appId,orgId,"props")
    console.log(stateAppId,stateOrgId,"state")
    if (appId&&orgId){
      if(appId!==stateAppId||orgId!==stateOrgId)
      {
        this.setState({
          appId,
          orgId
        })
      this.firstfetch(appId ,orgId )}
    }

  }
    componentDidMount () {
    console.log("DidMount",   this.props.app)

    const { appId ,orgId} = this.props.app.user
      if (appId&&orgId){
        this.setState({
          appId,
          orgId
        })
        this.firstfetch(appId ,orgId )

      }

  }
   fetch = (appId ,orgId, ) => {
    console.log(appId,orgId)
    this.promise = request({
      url:"/gateway/organizationtree.json",
      method: 'post',
      data: {
        parentOrgId:orgId,
        appId:appId
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.orgList

      let treeData =queryData.map((data)=>{
        let obj={
          title:data.orgName,
          key:data.orgId,
          value:data.orgId,
          isLeaf:data.isLeaf
        }
        return obj
      })

      this.setState({treeData:[...treeData]})
    })
  }

  firstfetch = (appId ,orgId, ) => {
    console.log(appId,orgId)
    this.promise = request({
      url:"/gateway/organizationtree.json",
      method: 'post',
      data: {
        orgId:orgId,
        appId:appId
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.orgList

      let treeData =queryData.map((data)=>{
        let obj={
          title:data.orgName,
          key:data.orgId,
          value:data.orgCode,
          isLeaf:data.isLeaf
        }
        return obj
      })

      this.setState({treeData:[...treeData]})
    })
  }



  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      const {appId} =this.state
      let orgId=treeNode.props.dataRef.key
      console.log(treeNode.props,'treeNode.props')
      this.promise = request({
        url:"/gateway/organizationtree.json",
        method: 'post',
        data: {
          parentOrgId:orgId,
          appId:appId
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.orgList

        let treeData =queryData.map((data)=>{
          let obj={
            title:data.orgName,
            key:data.orgId,
            value:data.orgCode,
            isLeaf:data.isLeaf
          }
          return obj
        })
          treeNode.props.dataRef.children = treeData;
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
      })

    });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode  value ={item.value} title={item.title} key={item.key} dataRef={item}  >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}   />;
    });
  }

  render(){

    const { getFieldDecorator} = this.props.form

    return(

      <FormItem label="机构:">
        {getFieldDecorator('Branch',{
          initialValue:"2999999"
        })
        ( <TreeSelect loadData={this.onLoadData}
                      placeholder="多选机构"

                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{height:'200px',width:'300px'}}

          >
            {this.renderTreeNodes(this.state.treeData)}
          </TreeSelect>
        )}
      </FormItem>)
  }
}
ExclusiveOrganTree.propTypes = {

}
/*export default ExclusiveOrganTree*/

export default connect(({ app }) => ({ app }))(ExclusiveOrganTree)
