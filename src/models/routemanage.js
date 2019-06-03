import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd';
import { getTableList, newTableList, delTableList, updTableList, updTable, getSelectList, onlyCheck } from 'services/routemanage'

export default modelExtend({
  namespace: 'routemanage',
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
        if (location.pathname === '/routemanage') {
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
        page: payload.page,
        pageSize: payload.pageSize,
        routeName: payload.routeName,
        routeUri: payload.routeUri
      }
      const response = yield call(getTableList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'updateState',
          payload: {
            list: response.RSP_BODY.routeList,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: response.RSP_BODY.total,
            },
          },
        })
      }
    },

    * getSelectList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        dictCode: 'ROUTE_PARAM'
      }
      const response = yield call(getSelectList, data)
      if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
        yield put({
          type: 'getselList',
          payload: response.RSP_BODY.dictList,
        })
      }
    },

    * newTableList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        routeId: payload.routeId,
        routeCode: payload.routeCode,
        routeName: payload.routeName,
        routeUri: payload.routeUri,
        routeStatus: payload.routeswitch,
        routeDesc: payload.routeDesc,
        routeParam: payload.routeParam,
        routeModel: payload.routeModel,
        routeComponent: payload.routeComponent,
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
        routeId: payload.routeId
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
        routeId: payload.routeId,
        routeCode: payload.routeCode,
        routeName: payload.routeName,
        routeUri: payload.routeUri,
        routeStatus: payload.routeswitch,
        routeDesc: payload.routeDesc,
        routeParam: payload.routeParam,
        routeModel: payload.routeModel,
        routeComponent: payload.routeComponent,
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
        routeId: payload.routeId,
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
        tab: 'ap_route',
        col: 'route_code',
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
    }
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
