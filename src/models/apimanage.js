import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd';
import { getSelectList, getTableList, newTableList, delTableList, updTableList, updTable, onlyCheck } from 'services/apimanage'

export default modelExtend({
  namespace: 'apimanage',
  state: {
    tablelist: [],
    formValues: {},
    list: [],
    checkupdateList: [],
    getSelList: [],
    onlychecklist: [],
    deleteinfo: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/apimanage') {
          dispatch({
            type: 'getSelectList'
          })
        }
      })
    },
  },

  effects: {

    * getSelectList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        dictCode: 'API_METHOD',
      }
      const response = yield call(getSelectList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'getselList',
          payload: response.RSP_BODY.dictList,
        })
      }
    },

    * getTableList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        apiName: payload.appName,
        page: payload.page,
        pageSize: payload.pageSize
      }
      const response = yield call(getTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'updateState',
          payload: {
            list: response.RSP_BODY.apiList,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response.RSP_BODY.total,
            },
          },
        })
      }
    },

    * newTableList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        apiId: payload.apiId,
        apiCode: payload.apiCode,
        apiName: payload.apiName,
        apiUri: payload.apiLocation,
        apiMethod: payload.apiMethod,
        apiStatus: payload.apiswitch,
        apiDesc: payload.apiTalk
      }
      const response = yield call(newTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        message.success('添加成功')
      }
    },

    * updTable({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        apiId: payload.apiId
      }
      const response = yield call(updTable, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'updateList',
          payload: response.RSP_BODY,
        })
      }
    },

    * updTableList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        apiId: payload.apiId,
        apiCode: payload.apiCode,
        apiName: payload.apiName,
        apiUri: payload.apiLocation,
        apiMethod: payload.apiMethod,
        apiStatus: payload.apiswitch,
        apiDesc: payload.apiTalk
      }
      const response = yield call(updTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        message.success('修改成功')
      }
    },

    * delTableList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        apiId: payload.apiId,
        isDel: payload.isDel
      }
      const response = yield call(delTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'updateState',
          payload: {
            deleteinfo: response.RSP_BODY
          },
        })
      }
    },

    * onlyCheck({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        tab: 'ap_api',
        col: 'api_code',
        val: payload.value
      }
      const response = yield call(onlyCheck, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        if (response.RSP_BODY.flag == true) {
          message.error('编码：' + payload.value + '已存在')
          yield put({
            type: 'updateState',
            payload: {
              onlychecklist: response.RSP_BODY
            },
          })
        } else {
          yield put({
            type: 'updateState',
            payload: {
              onlychecklist: response.RSP_BODY
            },
          })
        }
      }
    },
  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    getselList(state, { payload }) {
      return {
        ...state,
        getSelList: payload,
      }
    },
    updateList(state, { payload }) {
      return {
        ...state,
        checkupdateList: payload,
      }
    },
  }
})
