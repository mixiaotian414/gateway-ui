import React, {Component} from 'react';
import {DropOption} from 'components'
import {Row, Col,Form,Button,Table } from 'antd'
import {request} from 'utils'
import PropTypes from 'prop-types'
import styles from '../index.less'
import queryString from 'query-string'
/**
 * @Title:指标库管理=》指标查询列表
 * @Description:子组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/4/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

/*const mockData = [];
for (let i = 0; i < 10; i++) {
  mockData.push({
    org: `测试数据${i + 100}`,
    date: `测试数据${i + 1}`,
    curr: `测试数据${i + 1}`,
    test: `测试数据${i + 1}`,
    index1: `测试数据${i + 1}`,
    index: `测试数据${i + 1}`,
  });
}*/


class TableList extends Component {
  state = {
      columns:[]
  }
  componentWillReceiveProps =()=>{
    //let datakey = ["curr","org","date","index","test"]
    //let datatitle = ["币种","机构","日期","总账指标"]
    let data = []
    if(this.props.titleList){
      if(this.props.titleList.length>0){
        this.props.titleList.map((item)=>{
          data.push({
            key:item.titleValue,
            title:item.titleName,
            dataIndex:item.titleValue,
            align:(item.titleValue).substring(0,4) ==='data'?"right":"left",
            //backgroundColor:"blue",
          })
        })
        this.setState({
          columns:data
        })
      }else {
        this.setState({
          columns:[]
        })
      }
    }
    //测试用的数据
     /*if(this.props.columnsName&&datakey){
      if(this.props.columnsName.length>0&&datakey.length>0){
        for (let i = 0; i < datakey.length; i++) {
          let newdata = {};
          for (let j = 0; j < this.props.columnsName.length; j++) {
            if (i === j) {
              newdata.key = datakey[i];
              newdata.title = this.props.columnsName[j];
              newdata.dataIndex = datakey[j];
              newdata.align="left";
              newdata.backgroundColor="blue";
              //background-color: whitesmoke;
              data.push(newdata);
            }
          }
          this.setState({
            columns:data
          })
        }
      }else {
        this.setState({
          columns:[]
        })
      }
    }*/
  }

  render() {
    const { LedgerType,pagination,changefields } = this.props;
    //分页属性
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    //列表切换分页时所用取数据方法
    const handleTableChange = (pagination) => {
      const params = {
        ...this.props.formValues,
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...changefields
      };
      this.props.onTableChange(params)
    }

    return (
      <div>
          <Col span={24}>
            <Table
              size="small"
              bordered={true}
              style={{ whiteSpace:'nowrap' }}
              rowKey={(record, index) => `${index+1}`}
              //rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
              columns={this.state.columns}
              dataSource={this.props.dataList}
              loading={this.props.loading.effects['IndexQuery/query']}
              pagination={paginationProps}
              onChange={handleTableChange}
              scroll={{ overflow: 'auto',x:'100%'  }}
            />

          </Col>
      </div>
    )
  }
}

TableList.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
}
export default Form.create()(TableList)


