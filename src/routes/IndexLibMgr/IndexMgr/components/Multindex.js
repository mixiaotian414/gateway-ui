import { Table, Input, Icon, Button, Popconfirm ,message,Select,TimePicker,DatePicker,Modal,Checkbox,Row,Col} from 'antd';
import React,{ Component } from 'react'
import classnames from 'classnames'
import styles from './EditableTable.less'
import moment from 'moment';
const { Option } = Select;
import { DropOption } from 'components'
import lodash from 'lodash'
import MeasureModel from './MeasureModel'
const {
  confirm,
} = Modal
class Multindex extends Component {
  constructor(props) {
    super(props);
    this.state={
      type:true,//true创建，false修改
      selectedRows:[],
      selectedRowKeys:undefined,
      modalVisible:false,
      dataSource:[],
      modelId:"",
      productMeasure:"",
      modelText:"",
      productMeasureText:"",
    }


    this.columns = [{
      title: '数据模型',
      dataIndex:"modelText",
      key:"modelText"

    },{
      title: '度量字段英文',
      dataIndex:"productMeasure",
      key:"productMeasure",

    },{
      title: '度量字段中文',
      dataIndex:"productMeasureText",
      key:"productMeasureText",
    },
      ];

  }
  handleMenuClick = (record, e) => {
    if (e.key === '1') {
      confirm({
        title: '确定删除吗?',
        okText: "是",
        cancelText: "否",
        onOk() {
          /* deleteIndex(record)*/
        },
      })


    }
  }

  componentDidMount() {

    const {type,modalType}=this.props
    if (!type){//如果是修改
      const {modelId,modelText,productMeasure,productMeasureText}=this.props.item.properties[0]

      this.setState({
        dataSource:[{
          productMeasure,
          modelText,
          productMeasureText,
        }],
        selectedKeys:[modelId],
        modelId,
        productMeasure,
        modelText,
        productMeasureText,
        type,
      })
      this.props.tosave(modelId,productMeasure)
    }
  }





  render() {

    const {dataSource,modalVisible} =this.state
    const { modelId,
      productMeasure,
      modelText,
      productMeasureText,
      selectedKeys,type} =this.state

    const modalProps = {
      type,
      modelId,//模型
      productMeasure,//度量
      modelText,
      productMeasureText,
      selectedKeys,
      visible: modalVisible,
      maskClosable: false,
      title: '添加度量' ,
      wrapClassName: 'vertical-center-modal',
      width:"1050px",

      onOk:(modelId,productMeasure,modelText,
            productMeasureText)=> {


        this.setState({
          modelId,
          productMeasure,
          modelText,
          productMeasureText,
          dataSource:[{
            productMeasure,
            modelText,
            productMeasureText,
          }],
          modalVisible:false
        })

        this.props.tosave(modelId,productMeasure)
      },
      onCancel :()=> {
       this.setState({
         modalVisible:false
       })
      },
    }

    const columns = this.columns;
    return (

      <div>
        <Row type="flex" justify="start">
          <Col span={24}   >
            <Row type="flex" justify="left"  >
              <Col span={2}  >
                <Button type="primary" disabled={this.props.modalType==="detail"?true:false} onClick={()=>{
                  this.setState({
                    modalVisible:true
                  })
                }} icon="" >选择度量</Button>
              </Col>
          {/*    <Col span={2}  >
                <Button   onClick={()=>{
                  this.setState({
                    modalVisible:true
                  })
                }} icon="edit" >修改</Button>
              </Col>*/}

            </Row>
          </Col>
        </Row>
        <Row >
          <Col span={24}>
            <Table
              rowkey={record => record.model_id}
              bordered
              pagination={false}
              dataSource={dataSource}
              columns={columns}
              /*rowSelection={rowSelection}*/
              style={{marginTop:'10px'}}
            />

          </Col>
        </Row>
        { modalVisible&& <MeasureModel {...modalProps} />}
      </div>
    );
  }
}


export  default  Multindex
