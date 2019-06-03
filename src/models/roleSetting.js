import modelExtend from 'dva-model-extend'
import * as tableService from 'services/roleSetting'
import {message} from 'antd'
const {query,deleteRole,addRole,updateRole,queryid,menuTree,menuChecked,queryMenuItem,funcTree,funcChecked,queryFuncItem,getSelectList,rmsave,frsave} = tableService

export default modelExtend({

  namespace: 'roleSetting',
  state:{
    list:[],
    menulist:[],
    menuchecked:[],
    funclist:[],
    funcchecked:[],
    inTradeCounts:20,
    afterTradeCounts:100,
    item:{
      status:"1"
    },
    menuItem:{
      appId: "",
      pMenuId: "",
      menuCode: "",
      menuNameCh: "",
      menuNameEn: "",
      menuNameShort: "",
      seq: "",
      routeUri:"",
      displayOrder: 1,
      user: "",
      status: "",
      iconPath: ""
    },
    funcItem:{
      appId: "",
      funcId: "",
      funcCode: "",
      funcName: "",
      funcDesc: "",
      funcType: "",
      status: ""
    },
    getStatusList: [],
    getTypeList: [],
    countFlag:'',
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/roleSetting') {
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
              list: data.RSP_BODY.roleList,
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
    * queryMenuItem ({ payload }, { call, put, select }) {
      const response = yield call(queryMenuItem, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              menuItem: response.RSP_BODY,

            },
          })
        }
      }
    },
    * queryFuncItem ({ payload }, { call, put, select }) {
      const response = yield call(queryFuncItem, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              funcItem: response.RSP_BODY,

            },
          })
        }
      }
    },
    * menuTree ({ payload }, { put, call }) {
      const response = yield call(menuTree,payload);
      const response1 = yield call(menuChecked,payload);
      if (response.success && response1.success) {
        if ((response.RSP_HEAD.TRAN_SUCCESS === '1') && (response1.RSP_HEAD.TRAN_SUCCESS === '1')) {
          const menutreeData = response.RSP_BODY.menuList;
          const menutreeChecked = response1.RSP_BODY.menuIds;
          yield put({
            type: 'querySuccess',
            payload: {
              menulist: menutreeData,
              menuchecked: menutreeChecked,
            }
          })
        }
      }
    },
    * funcTree ({ payload }, { put, call }) {
      const response = yield call(funcTree,payload);
      const response1 = yield call(funcChecked,payload);
      if (response.success && response1.success) {
        if ((response.RSP_HEAD.TRAN_SUCCESS === '1') && (response1.RSP_HEAD.TRAN_SUCCESS === '1')) {
          const functreeData = response.RSP_BODY.funcList;
          const functreeChecked = response1.RSP_BODY.funcIds;
          yield put({
            type: 'querySuccess',
            payload: {
              funclist: functreeData,
              funcchecked: functreeChecked,
            }
          })
        }
      }
    },
    * delete ({ payload }, { select, call, put }) {
      const response = yield call(deleteRole, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.roleSetting))
          yield put({
            type: 'query',
            payload: formValues,
          })
          yield put({
            type: 'setCountFlag',
            payload: response.RSP_BODY.count,
          })
          if (response.RSP_BODY.result) {
            if (response.RSP_BODY.result === 'success') {
              message.success('删除成功')
            }
          }
        }
      }
    },
    * add ({ payload }, { select, call, put }) {
      const response = yield call(addRole, payload)
      //const response = yield call(add, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.roleSetting))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('添加成功')
        }
      }
    },
    * update ({ payload }, { select, call, put }) {
      const response = yield call(updateRole, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          const {formValues} = yield (select(_ => _.roleSetting))
          yield put({
            type: 'query',
            payload: formValues,
          })
          message.success('修改成功')
        }
      }
    },
    * rmsave ({ payload }, { select, call, put }) {
      const response = yield call(rmsave, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('保存成功')
        }
      }
    },
    * frsave ({ payload }, { select, call, put }) {
      const response = yield call(frsave, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('保存成功')
        }
      }
    },
    * queryid ({ payload }, { call, put }) {
      const response = yield call(queryid, payload)
      if (response.success) {
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
    setCountFlag(state, { payload }) {
      return {
        ...state,
        countFlag: payload,
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
