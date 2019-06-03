import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { color } from 'utils'
import { getTimeDistance,request } from 'utils'
import { DropOption } from 'components'
import { Row, Col,Form,Card,Button,Input,Tree} from 'antd'
import { routerRedux } from 'dva/router'
const {Search}=Input
const TreeNode = Tree.TreeNode;
import InfiniteListExample from './InfiniteListExample'

import PropTypes from 'prop-types'

/**
 * @Title:报表管理》展现组件
 * @Description:指标树组件
 * @Author: mxt
 * @Time: 2018/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const tabListNoTitle = [{
  key: 'basic',
  tab: '基础指标',
}, {
  key: 'custom',
  tab: '自定义指标',
},  ];

class IndexCard extends Component{
  state={
    noTitleKey:'basic',
    basicData: [],
    customData: [],
    basicsearchValue:undefined,
    searchValue:undefined,
    basiclistShow:false,
    listShow:false,
    //调用查询发布订阅给‘列表’子组件
    basicIsSearch:false,
    customIsSearch:false,
  }
  componentWillReceiveProps = (props) => {
  }
  componentDidMount () {
    this.fetch("B1","/gateway/derivesynbasictree.json","B")
    this.fetch("P1","/gateway/derivesynproducttree.json","P")
  }
  fetch = (code,url,type) => {
    this.promise = request({
      url,
      method: 'post',
      data: {
        code:code
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.proList

      let Data =queryData.map((data)=>{
        let obj={
          title:data.name,
          key:data.code,
          value:data.code,
          isLeaf:data.isLeaf==="1"?true:false
        }
        return obj
      })
      if(type==="B")
      this.setState({basicData:[...Data]})
      else {
        this.setState({customData:[...Data]})
      }

    })
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let code=treeNode.props.eventKey
      this.promise = request({
        url:"/gateway/derivesynbasictree.json",
        method: 'post',
        data: {
          code
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.proList
        let basicData =queryData.map((data)=>{
          let obj={
            title:data.name,
            key:data.code,
            value:data.code,
            isLeaf:data.isLeaf==="1"?true:false
          }
          return obj
        })
        treeNode.props.dataRef.children = basicData;
        this.setState({
          basicData: [...this.state.basicData],
        });
        resolve();
      })
    });
  }

  onLoadCustomData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      let code=treeNode.props.eventKey
      this.promise = request({
        url:"/gateway/derivesynproducttree.json",
        method: 'post',
        data: {
          code
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.proList
        let Data =queryData.map((data)=>{
          let obj={
            title:data.name,
            key:data.code,
            value:data.code,
            isLeaf:data.isLeaf==="1"?true:false
          }
          return obj
        })
        treeNode.props.dataRef.children = Data;
        this.setState({
          customData: [...this.state.customData],
        });
        resolve();
      })
    });
  }


  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }
/*  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      setTimeout(() => {
        treeNode.props.dataRef.children = [
          { title: '承兑汇票', key: `${treeNode.props.eventKey}-0` },
          { title: '融资性保函', key: `${treeNode.props.eventKey}-1` },
        ];
        this.setState({
          basicData: [...this.state.basicData],
        });
        resolve();
      }, 100);
    });
  }*/
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item} selectable={item.isLeaf?true:false} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} selectable={item.isLeaf?true:false}/>;
    });
  }
  basiccHandleSubmit=(values)=>{
    this.setState({
      basicsearchValue:values,
      basiclistShow:true,
      basicIsSearch:true
    })
  }
  handleSubmit=(values)=>{
    this.setState({
      searchValue:values,
      listShow:true,
     customIsSearch:true,
    })
  }
  render(){

    const { onSelect,onListSelect} = this.props;
    const basiclistPorps={
      searchValue:this.state.basicsearchValue,
      onChange:(value)=>{
        onListSelect(value)
      },
      type:"basic",
      isSearch:this.state.basicIsSearch,
      SearchOver:()=>{
        this.setState({
          basicIsSearch:false
        })
      }
    }
  const listPorps={
      searchValue:this.state.searchValue,
      onChange:(value)=>{
        onListSelect(value)
      },
    type:"custom",
    isSearch:this.state.customIsSearch,
    SearchOver:()=>{
      this.setState({
        customIsSearch:false
      })
    }
    }

    const contentListNoTitle = {
      basic:  <div style={{height:'350px',overflowY:"scroll"}}>
        <Row  >
          <Col span={20}>
            <Search  placeholder="搜索基础指标"
                     onSearch={values=>this.basiccHandleSubmit(values)}
                     enterButton
                     onChange={(e)=>{this.setState({basicsearchValue:e.target.value})}}
                     value={this.state.basicsearchValue} ></Search>
          </Col>
          <Col offset={1} span={2}>
            <Button  onClick={()=>{this.setState({  basicsearchValue:undefined, basiclistShow:false})}}  icon="reload" />
          </Col>
        </Row>
        <Row  style={{paddingTop:'5px'}}>
          {this.state.basiclistShow?<InfiniteListExample {...basiclistPorps}/>
            : <Tree  onSelect={onSelect} loadData={this.onLoadData} >
              {this.renderTreeNodes(this.state.basicData)}
            </Tree>}
        </Row>
      </div>,
      custom: <div style={{height:'350px',overflowY:"scroll"}}>
        <Row  >
          <Col span={20}>
            <Search  placeholder="搜索派生指标"
                     onSearch={values=>this.handleSubmit(values)}
                     enterButton
                     onChange={(e)=>{this.setState({searchValue:e.target.value})}}
                     value={this.state.searchValue} ></Search>
          </Col>
          <Col offset={1} span={2}>
            <Button  onClick={()=>{this.setState({  searchValue:undefined, listShow:false})}}  icon="reload" />
          </Col>
        </Row>
        <Row  style={{paddingTop:'5px'}}>
          {this.state.listShow?<InfiniteListExample {...listPorps}/>
            : <Tree  onSelect={onSelect} loadData={this.onLoadCustomData} >
              {this.renderTreeNodes(this.state.customData)}
            </Tree>}
        </Row>
      </div>
    };

    return(
      <div>
        <Card
          style={{ width: '100%' }}
          bodyStyle={{height:'400px'}}
          tabList={tabListNoTitle}
          activetabkey={this.state.noTitleKey}
          onTabChange={(key) => { this.onTabChange(key, 'noTitleKey'); }}
        >
          {contentListNoTitle[this.state.noTitleKey]}
        </Card>
      </div>
    )
  }
}
IndexCard.propTypes = {

}
export default Form.create()(IndexCard)


