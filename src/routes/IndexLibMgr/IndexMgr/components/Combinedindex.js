import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message,Card,Tree,TreeSelect,Tooltip} from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import { connect } from 'dva'
import CubeFilterModel from './CubeFilterModel'

/**
 * @Title:指标库管理》指标管理》创建指标》组合指标
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


class Combinedindex extends Component {

  state = {
    type:true,//创建true 修改false
    item :{},//过滤修改
    index :0,//过滤序号
    list:[],
    dataSource:[],
    expandedKeys:[],
    selectedKeys: [],
    selectedRowKeys: [],
    modelId:"",
    productMeasure:"",
    modelText:"",
    productMeasureText:"",
    autoExpandParent: true,
    modalVisible:false
  };
  componentDidMount=()=>{
    const {type,modalType}=this.props

    if (!type){//如果是修改
      const {modelId,productMeasure}=this.props.item.properties[0]
      const {dimList}=this.props.item

      this.setState({
        modelId,
        selectedKeys:[productMeasure],
        type,
        dataSource:dimList
      })
      this.props.toselect(modelId,productMeasure)
      this.props.tosave(dimList)


    }

    //普通	：CO 总账	：GL 多维	：DIM
    this.promise = request({//模型目录含模型
      url:"/gateway/indexindextree.json",
      method: 'post',
      data: {
        productType:"multi",
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const modeltree = result.RSP_BODY.producttree
      const list=[{
        id: '-1',
        productName: "多维指标选择",
        modelId: "1",
        children:modeltree
      }]
      this.setState({
        list,
        expandedKeys:["-1"],
      },()=>{
        if(!type){
          const {productMeasure}=this.props.item.properties[0]
          const loop = data => data.forEach((item) => {
            if(item.id===productMeasure)
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

    const {  dataSource,list, item ,index ,modalVisible,type} = this.state;



    const onSelect = (selectedKeys, info) => {
     //console.log(info.node.props.title,"info")
     //console.log(selectedKeys,"selectedKeys")

      this.setState({
        selectedRowKeys:[],
        productMeasure:"",
        productMeasureText:""
      })

      const productMeasure=selectedKeys[0]
      const modelText=info.node.props.title
      const modelId=info.node.props.modelId
      this.promise = request({//
        url:"/gateway/indexdimension.json",
        method: 'post',
        data: {
          id:info.node.props.eventKey,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const dataSource = result.RSP_BODY.dimList

        this.setState({
          dataSource,
        })
      })

      this.setState({
        selectedKeys,
        modelId:selectedKeys[0],

      });
      this.props.toselect(modelId,productMeasure)
    }

    const modalProps = {
      modalType:this.props.modalType,
      type,//创建true,
      visible: modalVisible,
      maskClosable: false,
      title: '维度值过滤' ,
      wrapClassName: 'vertical-center-modal',
      width:"450px",
      item,//查询维度值
      onOk :(value)=> {
        const {dimensionValue,dimensionFilterType,dimensionText}=value
        dataSource[index].dimensionValue=dimensionValue
        dataSource[index].dimensionText=dimensionText.join(",")
        dataSource[index].dimensionFilterType=dimensionFilterType
      /* dataSource[index].dimensionText=dimensionFilterType+"("+dimensionText+")" */
        this.setState({
          dataSource:[...dataSource],
          modalVisible:false
        })
         //console.log("value",value)
         //console.log("dataSource",dataSource)

          this.props.tosave(dataSource)

      },
      onCancel:()=> {
        this.setState({
          modalVisible:false
        })
      },
    }
    const columns=[{
      title: '序号',
      dataIndex:"index",
      key:"index",
      render:(text,record,index)=>`${index+1}`
    },{
      title: '维度名称',
      dataIndex:"dimensionName",
      key:"dimensionName",
    },{
      title: '维度编码',
      dataIndex:"dimensionKey",
      key:"dimensionKey",
    },{
      title: '过滤值',
      dataIndex:"dimensionText",
      key:"dimensionText",
      render: (text, record,index) => {
        let isLongTag =false
        if(text&&   text.length > 20){
          isLongTag=true

        }
        const tagElem = (
          <span>  {isLongTag ? `${text.slice(0, 20)}...` : text}   </span>
        );
        return isLongTag ? <Tooltip title={text} key={text}>{tagElem}</Tooltip> : tagElem;

      }
    },{
      title: '操作',
      render: (text, record,index) => {
        return (
          <span>
                <a  onClick={() => this.setState({
                  index,
                  item:record,
                  modalVisible:true
                })}>过滤</a>
              </span>
        )
      }
    }]


    //遍历树形

    const loop = data => data.map((item) => {
      let flag =false
      if (item.eLeaf&&this.props.modalType!=="detail"){
        flag=true
      }
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.productName} modelId={item.modelId} selectable={flag} disabled={this.props.modalType==="detail"?true:false} value={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.productName} modelId={item.modelId} selectable={flag}   value={item.id} />;

    })


    return (
<div>
        <Row>
          <Col span={8}>
            <Row style={{
              /*  marginTop: '10px' */
            }} />
            <div style={{overflow: 'auto', width:'100%', height: '450px'}}>
              <Card title="多维指标选择" bordered={true}  >
                <Tree
                  showLine
                  onExpand={this.onExpand}
                  expandedKeys={this.state.expandedKeys}
                  autoExpandParent={this.state.autoExpandParent}

                  onSelect={onSelect}
                  selectedKeys={this.state.selectedKeys}
                >
                  {loop(list)}
                </Tree>
              </Card>
            </div>
          </Col>
          <Col span={16}>
            <Card title="指标维度" bordered={false}  >
             {/* <Row>
                <Col span={4}>
                  <Button  onClick={e=>{}}>机构维度</Button>
                </Col>
                <Col span={4}>
                  <Button  onClick={e=>{}}>日期维度</Button>
                </Col>
              </Row>*/}
              <Row>
                <Col  >
                  <span>注：如果指标多个过滤条件目前只支持“且”关系存在</span>
                </Col>
              </Row>
              <Row>
                <Col>
                  <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                    <Table
                      style={{paddingLeft:'0px', paddingTop: '10px'}}
                      columns= {columns}
                      dataSource={dataSource}
                      pagination={false}

                    >
                    </Table>
                  </div>
                </Col>
              </Row>
            </Card>

          </Col>
        </Row>
    {modalVisible && <CubeFilterModel {...modalProps} />}
  </div>
    )

  }
}
Combinedindex.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default connect(({ loading,dispatch  }) => ({  loading,dispatch }))(Form.create()(Combinedindex))
