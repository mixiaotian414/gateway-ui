import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/indexTypeManage'
import {message} from 'antd'
const {query,querySelectTree,deriveprodmkdir} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》指标类型维护
 * @Description:model
 * @Author: mxt
 * @Time: 2018/4/16
 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="indexTypeManage"
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
          dispatch({
            type: 'query',
          })
        }
      })
    },
  },

  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.deriveProdList,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.RSP_BODY.total,
              },
            },
          })
        }
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
    * toAdd({payload}, {call, put}) {

      //treeDate
      const data = yield call(deriveprodmkdir, payload)

      if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
        yield put({
          type: 'query',
        })
      }else{
       /* message.error("获取treeDate类型失败："+querySelectTreeData)*/
      }

    },

  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    }
  }

})
