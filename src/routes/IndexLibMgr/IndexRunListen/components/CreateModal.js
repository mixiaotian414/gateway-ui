import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Modal,Button,message,Input,Tree, Select,DatePicker } from 'antd'
import { request } from 'utils'

/**
 * @Title:添加指标跑数任务
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/23
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const confirm = Modal.confirm;
const TreeNode = Tree.TreeNode
const Option = Select.Option
let  Format = 'YYYYMMDD';

class CreateModal extends Component{
  state={
    checkedKeys:[],
    treeData:[],
    Date:[],
    propertiesId:[],

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
            parentId:parentid,
            productTypes:["derive","group"]
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
    this.setState({
      checkedKeys
    })
    if(info.checkedNodes.length>0){
      let ids=[]
      info.checkedNodes.map((item)=>{
        /*判断叶子结点是否为目录 treeType ==='1' 为目录，treeType ==='2' 为指标，
        * productType ==="true" 并且treeType ==='2'为总账指标，否则为目录
        * */
        if((item.props.dataRef.productType ==="false"&&item.props.dataRef.treeType !=='2')){
          ids.push(item.props.dataRef.propertiesId)
        }
        if((item.props.dataRef.productType ==="false"||item.props.dataRef.productType ===null)&&item.props.dataRef.treeType !=='1'){
          ids.push(item.props.dataRef.propertiesId)
        }
      })
      this.setState({
        propertiesId:ids
      })
    }
  }




  render(){
    const { getFieldDecorator, validateFields,validateFieldsAndScroll } = this.props.form
    const {  LedgerType,item } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 17
      },
    };

    const ModalProps = {
      visible: this.props.visible,
      maskClosable: false,
      title:this.props.title,
      wrapClassName:"vertical-center-modal",
      width:'600px',
      footer:
        [
          <Button key="1" onClick={e=>handleCancel()}>取消</Button>,
          <Button key="2" type="primary" onClick={e=>handleOk()} >运行</Button>
        ],
      onCancel:()=>{handleCancel()}
    }

    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode  key={item.id+item.treeType+item.propertiesId} title={item.productName} treeType={item.treeType} dataRef={item} disableCheckbox ={(item.treeType ==='1'||item.productType ==='true')? true:false}  >
          {loop(item.children)}
        </TreeNode>
      }
      return <TreeNode  key={item.id+item.treeType+item.propertiesId} title={item.productName} treeType={item.treeType} dataRef={item} disableCheckbox ={(item.treeType ==='1'||item.productType ==='true')? true:false} isLeaf={item.treeType ==='1'? false:true} />
    })

    const handleOk = () => {
      validateFields((errors,values) => {
        if (errors) {
          return
        }
        const params = {
          ids:this.state.propertiesId,
          etlDate:this.state.Date,
        }
        this.props.onOk(params)
      })

    }

    const handleCancel = ()=>{
      this.props.onCancel()
      this.props.form.resetFields()
    }
    const onChange=(date, dateString)=> {
      this.setState({
        Date:dateString
      })
    }

    return(<div>
      <Modal
        {...ModalProps}
      >
        <Form>
          <Row>
            <div style={{overflow: 'auto', width:'100%', height: '300px',marginTop:'10px'}}>
              <Tree
                checkable
                showLine
                autoExpandParent
                defaultExpandedKeys={['-1']}
                loadData={this.onLoadData}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                checkStrictly
              ><TreeNode key="-1" title="指标目录" treeType="1" productType="" disableCheckbox>
                {loop(this.state.treeData)}
              </TreeNode>
              </Tree>
            </div>
            <FormItem {...formItemLayout} label="选择日期:">
              {getFieldDecorator('etlDate',{
                rules: [
                  {
                    required: true,
                    message: '日期不能为空',
                  },
                ],
              })(
                <DatePicker
                  format={Format}
                  onChange={onChange}
                />
              )}
            </FormItem>
          </Row>
        </Form>

      </Modal>
    </div>)
  }
}

export default Form.create()(CreateModal)
