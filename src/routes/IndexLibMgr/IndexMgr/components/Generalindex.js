import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message,Card,Tree,TreeSelect} from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import { connect } from 'dva'
/**
 * @Title:指标库管理》指标管理》创建指标》基础指标
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2019/4/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const TreeNode = Tree.TreeNode


class Generalindex extends Component {

  state = {
    item :{},
    list:[],
    expandedKeys:[],
    selectedKeys: [],

    autoExpandParent: true,

  };
  componentDidMount=()=>{
    const {indexType,type}=this.props

    if (!type){//如果是修改
      const {modelId}=this.props.item.properties[0]
     //console.log(modelId,"modelId")
      this.setState({
        selectedKeys:[modelId],
      })
      this.props.tosave(modelId)
    }


    let modelType=""
    if(indexType==="basic")
      modelType="CO"
    else if(indexType==="ledger")
      modelType="GL"
    //普通	：CO 总账	：GL 多维	：DIM
    this.promise = request({//模型目录含模型
      url:"/gateway/tablemodeltreemodel.json",
      method: 'post',
      data: {
        modelType
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const modeltree = result.RSP_BODY.modeltree
      const list=[{
        id: '-1',
        modelName: "模型目录",
        children:modeltree
      }]
      this.setState({
        list,
      expandedKeys:["-1"],
      },()=>{
        if(!type){
          const {modelId}=this.props.item.properties[0]
          const loop = data => data.forEach((item) => {
            if(item.id===modelId)
            {this.setState({
              expandedKeys:[item.parentId]
            })
              return ;//不在查找子节点，foreach 不能跳出循环
            }
            if (item.children) {
              return (
                loop(item.children)
              );
            }
          })
          loop(list)

        }
      })
    })

  }

  onExpand = (expandedKeys) => {

    this.setState({
     expandedKeys,
      autoExpandParent: false,
    });
  }
  render () {
    const {  list} = this.state;

    const {
      tosave,
    }  =this.props ;
    const onSelect = (selectedKeys, info) => {
     //console.log(info.node.props.title,"info")
     //console.log(selectedKeys,"selectedKeys")

      const modelId=selectedKeys[0]
      const modelText=info.node.props.title
      this.setState({ selectedKeys});

      tosave(modelId)
    }



    //遍历树形
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.modelName}  selectable={item.eLeaf?true:false}  value={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.modelName}  selectable={item.eLeaf?true:false}   value={item.id} />;

    })



    return (

        <Row>
          <Col span={8}>
            <Row style={{
              /*  marginTop: '10px' */
            }} />
            <div style={{overflow: 'auto', width:'100%', height: '450px'}}>
              <Card title="模型选择" bordered={true}  >
                {list && list.length ?   <Tree
                  showLine
                  onExpand={this.onExpand}
                 expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}
                  onSelect={onSelect}
                  selectedKeys={this.state.selectedKeys}



                >
                  {loop(list)}
                </Tree>:"无数据"}
              </Card>
            </div>
          </Col>

        </Row>


    )

  }
}
Generalindex.propTypes = {
  form: PropTypes.object.isRequired,

  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default connect(({ loading,dispatch  }) => ({  loading,dispatch }))(Form.create()(Generalindex))
