import { parse } from 'qs'
import modelExtend from 'dva-model-extend'
import { query,queryloglist,queryloglistbytime,querynotifylist } from 'services/dashboard'
import { model } from 'models/common'
import * as weatherService from 'services/weather'

export default modelExtend(model, {
  namespace: 'dashboard',
  state: {
    weather: {
      city: '深圳',
      temperature: '30',
      name: '晴',
      icon: '//s5.sencdn.com/web/icons/3d_50/2.png',
    },
    sales: [],
    quote: {
      avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
    numbers: [],
    loglist: [
      {logContent: "通知", funcCode: "101215", count: 18, funcId: 148, funcType: "2",icon: "idcard",status: "1"},
      {logContent: "获取登录用户信息", funcCode: "101202", count: 18, funcId: 141, funcType: "2",icon: "global",status: "1"},
      {logContent: "系统公告列表", funcCode: "101303", count: 18, funcId: 145, funcType: "2",icon: "fork",status: "1"},
      {logContent: "日志列表", funcCode: "101301", count: 18, funcId: 143, funcType: "2",icon: "shopping-cart",status: "1"},
    ],
    loglistbytime:[],
    notifylist:[
      {
        "lastUpdateTime":"2018-05-24 03:23:08",
        "notifyCode":"1",
        "notifyContent":"AAA",
        "notifyId":"1",
        "notifyTitle":"测试title1",
      }],
    modalVisible: false,
    recentSales: [],
    comments: [],
    completed: [],
    browser: [],
    cpu: {},
    user: {
      avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    },
  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(({ pathname }) => {
        if (pathname === '/dashboard' || pathname === '/') {
          dispatch({ type: 'queryWeather' })
          dispatch({ type: 'queryloglist' })
          dispatch({ type: 'queryloglistbytime' })
          dispatch({ type: 'querynotifylist' })
        }
      })
    },
  },
  effects: {
    * query ({payload}, { call, put }) {
      const data = yield call(query, parse(payload))
      yield put({
        type: 'updateState',
        payload: data,
      })
    },
    * queryloglist ({ payload }, { call, put, select }) {
      const response = yield call(queryloglist, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              loglist: response.RSP_BODY.logList,
            },
          })
        }
      }
    },
    * queryloglistbytime ({ payload }, { call, put, select }) {
      const response = yield call(queryloglistbytime, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              loglistbytime: response.RSP_BODY.sales,
            },
          })
        }
      }
    },
    * querynotifylist ({ payload }, { call, put, select }) {
      const response = yield call(querynotifylist, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              notifylist: response.RSP_BODY.logList,
            },
          })
        }
      }
    },
    * queryWeather ({payload = {},}, { call, put }) {
      payload.location = 'dalian'
      const result = yield call(weatherService.query, payload)
      if (result.results !== undefined) {
        const data = result.results[0]
        const weather = {
          city: data.location.name,
          temperature: data.now.temperature,
          name: data.now.text,
          icon: `//s5.sencdn.com/web/icons/3d_50/${data.now.code}.png`,
        }
        yield put({
          type: 'updateState',
          payload: {
            weather,
          },
        })
      }
    },
  },
  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible: false }
    },

    hideModal (state) {
      return { ...state, modalVisible: true }
    },
  },
})
