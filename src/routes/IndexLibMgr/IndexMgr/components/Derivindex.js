import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Button ,Tabs,Row ,Col,message,Card,Tree} from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import { connect } from 'dva'
const { TextArea } = Input;
/**
 * @Title:指标库管理》指标管理》创建指标》派生指标
 * @Description:
 * @Author: mxt
 * @Time: 2019/4/16
 * @updateTime: 2019/5/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const TreeNode = Tree.TreeNode
const FormItem = Form.Item

class Derivindex extends Component {

  state = {
    item :{},
    list:[],
    expandedKeysa:["1"],
    expandedKeysb:["0"],
    expandedKeysc:["0"],
    textAreaRef:"",
    modelList:[],//数据字段列表
    valueText: '',
    TransText:"",//实时翻译，暂不用
    resultTransText:"",//点击测试按钮返回的翻译
    errorFlag:false,//是否有抛出错误
    errorMessage:"",
    KeyList : [],//公式对外文本
    KeyValueList:[],//公式的对内编
  };
  componentDidMount=()=>{


    const {type}=this.props
    if (!type){//如果是修改
      const {productMeasure,productMeasureText=""}=this.props.item.properties[0]

      this.promise = request({
        url:"/gateway/indexvalidate.json",
        method: 'post',
        data: {
          formula:productMeasure
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }

        /* const queryData = result.RSP_BODY.dictList*/
        this.setState({
          valueText:productMeasure,
          resultTransText:result.RSP_BODY.text,
        })
      })


      this.props.onChange(productMeasure)
    }

    this.promise = request({//模型目录含模型
      url:"/gateway/indexproattrtree.json",
      method: 'post',
      data: {
            id:"d-1",
        productType:"",
        productCode:"",
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const modeltree = result.RSP_BODY.producttree

      this.setState({list:[...modeltree]})


    })


  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      let code=treeNode.props.eventKey
      let productType=treeNode.props.dataRef.productType
      let productCode=treeNode.props.dataRef.productCode

      this.promise = request({
        url:"/gateway/indexproattrtree.json",
        method: 'post',
        data: {
          id:code,
          productType,
          productCode
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.producttree||[]
        console.log(queryData,"queryData")

        treeNode.props.dataRef.children = queryData;
        this.setState({treeData: [...this.state.list],

        });
        resolve();
      })

    });
  }



  onSelecta = (selectedKeys, info) => {
    let valueText=this.state.valueText
   /* const  value=info.node.props.value*/
    const   isLeaf=info.node.props.isLeaf
    const   value=info.node.props.formula
    const   title=info.node.props.title

   //console.log(info.node.props,"title")
    if(selectedKeys.length>0)
    {
     /* let treenode={value,type:'index',title}
      this.handleValueInput(treenode)*/
      valueText+=info.node.props.formula
      this.setState({
        valueText
      })
      this.props.onChange(valueText)
    }

    this.setState({
      selectedKeysa: selectedKeys
    })

    this.TextArea.focus()

  }




  onSelectb = (selectedKeys, info) => {
    let valueText=this.state.valueText
    this.setState({
      selectedKeysb:selectedKeys
    })
    if(selectedKeys.length>0)
    {
      /* let treenode={value,type:'index',title}
       this.handleValueInput(treenode)*/
      valueText+=info.node.props.value
      this.setState({
        valueText
      })
      this.props.onChange(valueText)
    }

    this.TextArea.focus()
  }
   onSelectc= (selectedKeys, info) => {
     let valueText=this.state.valueText
     const  value=info.node.props.value
     const   title=info.node.props.title

    //console.log(info.node.props,"title")
     if(selectedKeys.length>0)
     {
       /*let treenode={value,type:'operator',title}
       this.handleValueInput(treenode)*/
       valueText+=info.node.props.value
       this.setState({
         valueText
       })
       this.props.onChange(valueText)
     }


     this.setState({
       selectedKeysc:selectedKeys
     })
     this.TextArea.focus()
  }
  onExpanda = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeysa:expandedKeys,
      autoExpandParenta: false,
    });
  }
  onExpandb = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeysb:expandedKeys,
      autoExpandParentb: false,
    });
  }
  onExpandc = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeysc:expandedKeys,
      autoExpandParentc: false,
    });
  }
  render () {
    const {  LedgerType,lista} = this.props;




    const {  modelList,list} = this.state;








    const functionTree  = [{
      title: '函数',
      key: '0',
      value: '0',
      children: [/*{
        title: 'max（）',
        key: 'max',
        value: 'max',
      }, {
        title: 'min（）',
        key: 'min',
        value: 'min',
      }, */{
        title: 'if（）',
        key: 'if',
        value: 'if',
      }],
    }];
    const operatorsTree  = [{
      title: '操作符',
      key: '0',
      value: '0',
      children: [{
        title: '+',
        key: '+',
        value: '+',
      }, {
        title: '-',
        key: '-',
        value: '-',
      }, {
        title: '*',
        key: '*',
        value: '*',
      }, {
        title: '/',
        key: '/',
        value: '/',
      }, {
        title: '.',
        key: '.',
        value: '.',
      }, {
        title: '（',
        key: '（',
        value: '（',
      }, {
        title: '）',
        key: '）',
        value: '）',
      }, /*{
        title: '+/-',
        key: '+/-',
        key: '+/-',
      }*/],
    }];
    const renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    })


    //遍历树形
    const loop = data => data.map((item) => {
      /*let flag =false
      if (item.eLeaf){
        flag=true
      }*/
      if (item.children) {
        return (
          <TreeNode productCode={item.productCode}  key={item.id} isLeaf={item.eLeaf}  title={item.productName} dataRef={item} productType={item.productType} modelId={item.modelId}   formula={item.formula} selectable={item.eLeaf?true:false}  value={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} productCode={item.productCode}  isLeaf={item.eLeaf} key={item.id} title={item.productName} dataRef={item} productType={item.productType} formula={item.formula} selectable={item.eLeaf?true:false}  modelId={item.modelId}   value={item.id} />;

    })


    const formItemLayout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24,
      },
    }

    const testResult=()=>{
      const formula=this.state.valueText

      this.promise = request({
        url:"/gateway/indexvalidate.json",
        method: 'post',
        data: {
          formula,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        message.success("测试成功")
       /* const queryData = result.RSP_BODY.dictList*/
        this.setState({
          resultTransText:result.RSP_BODY.text,
        })
      })
    }
    const handleChange=(e)=>{
     //console.log(e.target.value)
      this.setState({
        valueText:e.target.value
      })

      this.props.onChange(e.target.value)
    }
    return (
      <div>
        <Row style={{marginTop:"10px"}}>
          <Col span={4}>
            <Button type="primary"    disabled={this.props.modalType==="detail"?true:false} onClick={e=>testResult()}>测试公式</Button>
          </Col>
        </Row>

        <Row style={{marginTop:"10px"}}>
          <Col span={24}>
            <FormItem hasFeedback {...formItemLayout} >
         <TextArea autosize={{ minRows: 3, maxRows: 6 }}
                           placeholder="请输入"
                           style={{ width: '100%'}}
                      ref={c => this.TextArea=c}
                   disabled={this.props.modalType==="detail"?true:false}
                   /* onKeyDown={(e)=>{this.handleKeyDown(e)}}*/
            onChange={e=>{handleChange(e)}}
                            value ={this.state.valueText}
              />
            </FormItem>
          </Col>
        </Row>
          <Row style={{marginTop:"10px"}}>
            <Col span={24}>
              <TextArea  placeholder="汉字展示区"   autosize={{ minRows: 2, maxRows: 4 }} value={this.state.resultTransText}/>
              <div style={{ margin: '10px 0' }} /> </Col>
          </Row>

        {this.props.modalType!=="detail"?<Row gutter={16}>
              <Col span={12}>
          <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
            <Card  bordered={true}  >
              <Tree
                showLine
                onExpand={this.onExpanda}
                expandedKeys={this.state.expandedKeysa}
                autoExpandParent={this.state.autoExpandParenta}
                loadData={this.onLoadData}
                onSelect={this.onSelecta}
                selectedKeys={this.state.selectedKeysa}
              >
                {loop(list)}
              </Tree>
            </Card>
          </div>

        </Col>
              <Col span={6}>
                <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                  <Card  bordered={true}  >
                  <Tree
                    showLine
                    onExpand={this.onExpandb}
                    expandedKeys={this.state.expandedKeysb}
                    autoExpandParent={this.state.autoExpandParentb}

                    onSelect={this.onSelectb}
                    selectedKeys={this.state.selectedKeysb}
                  >
                    {renderTreeNodes(functionTree)}
                  </Tree>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                  <Card  bordered={true}  >
                  <Tree
                    showLine
                    onExpand={this.onExpandc}
                    expandedKeys={this.state.expandedKeysc}
                    autoExpandParent={this.state.autoExpandParentc}

                    onSelect={this.onSelectc}
                    selectedKeys={this.state.selectedKeysc}
                  >
                    {renderTreeNodes(operatorsTree)}
                  </Tree>
                  </Card>
                </div>
              </Col>
      </Row>:""}
      </div>

    )

  }
}
Derivindex.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default connect(({ loading,dispatch  }) => ({  loading,dispatch }))(Form.create()(Derivindex))
