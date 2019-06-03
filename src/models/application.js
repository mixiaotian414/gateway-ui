import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd';
import { getTableList, newTableList, getSelectList, updTable, updTableList, delTableList, onlyCheck } from 'services/application'

export default modelExtend({
  namespace: 'application',
  state: {
    tablelist: [],
    formValues: {},
    list: [],
    getSelList: [],
    checkupdateList: [],
    onlychecklist: []
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/application') {
          dispatch({
            type: 'getSelectList'
          })
        }
      })
    },
  },

  effects: {

    * getTableList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        appName: payload.appName,
        page: payload.page,
        pageSize: payload.pageSize
      }
      const response = yield call(getTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'updateState',
          payload: {
            list: response.RSP_BODY.appList,
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
        appName: payload.systemName,
        appCode: payload.appCode,
        appType: payload.systemType,
        openApp: payload.systemSwitch,
        appPeffectivedate: payload.Taketimevalue,
        appExpiredate: payload.Invalidtimevalue,
        appDesc: payload.systemTalk
      }
      const response = yield call(newTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        message.success('添加成功')
      }
    },

    * getSelectList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        dictCode: 'APP_TYPE',
      }
      const response = yield call(getSelectList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'getselList',
          payload: response.RSP_BODY.dictList,
        })
      }
    },

    * updTable({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app
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
        appName: payload.systemName,
        appCode: payload.appCode,
        appType: payload.systemType,
        openApp: payload.systemSwitch,
        appPeffectivedate: payload.Taketimevalue,
        appExpiredate: payload.Invalidtimevalue,
        appDesc: payload.systemTalk
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
        appId: app
      }
      const response = yield call(delTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        message.success('删除成功')
      }
    },

    * onlyCheck({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        tab: 'ap_application',
        col: 'APP_CODE',
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
