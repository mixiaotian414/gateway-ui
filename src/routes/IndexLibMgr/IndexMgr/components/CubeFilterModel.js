import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message,Card,Tree,TreeSelect} from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import { connect } from 'dva'
/**
 * @Title:指标库管理》指标管理》创建组合指标》维度值过滤
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

const FormItem = Form.Item;
class MeasureModel extends Component {

  state = {
    item :{},
    list:[],
    modelList:[],//数据字段列表
    dataSource:[],
    expandedKeys:[],
    selectedKeys: [],
    selectedRowKeys: [],
    modelId:"",
    modelText:"",
    autoExpandParent: true,
    queryData:[],
    dimensionValue:[],
    dimensionText:[],
  };
  componentDidMount=()=>{

    this.promise = request({
      url:"/gateway/secdictselect.json",
      method: 'post',
      data: {
        appId:"1",
        dictCode:"LOGIC"
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const queryData = result.RSP_BODY.dictList
      this.setState({
        queryData,
      })
    })

    const {  item={},type} = this.props;
    let id=item.dimensionId


      const {dimensionValue,dimensionFilterType,dimensionText}=item
   //console.log(dimensionValue,"dimensionValue")
    if(dimensionValue&&dimensionValue.length>0){
     //console.log(dimensionValue.toString().replace(/\s+/g,"").split(","),"dimensionValue")
      this.setState({
      /*  selectedKeys:dimensionValue.toString().replace(/\s+/g,"").split(","),
        dimensionValue:dimensionValue.toString().replace(/\s+/g,"").split(",")*/
        selectedKeys:dimensionValue.toString().replace(/\s+/g,"").split(","),
        dimensionValue:dimensionValue.toString().replace(/\s+/g,"").split(","),

      })

    }
    if(dimensionText&&dimensionText.length>0){

      this.setState({
        dimensionText:dimensionText.toString().replace(/\s+/g,"").split(",")
      })

    }
    this.promise = request({//维度值
      url:"/gateway/dimensionview.json",
      method: 'post',
      data: {
        id,
        filterKey:"",
        filterValue:"",
        page:"",
        pageSize:"",
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const modeltree = result.RSP_BODY.dataList
      const list=[{
        dimensionValue: '-1',

        dimensionKey: "维度值选项",
        children:modeltree
      }]
      this.setState({
        list,
        expandedKeys:["-1"],
      })
    })


  }

  onExpand = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  render () {

    const { getFieldDecorator } = this.props.form;


    const { list,dimensionText} = this.state;

    const onSelect = (selectedKeys, info) => {
     /* console.log(selectedKeys,"selectedKeys")*/
     /* console.log(info.node.props,"info.node.props.title")*/
      let  dimensionTextF=[]
      if(dimensionText.indexOf(info.node.props.title)> -1){
        dimensionTextF= dimensionText.filter(_=>_!==info.node.props.title)
        this.setState({
          dimensionText:dimensionTextF,
        });

      }else{
        dimensionText.push(info.node.props.title)
        this.setState({
          dimensionText
        });
      }
      const dimensionValue=selectedKeys

      this.setState({
        selectedKeys,
      dimensionValue,

      });

   /*   tosave(modelId)*/
    }
    const {
      item = {},
      onOk,
      modalType,
      onCancel,
      form:{
        validateFields
      },
      ...modalProps
    }  =this.props ;

    const handleOk = () => {
      const {dimensionValue,dimensionText} = this.state;
      validateFields((errors, values) => {
        if (errors) {
            return
        }
        if(dimensionValue.length<1){
          message.info("请选择维度值")
          return
        }
        values.dimensionValue=dimensionValue
        values.dimensionText=dimensionText

       //dimensionValue
       //dimensionFilterType
       //console.log(values,"obj")
         onOk(values)
      })
    }

      const modalOpts = {
        ...modalProps,
        onCancel,
        footer:
          [
            <Button type="primary" onClick={e => onCancel()}>取消</Button>,
         this.props.modalType!=="detail"?<Button type="primary" onClick={e => handleOk()}>确定</Button>:null,

          ],
      }


    //遍历树形

    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode key={item.dimensionValue} title={item.dimensionKey}  selectable={false}  value={item.dimensionValue}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.dimensionValue} title={item.dimensionKey}    value={item.dimensionValue} />;

    })

    const formItemLayout = {
      labelCol: {
        span: 6,
      },
      wrapperCol: {
        span: 18,
      },
    }
    return (
        <Modal {...modalOpts}>
          <Row>
            <Col span={24}>
              <FormItem label="逻辑操作" hasFeedback {...formItemLayout}>
                {getFieldDecorator('dimensionFilterType', {
                initialValue: this.props.item.dimensionFilterType ,
                  rules: [
                    {
                      required: true,
                      message: '请选择',
                    },
                  ],
                })(<Select placeholder="请选择" style={{width:'70%'}}>
                  {this.state.queryData && this.state.queryData.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                </Select>)}
              </FormItem>

            </Col>

          </Row>

          <Row>
            <Col span={24}>

              <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                <Card title="维度选择" bordered={true}  >

                  <Tree
                    multiple
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
