import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Table,Modal,Button } from 'antd'
import styles from './Connectionlist.less'

/**
 * @Title:显示表结构模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
class DisplayModal extends Component{

  state = {

  }
  render(){
    const {  LedgerType,changeTableModal,modalTableVisible,tablestructure } = this.props;
    const columns = [
      {
        title: '字段名称',
        dataIndex: 'Field',
        key: 'Field',
      }, {
        title: '类型',
        dataIndex: 'Type',
        key: 'Type',
      },
      {
        title: '是否可以为空',
        dataIndex: 'Null',
        key: 'Null',
      },
      {
        title: '主键',
        dataIndex: 'Key',
        key: 'Key',
      },{
        title: '默认值',
        dataIndex: 'Default',
        key: 'Default',
      },{
        title: '额外',
        dataIndex: 'Extra',
        key: 'Extra',
      },
    ]
    const columnsOracle = [
      {
        title: '字段名称',
        dataIndex: 'Field',
        key: 'Field',
      }, {
        title: '类型',
        dataIndex: 'Type',
        key: 'Type',
      },
      {
        title: '是否可以为空',
        dataIndex: 'NULLABLE',
        key: 'NULLABLE',
      },
      {
        title: '字段长度',
        dataIndex: 'DATA_LENGTH',
        key: 'DATA_LENGTH',
      },{
        title: '主键',
        dataIndex: 'Key',
        key: 'Key',
      },
    ]
    /*显示表结构*/
    const displayModalProps = {
      visible: modalTableVisible,
      maskClosable: false,
      title: '表结构',
      wrapClassName: 'vertical-center-modal',
      width:"800px",
      footer:
        [<Button style={{float:'center'}} type="primary" onClick={e=>changeTableModal(false)}>关闭</Button>],
      onCancel:()=>{
        changeTableModal(false)
      },
    }
    return(
      <div>
        <Modal
          {...displayModalProps}
        >
          <Form>
            <Row>
              <Col span={24}>
                <Table
                  size="small"
                  columns={this.props.dbType ==='02'?columnsOracle:columns}
                  rowKey={record => record.Field}
                  //scroll={{ x: 1500}}
                  dataSource={tablestructure}
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
export default Form.create()(DisplayModal)
