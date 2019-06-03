import modelExtend from 'dva-model-extend'
import * as userSettingService from 'services/userSetting'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { UserLockOrUnlock, user_list, getSelectList, user_load, user_delete, user_add, user_save, queryPersonnelrole, userpassword, userbusslist, userchecklist, useruserrole, organizationtree, organizationtreetwo, role_tolist } = userSettingService
export default modelExtend(pageModel, {
  namespace: 'userSetting',

  state: {
    list: [],//表单list
    formValues: {},//表单参数
    getGenderTypeList: [],//性别下拉列表
    getUserTypeList: [],//用户状态下拉列表
    getUserIdTypeList: [],
    item: [],//编辑取值list
    queryPersonnelrolelist: [],//角色list
    selectedRowKeys: [],
    roleIds: [],
    organizationtreelist: [],
    organizationtreelisttwo: [],
    bussList: [],
    checkList: [],
  },
  effects: {
    //查询用户列表
    * query({ payload = { page: 1, pageSize: 10 } }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = { ...payload, appId: appId }
      const response = yield call(user_list, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.userList,
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
    //获取性别，用户状态
    * getSelectList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        dictCode: 'GENDER'
      }
      const data1 = {
        appId: app,
        dictCode: 'USER_STATUS'
      }
      const data2 = {
        appId: app,
        dictCode: 'USER_ID_TYPE'
      }
      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getGenderTypeList',
            payload: response.RSP_BODY.dictList,
          })
        }
      }
      const response1 = yield call(getSelectList, data1)
      if (response1.success) {
        if (response1.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getUserTypeList',
            payload: response1.RSP_BODY.dictList,
          })
        }
      }
      const response2 = yield call(getSelectList, data2)
      if (response2.success) {
        if (response2.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getUserIdTypeList',
            payload: response2.RSP_BODY.dictList,
          })
        }
      }
    },
    * setDate({ payload }, { put, call, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const { orgId } = user
      yield put({
        type: 'organizationtree',
        payload: {
          appId: appId,
          orgId: orgId,
        }
      })
    },
    //机构树
    * organizationtree({ payload }, { put, call, select }) {
      const response = yield call(organizationtree, payload);
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              organizationtreelist: response.RSP_BODY.orgList,
            }
          })
        }
      }
    },
    //新增用户
    * add({ payload }, { call, put }) {
      const response = yield call(user_add, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('添加成功')
        }
      }
    },
    //机构树子节点
    * organizationtreetwo({ payload }, { put, call, select }) {
      const response = yield call(organizationtreetwo, payload);
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              organizationtreelisttwo: response.RSP_BODY.orgList,
            }
          })
        }
      }
    },
    //编辑取值
    * queryid({ payload }, { call, put }) {
      const response = yield call(user_load, payload)
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
    //用户删除
    * delete({ payload }, { call, put }) {
      const response = yield call(user_delete, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('删除成功')
        }
      }
    },
    //编辑保存
    * update({ payload }, { call, put }) {
      const response = yield call(user_save, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('修改成功')
        }
      }
    },
    //角色明细
    * queryPersonnelrole({ payload }, { call, put, select }) {
      const response = yield call(queryPersonnelrole, payload)
      if (response.success) {
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
    //密码重置
    * passwordreset({ payload }, { call, put, select }) {
      const response = yield call(userpassword, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('重置成功')
        }
      }
    },
    //角色关联取值
    * userchecklist({ payload }, { call, put, select }) {
      const response = yield call(userchecklist, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              roleIds: response.RSP_BODY.roleIds,
            },
          })
        }
      }
    },
    * userbusslist({ payload }, { call, put, select }) {
      const response = yield call(userbusslist, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              bussList: response.RSP_BODY.bussList,
              checkList: response.RSP_BODY.checkList,
            },
          })
        }
      }
    },
    //角色关联保存
    * useruserrole({ payload }, { call, put, select }) {
      const response = yield call(useruserrole, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({ type: 'updateState', payload: { selectedRowKeys: [] } })
          yield put({
            type: 'query',
          })
          message.success('关联成功')
        }
      }
    },
    //角色解锁&锁定
    * UserLockOrUnlock({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
        appId: app,
        lockStatus: payload.lockStatus,
        userId: payload.userId
      }
      const response = yield call(UserLockOrUnlock, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('操作成功')
          yield put({
            type: 'query',
          })
        }
      }
    }
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/userSetting') {
          dispatch({
            type: 'getSelectList'
          })
          dispatch({
            type: 'queryPersonnelrole',
          })
        }
      })
    },
  },

  reducers: {
    querySuccess(state, { payload }) {
      return { ...state, ...payload }
    },
    getGenderTypeList(state, { payload }) {
      return {
        ...state,
        getGenderTypeList: payload,
      }
    },
    getUserTypeList(state, { payload }) {
      return {
        ...state,
        getUserTypeList: payload,
      }
    },
    getUserIdTypeList(state, { payload }) {
      return {
        ...state,
        getUserIdTypeList: payload,
      }
    },
  },
})
