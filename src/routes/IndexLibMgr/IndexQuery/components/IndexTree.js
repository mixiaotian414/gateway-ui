import React,{Component} from 'react'
import { Page } from 'components'
import { Row, Col,Form,Button,Modal,Tree,Icon } from 'antd'
import { request } from 'utils'
import styles from '.././index.less'
/**
 * @Title:指标查询=》指标目录树组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const confirm = Modal.confirm;

class IndexTree extends Component{
  state = {
    data : [],
    ids : [],
    indexIds:[],
    checkedKeys:[],
    treeData:[],
  }

  componentDidMount = () => {
      this.firstfetch()
  }

  firstfetch = () => {
    this.promise = request({
      url:"/gateway/indexqueryindextree.json",
      method: 'post',
      /*data: {
        parentIds:[],
      },*/
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.indextree

      let treeData =queryData.map((data)=>{
        let obj={
          productName:data.productName,
          id:data.id,
          parentId:data.parentId,
          productType:data.productType,
          propertiesId:data.propertiesId,
          idForDimension:data.idForDimension,
          treeType:data.treeType,
          children:data.children
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
      let parentid = treeNode.props.dataRef.id
      let producttype = treeNode.props.dataRef.productType
      //JSON.parse('['+parentid+']'),
      if(producttype !=='true'){
        this.promise = request({
          url:"/gateway/indexqueryindextree.json",
          method: 'post',
          data: {
            parentId:parentid
          },
        }).then((result) => {
          if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
            return
          }
          const queryData = result.RSP_BODY.indextree

          let treeData =queryData.map((data)=>{

              let obj={
                productName:data.productName,
                id:data.id,
                parentId:data.parentId,
                productType:data.productType,
                idForDimension:data.idForDimension,
                propertiesId:data.propertiesId,
                children:data.children,
                treeType:data.treeType,
              }
              return obj


          })
          treeNode.props.dataRef.children = treeData;
          /*if((parentid === undefined ||parentid === null) && producttype ==='false'){
            treeNode.props.dataRef.children = [];
          }else {
            treeNode.props.dataRef.children = treeData;
          }*/
          this.setState({
            treeData: [...this.state.treeData],
          });
          resolve();
        })
      }

    });
  }

  onCheck = (checkedKeys, info) => {
    /*如果checkedKeys.length === 0 说明没有勾选，这时清空dimensionValue（过滤后的维度值）*/
    if(checkedKeys.checked.length === 0){
      this.props.dispatch({
        type:this.props.LedgerType+'/querySuccess',
        payload: {
          dimensionValue:[],
          titleList:[],
          dataList:[],
        },
      })
    }
    this.props.onCheckedKeys(checkedKeys)
    //维度查询
    //this.props.onDimensionData(checkedKeys.checked)
    if(info.checkedNodes.length>0){
      let ids=[]
      let Data = []
      info.checkedNodes.map((item)=>{
        /*判断叶子结点是否为目录 treeType ==='1' 为目录，treeType ==='2' 为指标，
        * productType ==="true" 并且treeType ==='2'为总账指标，否则为目录
        * */
        if((item.props.dataRef.productType ==="false"&&item.props.dataRef.treeType !=='2')){
          ids.push(item.props.dataRef.idForDimension)
          Data.push({
            title:item.props.dataRef.productName,
            key:item.props.dataRef.productName,
            id:item.props.dataRef.id,
            propertiesId:item.props.dataRef.propertiesId,
          })
        }
        if((item.props.dataRef.productType ==="false"||item.props.dataRef.productType ===null)&&item.props.dataRef.treeType !=='1'){
          ids.push(item.props.dataRef.idForDimension)
          Data.push({
            title:item.props.dataRef.productName,
            key:item.props.dataRef.productName,
            id:item.props.dataRef.id,
            propertiesId:item.props.dataRef.propertiesId,
          })
        }
      })
      if(checkedKeys.checked.length>0){
        this.props.onDimensionData(ids)
        this.props.dispatch({
          type:this.props.LedgerType+'/querySuccess',
          payload: {
            selectdata:[],
            selectdataid:[],
          },
        })
      }else {
        this.props.onDimensionData(this.state.ids)
      }
      this.props.onAddFilters(Data)
    }else{
      this.props.onAddFilters(this.state.data)
      this.props.onDimensionData(this.state.ids)
    }

  }

  render(){
    const { LedgerType } = this.props
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode  key={item.id+item.treeType+item.propertiesId} title={item.productName} treeType={item.treeType} dataRef={item} disableCheckbox ={(item.treeType ==='1'||item.productType ==='true')? true:false}  >
          {loop(item.children)}
        </TreeNode>
      }
      return <TreeNode  key={item.id+item.treeType+item.propertiesId} title={item.productName} treeType={item.treeType} dataRef={item} disableCheckbox ={(item.treeType ==='1'||item.productType ==='true')? true:false} isLeaf={item.treeType ==='1'? false:true} />
    })

    return(
      <div>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <section className={styles.treecss}>
              <div style={{overflow: 'auto', width:'100%', height: '465px',marginTop:'20px'}}>
                <Tree
                  checkable
                  showLine
                  //showIcon
                  autoExpandParent
                  defaultExpandedKeys={['-1']}
                  loadData={this.onLoadData}
                  onCheck={this.onCheck}
                  checkedKeys={this.props.checkedKeys}
                  checkStrictly
                ><TreeNode key="-1" title="指标目录" treeType="1" icon={<Icon type="meh-o" />} disableCheckbox productType="" dataRef="">
                  {loop(this.state.treeData)}
                </TreeNode>
                </Tree>
              </div>
            </section>
          </Col>
        </Row>
      </div>)
  }

}
export default Form.create()(IndexTree)
