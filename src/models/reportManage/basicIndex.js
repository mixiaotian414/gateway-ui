import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/basicIndex'
import {message} from 'antd'
const {query,queryDetail} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》基础指标体系
 * @Description:model
 * @Author: mxt
 * @Time: 2018/5/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="basicIndex"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    list1:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
  },
  subscriptions: {
    setup({dispatch, history}) {
      /*history.listen((location) => {
        if (location.pathname==="/"+LedgerType) {
          const payload = location.query || { page: 1, pageSize: 10, code: "B1"}
          dispatch({
            type: 'query',
            payload,
          })
        }
      })*/
    },
  },

  effects: {
    * query({payload={ page: 1, pageSize: 10, code: "B1"}}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==='1') {
        const queryData = data.RSP_BODY.proList
        let Data =queryData.map((data)=>{
          let obj={
            title:data.name,
            key:data.code,
            value:data.code,
            isLeaf:data.isLeaf==="1"?true:false
          }
          return obj
        })
        yield put({
          type: 'querySuccess',
          payload: {
            list: Data,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.RSP_BODY.total,
            },
          },
        })
      }else{
        message.error("获取列表数据失败："+data)
      }

    },
    * queryDetail({payload,callback}, {call, put}) {
      //列表data
      const data = yield call(queryDetail, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==='1') {
        callback(data.RSP_BODY)
      }
    },

  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    }
  }

})
