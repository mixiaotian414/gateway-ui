import React, {Component} from 'react'
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col, Form, Button, Table, message} from 'antd'
import {routerRedux} from 'dva/router'
import PropTypes from 'prop-types'
import TagGroup from './TagGroup'
import queryString from 'query-string'

/**
 * @Title:报表管理》模型管理》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/3/15
 * @updateTime: 2018/5/10
 * @updateRemark: 表格展开，表格删除指标
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

class List extends Component {
  state = {
    tableList: [],
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1,
    },
    selectedRowKeys: [],
    sortedInfo: null,
  }
  componentWillReceiveProps = (props) => {
    const pagination = this.props.pagination;
    const list = this.props.list;
    this.setState({
      tableList: list,
      pagination,
    })
  }

  render() {
    const {LedgerType, dispatch} = this.props;

    const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        this.setState({
          currentItem: record,
        })
      } else if (e.key === '2') {
        this.props.onEditItem(record)
      } else if (e.key === '3') {
        let string = "";
        if (record.products !== undefined) {
          for (let i = 0; i < record.products.length; i++) {
            string = string + record.products[i].productCode + "." + record.products[i].productName + ",";
          }
          string = string + record.code;
        } else {
          string = "";
        }
        this.props.dispatch(routerRedux.push({
          pathname: "modelManageDetail/" + string,
          /*  search: queryString.stringify({
              ...record
            }),*/
        }))

      }
    }

    const handleTableChange = (pagination, filtersArg, sorter) => {
      this.setState({
        sortedInfo: sorter,
      });
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = {...obj};
        newObj[key] = getValue(filtersArg[key]);
        return newObj;
      }, {});
      const params = {
        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
      };
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }
      this.props.onTableChange(filters, params)
    }

    const columns = [{
      title: '模型编码',
      /* sorter: true,*/
      dataIndex: "code",
      key: "code",
      align: "left",
    }, {
      title: '模型名称',
      dataIndex: "name",
      key: "name",
      align: "left",
    }, {
      title: '模型类型',
      dataIndex: "typeText",
      key: "typeText",
      align: "left",

    }, /*{
      title: '指标项',
      dataIndex:"indexes",
      key:"indexes",
    },*/{
      title: '备注',
      dataIndex: "remark",
      key: "remark",
      align: "left",
    }, {
      title: '修改时间',
      dataIndex: "lastUpdateTime",
      key: "lastUpdateTime",
      align: "left",
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: "operate",
      render: (text, record) => {
        return <DropOption onMenuClick={e => handleMenuClick(record, e)}
                           menuOptions={[/*{ key: '1', name: '删除' }, */{key: '2', name: '修改'}, {
                             key: '3',
                             name: '查询'
                           }]}/>
      },
    }];
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };
    const handleDeleteItems = () => {
      dispatch({
        type: LedgerType + '/multiDelete',
        payload: {
          codes: selectedRowKeys,
        },
        callback: (res) => {

          if (res.success) {
            this.setState({
              selectedRowKeys: []
            })
          } else {

          }
          message.info(res.message)
        }
      })
    }
    const {selectedRowKeys} = this.state;

    const hasSelected = selectedRowKeys.length > 0;

    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        this.setState({selectedRowKeys});
      },
    }
    return (
      <div>
        <Row type="flex" justify="start">
          <Col span={10}>
            <span style={{fontSize: '17px', lineHeight: '32px', paddingLeft: '10px'}}>指标模型</span>
          </Col>
          <Col span={14}>
            <Row type="flex" justify="end">
              <Col span={4}>
                <Button onClick={() => {
                  this.props.onAdd()
                }} icon="plus">创建模型</Button>
              </Col>
              <Col span={4}>
                <Button onClick={handleDeleteItems}
                        icon="delete"
                        disabled={!hasSelected}
                        loading={this.props.loading.effects[LedgerType + '/query']}>批量删除</Button>
              </Col>

              {/*<Col span={4}  >
              <Button  type="" onClick={()=>{message.success("")}} icon="plus" >模型查询</Button>
            </Col>

              <Button  style={{width:'100%'}}type="" onClick={()=>{message.success("导出成功")}} icon="edit" >修改模型</Button>
            </Col>*/}
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowKey={record => record.code}
              style={{paddingLeft: '0px', paddingTop: '10px'}}
              bordered
              expandedRowRender={record => {
                const tagporps = {
                  tags: record.products,

                  EditItem: (index) => {
                    let payload = {
                      code: record.code,
                      productId: index
                    }

                    this.props.dispatch({
                      type: LedgerType + '/deleteIndex',
                      payload,
                      callback: (res) => {
                        if (res.success) {
                          const products = record.products.filter(item => item.productCode !== index)
                          record.products = products
                        }
                        message.info(res.message)
                      }
                    })
                  }
                }
                return <TagGroup {...tagporps} />
              }
              }
              columns={columns}
              dataSource={this.state.tableList}
              pagination={paginationProps}
              onChange={handleTableChange}
              rowSelection={rowSelection}
              loading={this.props.loading.effects[LedgerType + '/query'] || this.props.loading.effects[LedgerType + '/deleteIndex']}
            >
            </Table>
          </Col>
        </Row>

      </div>
    )
  }
}

List.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(List)


