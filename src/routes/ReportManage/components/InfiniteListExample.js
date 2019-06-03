import React,{Component} from 'react'
import {connect} from 'dva'
import { Link } from 'react-router-dom'
import { List, message, Spin,Form }  from 'antd'
import { routerRedux } from 'dva/router'
import style from './InfiniteListExample.less'
import reqwest from 'reqwest';
import {request} from 'utils';
import InfiniteScroll from 'react-infinite-scroller';
/*const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';*/
/*const fakeDataUrl = '/api/v1/queryIndexList';*/

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
    name:undefined,
  }
  getData = (name,type) => {
    const CustomUrl = 'gateway/deriveprodlist.json';
    const BasicUrl = 'gateway/derivebasiclist.json';

    let url = type==="basic"?BasicUrl:CustomUrl

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

////滚动加载 以后在加
  getData1 = (callback) => {
    const CustomUrl = 'gateway/deriveprodlist.json';
    const BasicUrl = 'gateway/derivebasiclist.json';
   let name =this.state.name
    this.promise = request({
      url:'gateway/derivebasiclist.json',
      method: 'post',
      data: {
        name,
      },
    }).then((result) => {
     callback(result)
    })
  }


  componentWillMount() {
    //第一次查询
    const name=this.props.searchValue
    //type : "basic" or "custom"
    const type=this.props.type

    this.setState({
      name,type
    })
     this.getData(name,type)
    this.props.SearchOver()
  }

  componentWillReceiveProps(props) {
    //继续查询
    //监听父组件事件，是否点击搜索按钮
    const isSearch=props.isSearch
    if (isSearch){
      const name=props.searchValue
      //type : "basic" or "custom"
      const type=this.props.type
      this.setState({
        name,type
      })
      this.getData(name)
      this.props.SearchOver()
    }

  }
  handleInfiniteOnLoad = () => {
    let data = this.state.data||"";
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
//滚动加载 以后在加
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


