import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { List, message, Avatar, Spin,Form }  from 'antd'
import { routerRedux } from 'dva/router'
import style from './InfiniteListExample.less'
import reqwest from 'reqwest';
import InfiniteScroll from 'react-infinite-scroller';
import {request} from 'utils';
/*const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';*/
const fakeDataUrl = '/api/v1/queryIndexList';


import PropTypes from 'prop-types'

/**
 * @Title:报表管理》展现组件
 * @Description:滚动列表
 * @Author: mxt
 * @Time: 2018/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */


class InfiniteListExample extends React.Component {
  state = {
    data: [],
    loading: false,
    hasMore: true,
  }
  /*getData1 = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }*/
  getData = (name) => {

    const url = 'gateway/deriveprodtable.json';
    this.promise = request({
      url,
      method: 'post',
      data: {
        name,
      },
    }).then((result) => {
      if(result.RSP_HEAD.TRAN_SUCCESS!=="1")
        return
      this.setState({
        data: result.RSP_BODY.prodList,
      });
    })
  }
  componentWillMount() {
    const name=this.props.searchValue

    this.setState({
      name
    })
    this.getData(name)
    this.props.SearchOver()
   /* this.getData1((res) => {
      this.setState({
        data: res.results,
      });
    });*/
  }

  componentWillReceiveProps(props) {
    //继续查询
    //监听父组件事件，是否点击搜索按钮
    const isSearch=props.isSearch
    if (isSearch){
      const name=this.props.searchValue

      this.setState({
        name
      })
      this.getData(name)
      this.props.SearchOver()

    }

  }


  handleInfiniteOnLoad = () => {
    let data = this.state.data;
    this.setState({
      loading: true,
    });
    if (data.length > 5) {
      message.warning('已全部加载');
      this.setState({
        hasMore: false,
        loading: false,
      });
      return;
    }
 /*   this.getData1((res) => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
    });*/
  }
  render() {
    return (
      <div className={style['demo-infinite-container']}>
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={this.handleInfiniteOnLoad}
          hasMore={!this.state.loading && this.state.hasMore}
          useWindow={false}
        >
          <List
            dataSource={this.state.data}
            renderItem={item => (
              <List.Item key={item.id}>
                <List.Item.Meta
                 /* avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}*/
                  title={item.name}
              /*    description={item.email}*/
                />
                <div><a href="javascript:null" onClick={()=>this.props.onChange(item)}>选择</a></div>
              </List.Item>
            )}
          >
            {this.state.loading && this.state.hasMore && <Spin className={style['demo-loading']} />}
          </List>
        </InfiniteScroll>
      </div>
    );
  }
}

InfiniteListExample.propTypes = {

}
export default Form.create()(InfiniteListExample)


