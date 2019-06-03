/* eslint-disable quotes */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import * as menuTreeService from 'services/menumanage'
import { pageModel } from 'models/common'
import { message } from 'antd'
import { query, logout } from 'services/app'

const { querylist, queryid, add, update, del, queryPersonnelrole,queryrutelist,routebind, menucheck_menu, getSelectList } = menuTreeService

export default modelExtend(pageModel,{
  namespace: 'menumanage',

  state: {
    list: [],
    item: [],
    formValues: {},
    queryPersonnelrolelist: [],
    appId: [],
    pMenuId: [],
    queryroutelist: [],
    routeId: [],
    getRouteTypeList: [],
    getShowTypeList: [],
    getMenuStatusList: [],
    countflag:[],
  },

  effects: {
    //获取路由，菜单显示状态
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const data = {
          appId: appId,
          dictCode: 'IS_ROUTE'
      }
     const data1 = {
          appId: appId,
          dictCode: 'IS_SHOW'
      }
      const data2 = {
          appId: appId,
          dictCode: 'MENU_STATUS'
      }
      const response = yield call(getSelectList, data)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getRouteTypeList',
            payload: response.RSP_BODY.dictList,
          })
        }
      }
      const response1 = yield call(getSelectList, data1)
      if(response1.success) {
        if (response1.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getShowTypeList',
            payload: response1.RSP_BODY.dictList,
          })
        }
      }
      const response2 = yield call(getSelectList, data2)
      if(response2.success) {
        if (response2.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getMenuStatusList',
            payload: response2.RSP_BODY.dictList,
          })
        }
      }
    },

    //树列表
    * query ({ payload }, { put, call, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(querylist,payload);
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.menuList,
            }
          })
        }
      }
    },

    //角色明细
    * queryPersonnelrole ({ payload }, { call, put} ) {
      const response = yield call(queryPersonnelrole, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              queryPersonnelrolelist: response.RSP_BODY.roleList,
            },
          })
        }
      }
    },
    //路由列表

    * queryrutelist ({ payload = { page: 1, pageSize: 10 } }, { call, put, select} ) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(queryrutelist, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              queryroutelist: response.RSP_BODY.routeList,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: response.RSP_BODY.total,
              },
            },
          })
        }
      }
    },
    //路由绑定
    * routebind ({ payload }, { select, call, put }) {
      const response = yield call(routebind, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'menucheckmenu',
            payload
          })
          if(payload.routeId===undefined){
            message.success('解绑成功！')
          }else{
            message.success('绑定成功！')
          }
        }
      }
    },
    //路由选中
    * menucheckmenu ({ payload }, { select, call, put }) {
      const response = yield call(menucheck_menu, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              routeId: response.RSP_BODY.routeId,
            },
          })
        }
      }
    },
    * delete ({ payload }, { select, call, put }) {
      const response = yield call(del, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              countflag: response.RSP_BODY.count,
            }
          })
          yield put({
            type: 'query',
            payload,
          })
        }
      }
    },
    * add ({ payload }, { select, call, put }) {
      const response = yield call(add, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
            payload,
          })
          message.success('添加成功')
        }
      }
    },
    * update ({ payload }, { select, call, put }) {
      const response = yield call(update, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
            payload,
          })
          message.success('修改成功')
        }
      }
    },
    * queryid ({ payload }, { call, put, select }) {
      const response = yield call(queryid, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              item: response.RSP_BODY,

            },
          })
        }
      }
    },
  },

  subscriptions: {
    setup({dispatch, history }) {

      history.listen((location) => {
        if (location.pathname === '/menumanage') {
          dispatch({
            type: 'getSelectList'
          })

        }
      })
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    getRouteTypeList(state, { payload }) {
      return {
        ...state,
        getRouteTypeList: payload,
      }
    },
    getShowTypeList(state, { payload }) {
      return {
        ...state,
        getShowTypeList: payload,
      }
    },
    getMenuStatusList(state, { payload }) {
      return {
        ...state,
        getMenuStatusList: payload,
      }
    },
  }
})
