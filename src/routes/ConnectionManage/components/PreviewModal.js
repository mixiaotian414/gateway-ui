import React,{Component} from 'react'
import { Row, Col,Form,Table,Modal,Button } from 'antd'
import styles from './Connectionlist.less'

/**
 * @Title:预览前100模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

class PreviewModal extends Component {

  state = {
    newlist:[],
  }
  componentWillReceiveProps = () => {
    let newarray = []
    if(this.props.keylist.length>0){
      this.props.keylist.map((item)=>{
        if(item){
          newarray.push({
            title:item,
            dataIndex:item,
            key:item,
          })
        }
      })
    }
    this.setState({
      newlist:newarray
    })
  }

  render(){
    const { changeModal,modalVisible,linkpreviewlist } = this.props;
    /*预览前100行*/
    const previewModalProps = {
      visible: modalVisible,
      maskClosable: false,
      title: '预览数据',
      wrapClassName: 'vertical-center-modal',
      width:"700px",
      footer:
        [<Button style={{float:'center'}} type="primary" onClick={e=>changeModal(false)}>关闭</Button>],
      onCancel:()=>{
        changeModal(false)
      },
    }
    return(
      <div>
        <Modal
          {...previewModalProps}
        >
          <Form>
            <Row>
              <Col span={24}>
                <Table
                  size="small"
                  rowKey={record => record.a2}
                  columns={this.state.newlist}
                  dataSource={linkpreviewlist}
                  scroll={{ x: 1500}}
                  //rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                  pagination={false}
                />
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(PreviewModal)
