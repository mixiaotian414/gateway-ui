import React,{Component} from 'react'
import { Page } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Tree,Input } from 'antd'
import styles from './Business.less'
/**
 * @Title:业务模型导入表模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item

class TableAddModal extends Component{
  state = {
    selectedRowKeys:[],
    selectlist:[],
  }

  render(){

    const { LedgerType,changeTableAddModal,tableAddVisible } = this.props
    const tableProps = {
      visible: tableAddVisible,
      maskClosable: false,
      title: '选择物理表',
      wrapClassName: 'vertical-center-modal',
      width:"500px",
      onCancel:()=>{
        changeTableAddModal(false)
      },
      onOk: ()=>{onOkTable()}
    }

    const columns = [
      {
        title:"名称",
        dataIndex:"tableName",
        key:"tableName"
      }
    ]

    const onOkTable = ()=>{
      this.props.dispatch({
        type:LedgerType+'/modeltableadd',
        payload:{
          modelCode:this.state.selectlist[0].modelCode,
          tableCode:this.state.selectlist[0].tableCode,
        }
      })
    }

    const {selectedRowKeys} = this.state
    const rowSelection = {
      type:"radio",
      onChange: (record,e) => {
        this.setState({
          selectlist:e,
        })
      },
    };

    return(
      <div>
        <Modal
          {...tableProps}
        >
          <Row>
              <Table
                rowSelection={rowSelection}
                className={styles.tablecheck}
                size="small"
                rowKey={record => record.tableCode}
                columns={columns}
                dataSource={this.props.tableList}
                //scroll={{ y: 500}}
                rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                pagination={false}
              />
          </Row>

        </Modal>
      </div>
    )
  }
}
export default Form.create()(TableAddModal)
