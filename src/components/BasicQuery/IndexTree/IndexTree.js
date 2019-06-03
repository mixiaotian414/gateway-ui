import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Form,Tree,TreeSelect} from 'antd'
import { routerRedux } from 'dva/router'
const FormItem = Form.Item;
const TreeNode = Tree.TreeNode;
import { request } from 'utils'

import PropTypes from 'prop-types'

/**
 * @Title:基础查询组件》指标树
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/5/7
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
class IndexCard extends Component{
  state={
    treeData: [
    /*  { title: '等同于贷款的授信业务', key: '00',value:'00', isLeaf: false  },
      { title: '与交易相关的或有项目', key: '01',value:'01', isLeaf: false  },
      { title: '表内加权风险资产', key: '02' ,value:'02',isLeaf: true },
      */
    ],
  }
  componentWillReceiveProps = (props) => {
  }
  componentDidMount () {
  /*  console.log("DidMount")*/


    this.fetch("-1")
  }
  fetch = (code) => {
    console.log(code)
    this.promise = request({
      url:"/gateway/derivesynprodtree.json",
      method: 'post',
      data: {
        code:code
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.basicList

      let treeData =queryData.map((data)=>{
        let obj={
          title:data.name,
          key:data.code,
          value:data.code,
          isLeaf:data.isLeaf==="true"?true:false
        }
        return obj
      })

      this.setState({treeData:[...treeData]})
    })
  }
/*  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          /!*  { title: 'Child Node', key: `${treeNode.props.eventKey}-0` ,value:{ value: `${treeNode.props.eventKey}-0`} ,isLeaf: false},
            { title: 'Child Node', key: `${treeNode.props.eventKey}-1` ,value:{ value: `${treeNode.props.eventKey}-1`} ,isLeaf: false},*!/
          { title: '承兑汇票', key: `${treeNode.props.eventKey}-0` ,value: `${treeNode.props.eventKey}-0`,isLeaf: false},
          { title: '融资性保函', key: `${treeNode.props.eventKey}-1` , value: `${treeNode.props.eventKey}-1` ,isLeaf: false},
        ];
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      }, 100);
    });
  }*/

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      let code=treeNode.props.eventKey
      this.promise = request({
        url:"/gateway/derivesynprodtree.json",
        method: 'post',
        data: {
          code
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.basicList

        let treeData =queryData.map((data)=>{
          let obj={
            title:data.name,
            key:data.code,
            value:data.code,
            isLeaf:data.isLeaf==="true"?true:false
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
          <TreeNode value ={item.value} title={item.title} key={item.key} dataRef={item}  disableCheckbox={item.isLeaf?false:true}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}   disableCheckbox={item.isLeaf?false:true} />;
    });
  }

  render(){

    const { getFieldDecorator} = this.props.form
    const { queryData } = this.state
    return(

      <FormItem label="指标:">
        {getFieldDecorator('products',{
          /*     valuePropName: 'key'*/
        })
        (
          <TreeSelect loadData={this.onLoadData}
                      placeholder="只允许选择叶子节点"
                      treeCheckable
                      treeCheckStrictly
                      dropdownMatchSelectWidth={false}
                      dropdownStyle={{height:'200px',width:'300px'}}

          >
            {this.renderTreeNodes(this.state.treeData)}
          </TreeSelect>
        )}
      </FormItem>)
  }
}
IndexCard.propTypes = {

}
export default Form.create()(IndexCard)


