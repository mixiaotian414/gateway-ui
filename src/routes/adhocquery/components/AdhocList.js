import React, {Component} from 'react';
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col, Form, Button, Table, Modal } from 'antd'
import {request} from 'utils'
import PropTypes from 'prop-types'
/**
 * @Title:获取XMI文件里的model组件
 * @Description:子组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/3/20
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

class AdhocList extends Component {
  state = {
    modelData:[],
    expandedRowKeys:[],
  }

  render() {
    const { LedgerType } = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;

    const secColumns = [{
      title: '名称',
      dataIndex: "categoriesname",
      key: "categoriesname",
      width:'20%',
      align: 'left',
    },{
      title: '数据表名称',
      dataIndex: "id",
      key: "id",
      width:'30%',
      align: 'left',
    }, {
      title: '描述',
      dataIndex: "description",
      key: "description",
      width:'35%',
      //align: 'left',
    },];

    //列表表头
    const columns = [{
      title: '模型ID',
      dataIndex: "modelId",
      key: "modelId",
      align: 'left',
    }, {
      title: '模型名称',
      dataIndex: "modelName",
      key: "modelName",
      align: 'left',
    }, {
      title: '描述',
      dataIndex: "description",
      key: "description",
      align: 'left',
    }, {
      title: '创建时间',
      dataIndex: "lastUpdateTime",
      key: "lastUpdateTime",
      align: 'left',
    }, {
      title: '操作',
      dataIndex: 'val2',
      key: "val2",
      render: (text, record) => <a onClick={() => {
        let router = this.props.route + "/?" + record.domainId + "/" + record.modelId + "/" + record.modelName;
        let win = window.open(router, '_blank');
        win.focus();
      }}>查看</a>
    },];

    const expandedRowRender = (record) => {
      return (
        <Table
          //size="small"
          rowKey={record => record.categoriesname}
          columns={secColumns}
          dataSource={this.state.modelData}
          pagination={false}
        />
      );
    }
    const onExpand = (expanded, record) => {
      const {dispatch} = this.props;
      let domainid = record.domainId.split("%")[0]
      let modelid = record.modelId
      if (expanded === false) {
        // 因为如果不断的添加键值对，会造成数据过于庞大，浪费资源，
        // 因此在每次合并的时候讲相应键值下的数据清空
        this.setState({
          secData: [],
          modelData:[],
        });
      } else {
        this.promise = request({
          url:"/gateway/categoriesquery.json",
          method: 'post',
          data: {
            domainId: domainid,
            modelId: modelid
          },
        }).then((result) => {
          if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
            return
          }
          const queryData = result.RSP_BODY.categories
          let modelData =queryData.map((data)=>{
            let obj={
              categoriesname:data.name,
              description:data.description,
              id:(data.id).substring(3),
            }
            return obj
          })
          this.setState({modelData:[...modelData]})
        })

      }
    }
    //改变expandedRows（节点始终展开一个）
    const onExpandedRowsChange =(expandedRows)=>{
      let temp = []
      if(expandedRows.length>1){
        temp[0] = expandedRows[expandedRows.length-1]
      }else{
        temp[0] = expandedRows[0]
      }
      this.setState({
        expandedRowKeys: [],
      },()=>{
        this.setState({expandedRowKeys:temp})
      })
    }


    return (
      <div>
        <Row>
          <Col span={24}>
            <Table
              //size="small"
              //rowSelection={rowSelection}
              rowKey={record => record.modelName}
              style = {{ paddingTop:'10px' }}
              expandedRowRender={expandedRowRender}
              onExpand={onExpand}
              onExpandedRowsChange={onExpandedRowsChange}
              expandedRowKeys={this.state.expandedRowKeys}
              columns={columns}
              dataSource={this.props.list}
              loading={this.props.loading.effects[LedgerType + '/query']}
              pagination={false}
            />

          </Col>
        </Row>
      </div>
    )
  }
}

AdhocList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(AdhocList)


