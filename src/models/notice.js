import modelExtend from 'dva-model-extend'
import * as tableService from 'services/notice'
import {message} from 'antd'
const {query,deleteLog,queryid,getSelectList,addNotice,addNoticeAll} = tableService

export default modelExtend({

  namespace: 'notice',
  state:{
    list:[],
    item:{
    },
    getStatusList: [],
    getTypeList: [],
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/notice') {
          dispatch({
            type: 'getSelectList'
          })
        }
      })
    },
  },

  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put,select}) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      //事中列表data
      const data = yield call(query, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.notifyList,
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
    * getSelectList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
          appId: app,
          dictCode: 'ROLE_TYPE'
      }
      const data1 = {
          appId: app,
          dictCode: 'ROLE_STATUS'
      }
      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getTypeList',
            payload: response.RSP_BODY.dictList,
          })
        }
      }
      const response1 = yield call(getSelectList, data1)
      if (response1.success) {
        if (response1.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getStatusList',
            payload: response1.RSP_BODY.dictList,
          })
        }
      }
    },
    * delete ({ payload }, { select, call, put }) {
      const response = yield call(deleteLog, payload)
      //const data = yield call(del, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.notice))
          yield put({
            type: 'query',
            payload: formValues,
          })
          if (response.RSP_BODY.flag === '0') {
            message.success('撤销成功')
          }else {
            message.success('重新发布成功')
          }
        }
      }
    },
    * add ({ payload }, { select, call, put }) {
      const response = yield call(addNotice, payload)
      //const data = yield call(del, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.notice))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('发布成功')
        }
      }
    },
    * addAll ({ payload }, { select, call, put }) {
      const response = yield call(addNoticeAll, payload)
      //const data = yield call(del, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.notice))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('发布成功')
        }
      }
    },
    * queryid ({ payload = { page: 1, pageSize: 10 } }, { call, put, select} ) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(queryid, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              listUser: response.RSP_BODY.userList,
              paginationUser: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: response.RSP_BODY.total,
              },
            },
          })
        }
      }
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    getTypeList(state, { payload }) {
      return {
        ...state,
        getTypeList: payload,
      }
    },
    getStatusList(state, { payload }) {
      return {
        ...state,
        getStatusList: payload,
      }
    },
  }

})
