import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message,Card,Tree,TreeSelect} from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import { connect } from 'dva'
/**
 * @Title:指标库管理》指标管理》添加多维指标》增加度量
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


class MeasureModel extends Component {

  state = {
    item :{},
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
  };
  componentDidMount=()=>{


    const {modelId,productMeasure,type,modelText,
      productMeasureText,} =this.props
     //console.log(type,"多维type")
    if (!type){//如果是修改

      this.setState({
        modelId,productMeasure,modelText,
        productMeasureText,
        selectedKeys:[modelId],
        selectedRowKeys:[productMeasure],
        modelText,
        productMeasureText
      })

      this.promise = request({//根据模型目录ID查询度量列表
        url:"/gateway/indexmealist.json",
        method: 'post',
        data: {
          modelId,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const dataSource = result.RSP_BODY.meaList

        this.setState({
          dataSource,
        })
      })


    }

    //普通	：CO 总账	：GL 多维	：DIM
      this.promise = request({//模型目录含模型
        url:"/gateway/tablemodeltreemodel.json",
        method: 'post',
        data: {
          modelType:"DIM",
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
        },()=>{//查找父级节点
          if(!type){

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
  selectRow = (record) => {
    const selectedRowKeys = [...this.state.selectedRowKeys];
    let arr=[]
    if (selectedRowKeys.indexOf(record.value) >= 0) {
      /*selectedRowKeys.splice(selectedRowKeys.indexOf(record.value), 1);*/
    } else {
      arr.push(record.value)
    }
    this.setState({ selectedRowKeys:arr ,
      productMeasure:record.value,
      productMeasureText:record.text});

  }
  render () {

    const {  dataSource,list,modelId,productMeasure,  modelText,
      productMeasureText,selectedRowKeys} = this.state;


    const onSelect = (selectedKeys, info) => {
     //console.log(info.node.props.title,"info")
     //console.log(selectedKeys,"selectedKeys")

      this.setState({
        selectedRowKeys:[],
        productMeasure:"",
        productMeasureText:""
      })

      const modelId=selectedKeys[0]
      const modelText=info.node.props.title
      this.promise = request({//根据模型目录ID查询度量列表
        url:"/gateway/indexmealist.json",
        method: 'post',
        data: {
          modelId:info.node.props.eventKey,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const dataSource = result.RSP_BODY.meaList

        this.setState({
          dataSource,
        })
      })

      this.setState({ selectedKeys,modelId:selectedKeys[0],modelText

      });
    }
    const columns=[{
      title: '字段中文',
      dataIndex:"text",
      key:"text",

    },{
      title: '字段英文',
      dataIndex:"value",
      key:"value",
    }]


    const {
      item = {},
      onOk,
      modalType,
      onCancel,
      ...modalProps
    }  =this.props ;


    const onFinish=()=>{

      if(!modelId||!productMeasure)
      {
        message.error("请选择指标目录和度量！")
      }else{
      onOk(modelId,productMeasure,modelText,
        productMeasureText)
      }
    }


      const modalOpts = {
        ...modalProps,
        onCancel,
        footer:
          [
            <Button type="primary" onClick={e => onCancel()}>取消</Button>,
         <Button type="primary" onClick={e => onFinish()}>确定</Button>

          ],
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

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys,

        })
       //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        if(selectedRowKeys.length>0)
      this.setState({
          productMeasure:selectedRowKeys[0],
          productMeasureText:selectedRows[0].text
        })
      },
      getCheckboxProps: record => ({
      /*  disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,*/
      }),
      type:'radio'
    };

    return (
        <Modal {...modalOpts}>
          <Row>
            <Col span={8}>
              <Row style={{
                /*  marginTop: '10px' */
              }} />
              <div style={{overflow: 'auto', width:'100%', height: '450px'}}>
                <Card title="模型选择" bordered={true}  >
                  {list && list.length ? <Tree

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
            <Col span={16}>
              <Card title="度量选择" bordered={false}  >
               {/* <Row>
                  <Col>
                  <Button type="primary" onClick={e=>{}}>重置</Button>
                  </Col>
                </Row>*/}
                <Row>
                  <Col>
                    <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                  <Table
                    rowKey={record => record.value}
                    style={{paddingLeft:'0px', paddingTop: '10px'}}
                    rowSelection={rowSelection}
                    columns= {columns}
                    dataSource={dataSource}
                    pagination={false}
                    onRow={(record) => ({
                      onClick: () => {
                        this.selectRow(record);
                      },
                    })}
                    // onChange={handleTableChange}

                  >
                  </Table>
                    </div>
                  </Col>
                </Row>
              </Card>

            </Col>
          </Row>

        </Modal>
      )

  }
}
MeasureModel.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default connect(({ loading,dispatch  }) => ({  loading,dispatch }))(Form.create()(MeasureModel))
