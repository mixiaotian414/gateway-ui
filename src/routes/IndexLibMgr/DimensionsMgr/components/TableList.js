import React, {Component} from 'react';
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col,Form,Button,Table,message,Modal,Card,Icon,Tree,Select,Upload,Input } from 'antd'
import {request} from 'utils'
import PropTypes from 'prop-types'
/**
 * @Title:指标库管理=》维度管理列表
 * @Description:子组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/4/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option
const confirm = Modal.confirm;
class TableList extends Component {
  state = {
    ids:[]
  }
  componentDidMount = ()=>{
    this.props.dispatch({
      type: this.props.LedgerType+'/query',
    })
  }

  render() {
    const { LedgerType,pagination,deleteIndex } = this.props;
    const {getFieldDecorator, getFieldsValue} = this.props.form;

    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        dataView(record)
      } else if (e.key === '2') {
        this.props.onEditItem(record)
        this.props.dispatch({
          type:LedgerType+'/dimensiontable',
          payload: {
            modelDatasource:record.dimensionDatasource
          },
        })
        this.props.dispatch({
          type:LedgerType+'/dimensionvalue',
          payload: {
            modelDatasource:record.dimensionDatasource,
            txt:record.dimensionTable,
            isTable:"table"
          },
        })
      }
    }

    //列表表头
    const columns = [{
      title: '维度编码',
      dataIndex: "dimensionCode",
      key: "dimensionCode",
      align: 'left',
    }, {
      title: '维度名称',
      dataIndex: "dimensionName",
      key: "dimensionName",
      align: 'left',
    }, {
      title: '数据源',
      dataIndex: "connectionName",
      key: "connectionName",
      align: 'left',
    }, {
      title: '维度表',
      dataIndex: "dimensionTable",
      key: "dimensionTable",
      align: 'left',
    }, {
      title: '维度值字段',
      dataIndex: "dimensionValue",
      key: "dimensionValue",
      align: 'left',
    },{
      title: '维度值显示字段',
      dataIndex: "dimensionKey",
      key: "dimensionKey",
      align: 'left',
    },{
      title: '操作',
      dataIndex: 'val2',
      key: "val2",
      render: (text, record) =>{
        return <DropOption onMenuClick={e => handleMenuClick(record, e)} menuOptions={[{ key: '1', name: '查看数据' },
            { key: '2', name: '修改' } ]} />
      }
    },];
    //分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    //列表切换分页时所用取数据方法
    const handleTableChange = (pagination, filtersArg, sorter) => {
      const params = {
        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
      };
      this.props.onTableChange(params)

    }
    const dataView =(record)=>{
      this.props.onDataVisible(true)
      this.props.onDataView(record)
    }
    const del =()=>{
      const { ids } = this.state
      if(ids){
        if(ids.length>0){
          confirm({
            title: '确定删除吗?',
            okText: "确定",
            cancelText: "取消",
            onOk () {
              deleteIndex(ids)
            },
          })
          this.setState({
            ids:[]
          })
        }else {
          message.warning('请选择一条记录')
        }
      }else {
        message.warning('请选择一条记录')
      }
    }
    const rowSelection = {
      onChange: (record,e) => {
        this.setState({
          ids:JSON.parse('['+record+']')
        })
      },
    }

    return (
      <div>
        <Row style={{marginTop: '10px' }}>
          <Col lg={24} md={24}>
            <Form layout="inline">
              <FormItem >
                <Button type="primary" onClick={()=>this.props.onAdd()}>
                  <Icon type="plus" /> 新建
                </Button>
              </FormItem>
              <FormItem >
                <Button  onClick={()=>del()}><Icon type="delete" />批量删除</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              //size="small"
              rowSelection={rowSelection}
              rowKey={record => record.id}
              style = {{ paddingTop:'10px' }}
              columns={columns}
              dataSource={this.props.list}
              loading={this.props.loading.effects[LedgerType + '/query']}
              pagination={paginationProps}
              onChange={handleTableChange}
            />

          </Col>
        </Row>
      </div>
    )
  }
}

TableList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(TableList)


