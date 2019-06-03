/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import { routerRedux } from 'dva/router'
import { parse } from 'qs'
import config from 'config'
import { EnumRoleType } from 'enums'
import { settheme, gettheme, query, logout, queryNotices, chpasswd, validateVal, clearNotices,userbusslist, user_load, loginroleRouters, userFuncList } from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
import { message } from 'antd'

const { prefix } = config

export default {
  namespace: 'app',
  state: {
    user: {},
    menu: [
      // {
      //   id: 1,
      //   icon: 'laptop',
      //   name: 'Dashboard',
      //   router: '/dashboard',
      // },

      { "level": 2, "openMode": "", "pMenuId": 1, "displayOrder": 1, "menuNameCh": "工作台", "isLeaf": "1", "isShow": "1", "menuNameEn": "", "routeUri": "/dashboard", "routeId": 1, "menuNameShort": "工作台", "appId": 1, "menuCode": "2", "lastUpdate": "2018-04-12 06:15:52.0", "menuId": 2, "isRoute": "1", "seq": "", "status": "1" },
    ],
    currentUser: {},
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    // darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    darkTheme: false,
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    notices: [],
    fetchingNotices: false,
    visible: false,
    visiblepass: true,
    userinfoVisible: false,
    flag: '',
    userList: {},
    bussList:[],
    plainOptions:[],
    checkList:[],
    funcList: [{ funcName: "角色管理新增", appId: 1, lastUpdate: "2018-06-14 03:58:25.0", funcCode: "100101", updator: 20 }],
  },

  subscriptions: {

    setupHistory({ dispatch, history }) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: queryString.parse(location.search),
          },
        })
      })
    },
    setup({ dispatch }) {
      dispatch({ type: 'query' })
      let tid
      window.onresize = () => {
        clearTimeout(tid)
        tid = setTimeout(() => {
          dispatch({ type: 'changeNavbar' })
        }, 300)
      }
    },
  },

  effects: {

    * query({
      payload,
    }, { call, put, select }) {
      const response = yield call(query, payload)
      const { locationPathname } = yield select(_ => _.app)

      if (response.success) {

        if (response.RSP_HEAD.TRAN_SUCCESS === '1' && response.RSP_BODY.user) {

          //正确获取到用户信息做以下处理
          const user = response.RSP_BODY.user
          const notifyCount = yield call(queryNotices, { appId: user.appId, userId: user.userId })
          const currentUser = { "notifyCount": notifyCount.RSP_BODY.notifyList.length }
          //const { list } = yield call(menusService.query)
          const responseMenu = yield call(menusService.query, { appId: "1" })
          const responseRouters = yield call(loginroleRouters, { appId: user.appId, userId: user.userId })
          const responseUserFuncList = yield call(userFuncList, {})
          const responseUserbussList = yield call(userbusslist, {appId: user.appId, userId: user.userId})
          let bussList = responseUserbussList.RSP_BODY.bussList
          let checkList = responseUserbussList.RSP_BODY.checkList
          let routersList = JSON.stringify(responseRouters.RSP_BODY.routers)
          window.localStorage.setItem("routersList", routersList)
          let funcList = responseUserFuncList.RSP_BODY.funcList
          let menu = responseMenu.RSP_BODY.menuList

          yield put({
            type: 'updateState',
            payload: {
              user,
              currentUser,
              menu,
              funcList,
              bussList,
              checkList,
              darkTheme: user.defaultStyle == "1" ? true : false
            },
          })
          //if (locationPathname === '/login') {
		/*	yield put(routerRedux.push({
			  pathname: responseRouters.RSP_BODY.routers[0].path,
			}))*/
          //}
          //密码过期限制路由跳转(user.expire === "true"说明密码已过期)
          if (user.expire === true) {
            yield put(routerRedux.push({
              pathname: '/dashboard',
            }))
          }
        } else {
          //未登录转到用户我登录页面
          yield put(routerRedux.push({
            pathname: '/login',
            search: queryString.stringify({
              from: locationPathname,
            }),
          }))
          // if (locationPathname.indexOf("/login")===-1) {
          //   throw ({message: '[' + response.RSP_HEAD.ERROR_CODE + ']--' + response.RSP_HEAD.ERROR_MESSAGE})
          // }
        }

      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
        throw ({ statusCode: response.statusCode, message: '[' + response.statusCode + ']--' + response.message })
      }
    },
    * logout({ payload, }, { call, put }) {
      const data = yield call(logout, parse(payload))
      if (data.success) {
        yield put(routerRedux.push({
          pathname: '/login',
        }))
      } else {
        throw (data)
      }
    },
    * changeNavbar(action, { put, select }) {
      const { app } = yield (select(_ => _))
      const isNavbar = document.body.clientWidth < 769
      if (isNavbar !== app.isNavbar) {
        yield put({ type: 'handleNavbar', payload: isNavbar })
      }
    },
    * fetchNotices({ payload }, { call, put }) {

      yield put({
        type: 'changeNoticeLoading',
        payload: true,
      });
      const response = yield call(queryNotices, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'saveNotices',
            payload: response.RSP_BODY,
          });
          yield put({
            type: 'changeNotifyCount',
            payload: response.RSP_BODY.notifyList.length,
          });
        }
      }
    },
    * clearNotices({ payload }, { call, put }) {
      const response = yield call(clearNotices, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const count = yield call(queryNotices, { appId: payload.appId, userId: payload.userId })
          yield put({
            type: 'changeNotifyCount',
            payload: count.RSP_BODY.notifyList.length,
          });
          message.success('消息已阅读')
        }
      }
    },
    * changeModal({ payload }, { put }) {
      yield put({
        type: 'changeModalSave'
      });
    },
    * changeModalpass({ payload }, { put }) {
      yield put({
        type: 'changeModalSavepass'
      });
    },
    * userinfoModal({ payload }, { put }) {
      yield put({
        type: 'userinfoModalSave'
      });
    },
    * busslistMap({ payload }, { put }) {
      yield put({
        type: 'updateState',
        payload:payload
      });
    },
    * chpasswd({ payload }, { call }) {
      const response = yield call(chpasswd, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('修改成功')
        }
      }
    },
    //密码过期验证
    * passwordUpdate({ payload, }, { put, call, select }) {
      const response = yield call(chpasswd, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('修改成功')
        }
      }
    },

    * toLogin({ payload, },{put}){
      //修改成功后跳转到登录页
      yield put(routerRedux.push('/login'))
    },
    * validateVal({ payload }, { call, put }) {
      const response = yield call(validateVal, payload)
      yield put({
        type: 'updateValidateVal',
        payload: response.RSP_BODY.flag,
      });
    },
    * queryid({ payload }, { call, put }) {
      const response = yield call(user_load, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'userInfo',
            payload: response.RSP_BODY,
          })
        }
      }
    },
    * jumpNotice({ payload }, { call, put }) {
      yield put(routerRedux.push({
        pathname: '/readnotice',
      }))
    },
    * userFuncList({ payload }, { call, put }) {
      const response = yield call(userFuncList, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'funclist',
            payload: response.RSP_BODY.funcList,
          })
        }
      }
    },
    * userbusslist({ payload }, { call, put, select }) {
      const response = yield call(userbusslist, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'updateState',
            payload: {
              bussList: response.RSP_BODY.bussList,
              checkList: response.RSP_BODY.checkList,
            },
          })
        }
      }
    },
    //将主题数据传送后台
    * SetTheme({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const userId = id.app.user.userId
      var darkTheme = payload.sw
      console.log(payload.sw,"主题")
      const data = {
        appId: app,
        userId: userId,
        defaultStyle: payload.sw == true ? "0" : "1" //亮0/暗1
      }
      yield put({
        type: 'updateState',
        payload: { darkTheme: !darkTheme }
      })
      yield call(settheme, data)
    },
  },


  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    userInfo(state, { payload }) {
      return {
        ...state,
        userList: payload,
      }
    },
    updateValidateVal(state, { payload }) {
      return {
        ...state,
        flag: payload,
      }
    },
    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold)
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },
    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },
    handleNavbar(state, { payload }) {
      return {
        ...state,
        isNavbar: payload,
      }
    },
    handleNavOpenKeys(state, { payload: navOpenKeys }) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
        fetchingNotices: false,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: {
          list: state.notices.list.filter(item => item.type !== payload)
        },
      };

    },
    changeNoticeLoading(state, { payload }) {
      return {
        ...state,
        fetchingNotices: payload,
      };
    },
    changeModalSave(state) {
      return {
        ...state,
        visible: !state.visible,
      };
    },
    changeModalSavepass(state) {
      return {
        ...state,
        visiblepass: !state.visiblepass,
      };
    },
    userinfoModalSave(state) {
      return {
        ...state,
        userinfoVisible: !state.userinfoVisible,
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          notifyCount: action.payload,
        },
      };
    },
    funclist(state, { payload }) {
      return {
        ...state,
        funcList: payload,
      }
    },
  },
}
