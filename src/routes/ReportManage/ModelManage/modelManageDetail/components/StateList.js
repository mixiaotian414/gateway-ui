import React, {Component} from 'react'
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col, Form, Button, DatePicker, Table, message, Radio} from 'antd'
import {routerRedux} from 'dva/router'
import PropTypes from 'prop-types'


/**
 * @Title:报表管理》模型管理》模型查询》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/3/23
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

const bank = ["江苏泗阳商业银行", "人力资源部", "审计稽核部", "人力资源A部", "审计稽核部子部", "人力资源B部"]
const cur = ["折本外币", "人民币", "折人民币", "折美元"]

class List extends Component {
  state = {
    tableList: [],
    pagination: {
      total: 0,
      pageSize: 10,
      current: 1,
    },
    status: false,
    sortedInfo: null,
    modalVisible: false,
    tableType: "1",
    currentItem: {}
  }

  componentWillMount() {

  }

  componentWillReceiveProps = (props) => {

    let IndexColumn = [];
    let Strings = (props.code).split(",");
    for (let i = 0; i < Strings.length - 1; i++) {
      let Strings1 = (Strings[i]).split(".");
      IndexColumn[i] = {
        title: Strings1[1],
        dataIndex: Strings1[0],
        key: Strings1[0],
        align: 'right',
        render: (text, record) => {
          return Number(text).toFixed(2)
        },
      }
    }
    this.setState({
      IndexColumn
    })
    const pagination = this.props.pagination;
    const list = this.props.list;
    this.setState({
      tableList: list,
      pagination,
    })
  }

  render() {

    const {refresh, LedgerType, formValues} = this.props;

    /*const handleMenuClick = (record, e) => {
      if (e.key === '1') {
        this.setState({
          modalVisible: true,
          currentItem: record,
        })
      } else if (e.key === '2') {
        this.props.tohistoryAna(record)
      } else if (e.key === '3') {
        this.props.dispatch(routerRedux.push({
          pathname: "modelManageDetail/" + record.key,
        }))

      }
    }*/
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
    const handleTableTypeChange = (e) => {
      const tableType = e.target.value
      this.setState({tableType: tableType})

      const params = {
        ...this.props.formValues,
        tableType
      };
      const filter = {
        tableType: tableType
      }
      this.props.onTableChange(filter, params)
    }
    let canChooseType = false
    if (formValues.branches !== undefined) {
      canChooseType = true
    }
    let IndexColumn = this.state.IndexColumn || []
    let basiccolumns1 = [{
      title: '期次',
      dataIndex: "dateId",
      key: "dateId",
      align: 'left',
    }, {
      title: '机构名称',
      dataIndex: "orgName",
      key: "orgName",
      align: 'left',
    }
    ];
    let basiccolumns2 = [{
      title: '机构名称',
      dataIndex: "orgName",
      key: "orgName",
      align: 'left',
    }
    ];
    let basiccolumns3 = [{
      title: '期次',
      dataIndex: "dateId",
      key: "dateId",
      align: 'left',
    }
    ];
    let columns = [];
    if (this.state.tableType === "1") {
      columns = basiccolumns1.concat(IndexColumn)
    } else if (this.state.tableType === "2") {
      columns = basiccolumns2.concat(IndexColumn)
    } else {
      columns = basiccolumns3.concat(IndexColumn)
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...this.state.pagination,
    };

    return (
      <div>
        <Row type="flex" justify="start">
          <Col span={3}>
            <Button style={{width: '100%'}} type="" onClick={() => {
              message.success("导出成功")
            }} icon="export">导出Excel</Button>
          </Col>
          <Col span={21}>
            <Row type="flex" justify="end">
              <Col span={14}>
                <Row type="flex" justify="end">
                  <Col>
                    <Radio.Group value={this.state.tableType} onChange={handleTableTypeChange}
                                 disabled={!canChooseType}>
                      <Radio.Button value="1">不汇总</Radio.Button>
                      <Radio.Button value="2">按机构</Radio.Button>
                      <Radio.Button value="3">按日期</Radio.Button>
                    </Radio.Group>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          {/*<Col span={3}   >
            <Button  type="" onClick={refresh} icon="retweet" >刷新</Button>
          </Col>*/}
        </Row>
        <Row>
          <Col span={24}>
            <Table
              rowKey={record => record.code}
              style={{paddingLeft: '0px', paddingTop: '10px'}}
              bordered
              columns={columns}
              dataSource={this.state.tableList}
              pagination={paginationProps}
              onChange={handleTableChange}
              loading={this.props.loading.effects[LedgerType + '/query']}
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


