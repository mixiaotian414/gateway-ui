import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/adjustIndex'
import {message} from 'antd'
const {query,create} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》派生指标调整
 * @Description:model
 * @Author: mxt
 * @Time: 2018/5/2
 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="adjustIndex"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    quota:{},
    organ:{},
    quotaNum:0,
    organNum:0,
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    modalType:'create',
    currentItem:{},
    modalVisible:false,
    modalType1:'create',
    type: '', //指标 机构类型
    modalVisible1:false
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname==="/"+LedgerType) {
          dispatch({
            type: 'init',
          })
          dispatch({
            type:'querySuccess',
            payload: {
              quotaNum:0,
              quota:{},
              organ:{},
              organNum:0,
            },
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
              list: data.RSP_BODY.dataList,
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
    * create ({ payload,callback }, { select,call, put }) {
      /* const data = yield call(create, payload)*/
      const data = yield call(create, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              modalVisible: false
            },
          })
          message.success('成功')
          callback(data)
          const {formValues} = yield (select(_ => _.adjustIndex))
          yield put({
            type: 'query',
            payload: formValues,
          })
        }
      }
    },
    * toEdit ({ payload,callback }, { call, put }) {
      /*   const data = yield call(create, payload)*/
      yield put({ type: 'querySuccess',
        payload })
      callback()
    },
    * init ({ payload}, { put,select }) {

      const { user } = yield select(_ => _.app)

      const {appId,orgId}=user

      yield put({
        type: 'querySuccess',
        payload: {
          appId,
          orgId
        },
      })

    },
  },
  
  reducers: {
    saveModalData (state, { payload }) {
      return { ...state, ...payload, modalVisible1: false }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible1: true }
    },

    hideModal (state) {
      return { ...state, modalVisible1: false }
    },
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    }
  }

})
