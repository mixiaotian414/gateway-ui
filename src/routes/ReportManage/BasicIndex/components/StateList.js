import React, {Component} from 'react'
import {connect} from 'dva'
import {Link} from 'react-router-dom'
import {color, request} from 'utils'
import {getTimeDistance} from 'utils'
import {DropOption} from 'components'
import {Row, Col, Form, Button, Table, message, Modal, Tree, Tabs, Divider, Card} from 'antd'
import {routerRedux} from 'dva/router'
import PropTypes from 'prop-types'

const FormItem = Form.Item
const {TabPane} = Tabs
/**
 * @Title:报表管理》基础指标体系》展现组件
 * @Description:List组件
 * @Author: mxt
 * @Time: 2018/5/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');
const TreeNode = Tree.TreeNode;

class List extends Component {
  state = {
    status: false,
    sortedInfo: null,
    isDiv: false,
    currentItem: {},
    basicData: [],
  }

  componentDidMount() {
    this.fetch("B1", "/gateway/derivesynbasictree.json")
  }

  fetch = (code, url) => {
    this.promise = request({
      url,
      method: 'post',
      data: {
        code: code
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS !== '1') {
        return
      }
      const queryData = result.RSP_BODY.proList

      let Data = queryData.map((data) => {
        let obj = {
          title: data.name,
          key: data.code,
          value: data.code,
        }
        return obj
      })
      this.setState({basicData: [...Data]})
    })
  }

  render() {
    const {refresh, LedgerType, loading, dispatch} = this.props;
    const {currentItem} = this.state

    /*const handleTableChange = (pagination, filtersArg, sorter) => {
      this.setState({
        sortedInfo: sorter,
      });
      console.log('sorter', sorter)
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
      console.log('formValues', this.props.formValues)
      console.log('filters', filters)
      console.log('params', params)
      this.props.onTableChange(filters, params)

    }*/
    /*const columns = [{
      title: '基础指标',
      dataIndex: "name",
      key: "name",
      render: (text, record) => (record.children ? <span>{text}</span> : <a href="javascript:;"
                                                                            onClick={() => {

                                                                              dispatch({
                                                                                type: LedgerType + '/queryDetail',
                                                                                payload: {code: record.code},
                                                                                callback: (res) => {
                                                                                  console.log(res)
                                                                                  this.setState({
                                                                                    modalVisible: true,
                                                                                    currentItem: res
                                                                                  })
                                                                                }
                                                                              })
                                                                            }

                                                                            }>{text}</a> ),

    }, {
      title: '指标编码',
      dataIndex: "code",
      key: "code",
      width: "20%",
    }, {
      title: '所属类别',
      dataIndex: "typeText",
      key: "typeText",
      width: "15%",
    }, {
      title: '归属条线',
      dataIndex: "businessCodeText",
      key: "businessCodeText",
      width: "15%",
    }, {
      title: '指标状态',
      dataIndex: 'statusText',
      key: "statusText",
      width: "15%",
    }
    ];*/
    /*const indexDetailProps = {
      visible: this.state.modalVisible,
      maskClosable: false,
      title: '指标值调整',
      wrapClassName: 'vertical-double-center-modal',
      width: "400px",
      footer: <Button style={{float: 'center'}} type="primary" onClick={() => {
        this.setState({modalVisible: false})
      }}>完成</Button>,
      onCancel: () => {
        this.setState({modalVisible: false})
      },
    }*/
    const loop = (data) => {
      return data.map((item) => {
        if (item.children) {
          return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
              {loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...item} dataRef={item} selectable={item.isLeaf ? true : false}/>;
      });
    }
    const onLoadData = (treeNode) => {
      return new Promise((resolve) => {
        if (treeNode.props.children) {
          resolve();
          return;
        }
        let code = treeNode.props.eventKey
        this.promise = request({
          url: "/gateway/derivesynbasictree.json",
          method: 'post',
          data: {
            code
          },
        }).then((result) => {
          if (result.RSP_HEAD.TRAN_SUCCESS !== '1') {
            return
          }
          const queryData = result.RSP_BODY.proList
          let basicData = queryData.map((data) => {
            let obj = {
              title: data.name,
              key: data.code,
              value: data.code,
              isLeaf: data.isLeaf === "1" ? true : false
            }
            return obj
          })
          treeNode.props.dataRef.children = basicData;
          this.setState({
            basicData: [...this.state.basicData],
          });
          resolve();
        })
      });
    }
    const onSelect = (selectedKeys) => {
      dispatch({
        type: LedgerType + '/queryDetail',
        payload: {code: selectedKeys[0]},
        callback: (res) => {
          this.setState({
            isDiv: true,
            currentItem: res
          })
        }
      })
    }
    return (
      <div>
        <Row type="flex" justify="start">
          <Col span={10}>
            <span style={{fontSize: '17px', businessCodeTextHeight: '32px', paddingLeft: '10px'}}>基础指标体系</span>
          </Col>
          <Col span={14}>
            <Row type="flex" justify="end">
              {/*   <Col span={4}  >
              <Button   onClick={()=>{this.setState({modalVisible:false})}} icon="plus" >刷新</Button>
            </Col>*/}

            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={8}>
            <Row style={{marginTop: '20px'}}/>
            <div style={{overflow: 'auto', width: '100%', height: '400px'}}>
              <Tree
                loadData={onLoadData}
                showLine
                defaultExpandedKeys={['1']}
                onSelect={onSelect}
              >
                {loop(this.state.basicData)}
              </Tree>
            </div>
          </Col>
          <Col span={15} offset={1}>
            <Row style={{marginTop: '20px'}}/>
            {this.state.isDiv && <div>
              <Tabs type="card">
                <TabPane tab="详细信息" key="1">
                  <Card>
                    <Row>
                      <Col span={4}>指标编码：</Col><Col span={6}>{currentItem.code}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>指标名称：</Col><Col span={6}>{currentItem.name}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>所属类别：</Col><Col span={6}>{currentItem.typeText}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>归属条线：</Col><Col span={6}>{currentItem.businessCodeText}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>汇总标志：</Col><Col span={6}>{currentItem.canSumText}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>取数周期：</Col><Col span={6}>{currentItem.frequencyText}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>指标状态：</Col><Col span={6}>{currentItem.typeText}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                    <Row>
                      <Col span={4}>创建时间：</Col><Col span={6}>{currentItem.createTime}</Col>
                    </Row>
                    <Divider style={{margin: '10px 0'}}/>
                  </Card>
                </TabPane>
              </Tabs>
            </div>}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            {/*<Table
              rowKey={record => record.code}
              style={{paddingLeft: '0px', paddingTop: '10px'}}
              columns={columns}
              dataSource={this.props.list}
              pagination={false}
              onChange={handleTableChange}

              loading={this.props.loading.effects[LedgerType + '/query']}
            >
            </Table>*/}
          </Col>
        </Row>
        {/*{this.state.modalVisible &&
        <Modal {...indexDetailProps} >

          <FormItem label="指标编码"  {...formItemLayout}>
            <span>{currentItem.code}</span>
          </FormItem>
          <FormItem label="指标名称"  {...formItemLayout} >
            <span>{currentItem.name}</span>
          </FormItem>

          <FormItem label="所属类别"  {...formItemLayout}>
            <span>{currentItem.typeText}</span>
          </FormItem>

          <FormItem label="归属条线"  {...formItemLayout}>
            <span>{currentItem.businessCodeText}</span>
          </FormItem>

          <FormItem label="汇总标志"  {...formItemLayout}>
            <span>{currentItem.canSumText}</span>
          </FormItem>

          <FormItem label="取数周期"  {...formItemLayout}>
            <span>{currentItem.frequencyText}</span>
          </FormItem>

          <FormItem label="指标状态"  {...formItemLayout}>
            <span>{currentItem.typeText}</span>
          </FormItem>

          <FormItem label="创建时间"  {...formItemLayout}>
            <span>{currentItem.createTime}</span>
          </FormItem>

            <FormItem label="指标逻辑"  {...formItemLayout}>
            <span>{currentItem.code}</span>
          </FormItem>

        </Modal>}*/}
      </div>
    )
  }
}

List.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(List)


