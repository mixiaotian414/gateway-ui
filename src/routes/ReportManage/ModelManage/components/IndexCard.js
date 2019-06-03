import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color,request } from 'utils'
import { getTimeDistance } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Input,Tree,Icon} from 'antd'
import { routerRedux } from 'dva/router'

const TreeNode = Tree.TreeNode;
import lodash from 'lodash'
import InfiniteListExample from './InfiniteListExample'

import PropTypes from 'prop-types'

/**
 * @Title:报表管理》模型创建》指标穿梭框》待选搜索指标树展现组件
 * @Description:带搜索指标树组件
 * @Author: mxt
 * @Time: 2018/4/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */



class IndexCard extends Component{
  state={
    treeData: [

    ],
    //索引值
    searchValue:undefined,
    //滚动按需取值列表显示状态
    listShow:false,
    //已经选择过，并且在已选框内的指标
    //用来控制指标树子节点是否再次可显
    isSelect:[],
    //调用查询发布订阅给‘列表’子组件
    basicIsSearch:false,
  }
  componentWillReceiveProps = (props) => {
    //是否触发选中待选项提交
    const isSubmit = props.isSubmit;
    //已选框删除的指标
    const deleteKeys = props.deleteKeys;
    //受控已选指标键
    const checkedKeys=this.state.checkedKeys?this.state.checkedKeys.checked:[]
    //受控初始选中的KEY，用于模型修改
   const initKeys=props.initKeys
    if(initKeys){
      this.setState({
        isSelect:initKeys,
      })
      this.props.initDone()
    }
    if(isSubmit){//如果触发
      //保存已选过的指标键
      const isSelect=this.state.isSelect.concat(checkedKeys)
      this.setState({
        isSelect,
        checkedKeys:undefined,
      })
      this.props.clearDone()
    }

    if(deleteKeys){
      //如果有删除键，则删除已选键，控制树节点可以允许被选择
      const isSelect=this.state.isSelect
      isSelect.splice(isSelect.findIndex(item => item=== deleteKeys), 1)
      this.setState({
        isSelect,
      })
      this.props.deleteDone()
    }
  }
  componentDidMount () {
    this.fetch("-1")
  }
  fetch = (code) => {
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
 /* onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: '指标'+treeNode.props.eventKey, key: `${treeNode.props.eventKey}-0` , isLeaf: true},
          { title: 'Child Node', key: `${treeNode.props.eventKey}-1` , isLeaf: false },
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
        const queryData = result.RSP_BODY.basicList||[]

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
    const isSelect=this.state.isSelect?this.state.isSelect:[]

    return data.map((item) => {
      let flag=true
      //已经提交的指标不可以再次被选中
      if(lodash.indexOf(isSelect,item.key)>-1){
        flag=false
      }
      if (item.children) {
        return (
          <TreeNode  title={item.title} key={item.key} dataRef={item} disableCheckbox={item.isLeaf?false:true}  >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item}  disableCheckbox={(item.isLeaf&&flag)?false:true} />;
    });
  }
  emitEmpty = () => {
    //清空后获取焦点
    this.searchValue.focus();
    this.setState({ searchValue:undefined,
      listShow:false});
  }

  handleSubmit=()=>{

    this.setState({

      listShow:true,
      basicIsSearch:true
    })
  }
  handleSearch=()=>{
    //TODO 待完善
    const { searchValue } = this.state;
    this.setState({
      listShow:true
    })
  }
  onCheck = (checkedKeys, info) => {
    //选择复选框后
  this.props.getTreeData(checkedKeys,info)
    this.setState({ checkedKeys });

  }
  render(){
    const {isSelect,checkedKeys}=this.state
    const listPorps={
      searchValue:this.state.searchValue,
      onChange:(value)=>{
          //value :{name,code,...}
          const {code,name}= value
           isSelect.push(code)
          this.setState({
            isSelect
          })
          this.props.onListSelect(value)
      },
      isSearch:this.state.basicIsSearch,
      SearchOver:()=>{
        this.setState({
          basicIsSearch:false
        })
      }
    }
    const { searchValue } = this.state;
    //后缀图标
    const suffix = searchValue ?<div><Icon type="close-circle" onClick={this.emitEmpty} /> <Icon type="search" onClick={this.handleSearch} /></div>
                  : <Icon type="search" /> ;

    return(
          <div  >
            <Row  >
              <Col span={24} style={{    padding: '4px'}}>
                <Input  placeholder="搜索指标"
                        suffix={suffix}
                         onChange={(e)=>{

                           this.setState({searchValue:e.target.value})
                           if(e.target.value)
                           {
                             this.setState({listShow:false})
                           }

                         }}
                         value={this.state.searchValue}
                         ref={node => this.searchValue = node}
                        onPressEnter={()=>{searchValue?this.handleSubmit():null}}
                >
                </Input>
              </Col>

            </Row>
            <Row  style={{paddingTop:'5px'}}>
              {this.state.listShow?<InfiniteListExample {...listPorps}/>
                : <Tree
                         loadData={this.onLoadData}
                         checkable
                         checkStrictly
                         onCheck={this.onCheck}
                         checkedKeys={this.state.checkedKeys}
                >
                  {this.renderTreeNodes(this.state.treeData)}
                </Tree>}
            </Row>
          </div>
    )
  }
}
IndexCard.propTypes = {

}
export default Form.create()(IndexCard)


