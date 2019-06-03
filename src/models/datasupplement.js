import modelExtend from 'dva-model-extend'
import * as Service from 'services/datasupplement'
import {message} from 'antd'
const {query, queryid,del,add,update,getSelectList} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:列表DEMO
 * @Description:model
 * @Author: dhn
 * @Time: 2018/6/26
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="datasupplement"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    selectedRowKeys: [],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    modalType:'create',
    currentItem:{},
    modalVisible:false,
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname==="/datasupplement") {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
          dispatch({
            type: 'getSelectList'
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
              list: data.RSP_BODY.RecordList,
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
    * delete ({ payload }, { select, call, put }) {
      const response = yield call(del, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.datasupplement))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('删除成功')
        }
      }
    },
    * add ({ payload }, { select, call, put }) {
      const response = yield call(add, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.datasupplement))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('添加成功')
        }
      }
    },
    * update ({ payload }, { select, call, put }) {
      const response = yield call(update, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.datasupplement))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('修改成功')
        }
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    updateState(state, {payload}) {
      return {...state, ...payload}
    },
  }
})
