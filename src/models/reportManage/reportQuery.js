import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/reportQuery'
import {message} from 'antd'
const {query,querySelectTree} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》报表查询
 * @Description:model
 * @Author: mxt
 * @Time: 2018/5/17
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="reportQuery"
export default modelExtend({

  namespace: LedgerType,
  state:{
    list:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {

        if (location.pathname==="/"+LedgerType) {

          const payload = location.query || { page: 1, pageSize: 10 }
        /*  dispatch({
            type: 'initData',
            payload,
          })*/
        }
      })
    },
  },

  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {

      //列表data
      const data = yield call(query, payload)
      if (data.RESCODE==='1') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.LIST,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.total,
            },
          },
        })
      }else{
        message.error("获取列表数据失败："+data)
      }

    },

    * initData({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      //mock数据没用
      //treeDate
      const querySelectTreeData = yield call(querySelectTree, payload)

      if (querySelectTreeData.RESCODE==='1') {
        const SelectTree = arrayToSelectTree(querySelectTreeData.LIST, 'group_id', 'prt_group_id')
        yield put({
          type: 'querySuccess',
          payload: {
            querySelectTreeData: SelectTree,
          },
        })
      }else{
        message.error("获取treeDate类型失败："+querySelectTreeData)
      }

    },

  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    }
  }

})
