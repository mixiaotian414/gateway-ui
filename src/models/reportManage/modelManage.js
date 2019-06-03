import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/modelManage'
import {message} from 'antd'
const {query,querySelectTree,queryProductLev,create,reportdelete,reportupdate,reportproddelete} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》模型管理
 * @Description:model
 * @Author: mxt
 * @Time: 2018/3/22
 * @updateTime: 2018/5/10
 * @updateRemark: 表格展开，表格删除指标
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="modelManage"
export default modelExtend({

  namespace: LedgerType,
  state:{
    list:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {

        if (location.pathname==="/"+LedgerType) {

          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'initData',
            payload,
          })
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },

  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {

      //列表data
      const data = yield call(query, payload)

      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.RSP_BODY.reportList,
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

    * initData({payload={ page: 1, pageSize: 10 }}, {call, put}) {

      payload={	"appId":"1",
        "dictCode":"REPORT_TYPE"}
      //类别
      const queryProductLevData = yield call(queryProductLev, payload)
      if (queryProductLevData.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({
          type: 'querySuccess',
          payload: {
            queryProductLevData: queryProductLevData.RSP_BODY.dictList,
          },
        })
      }else{
        message.error("获取科目级别失败："+queryProductLevData)
      }
    },

    * create ({ payload }, { call, put }) {
      const data = yield call(create, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },

    * update ({ payload ,callback}, { call, put }) {
      const data = yield call(reportupdate, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({ type: 'hideModal' })
        yield put({ type: 'query' })
      } else {
        throw data
      }
    /*  callback(data)*/
    },
    * multiDelete ({ payload,callback }, { call, put }) {
      const data = yield call(reportdelete, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({ type: 'query' })
      } else {
        throw data
      }

      callback(data)
    },

  * deleteIndex ({ payload,callback }, { call, put }) {
      const data = yield call(reportproddelete, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        callback(data)
      } else {
        throw data
      }


    },


  },

  reducers: {

    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal (state) {
      return { ...state, modalVisible: false }
    },

    querySuccess(state, {payload}) {
      return {...state, ...payload}
    }
  }

})
