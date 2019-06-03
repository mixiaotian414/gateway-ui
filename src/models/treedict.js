import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd';
import { getTreeType, getTreeTypeSon, DictTreeAdd, DictTreeEdit, DictTreeSave, DictTreeDel, DictTreeInfo, DictTreeTreeList, onlyCheck, getSelectList } from 'services/treedict'

export default modelExtend({
    namespace: 'treedict',
    state: {
        getTrList: [],
        updateList: [],
        getTrListSon: [],
        dicttreeinfolist: [],
        dicttreetreelist: [],
        onlychecklist: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/treedict') {
                    dispatch({
                        type: 'getTreeType'
                    })
                    dispatch({
                        type: 'updateState',
                        payload: {
                            dicttreetreelist: [],
                            dicttreeinfolist: [],
                        }
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
                dictCode: 'APP_TYPE',
            }
            const response = yield call(getSelectList, data)
        },

        * getTreeType({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                pid: '-1'
            }
            const response = yield call(getTreeType, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'gettrList',
                    payload: response.RSP_BODY.dictList,
                })
            }
        },

        * getTreeTypeSon({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                pid: payload == undefined ? '-1' : payload.dictTypeId
            }
            const response = yield call(getTreeTypeSon, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'gettrListSon',
                    payload: response.RSP_BODY.dictList,
                })
            }
        },

        * DictTreeAdd({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictCode: payload.dictCode,
                dictName: payload.dictName,
                dictParentId: payload.dictParentId,
                dictStaus: payload.dictStaus,
                dictLevel: payload.dictLevel,
                dictOrder: payload.dictOrder,
            }
            const response = yield call(DictTreeAdd, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('添加成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
                /*yield put({
                    type: 'getTreeTypeSon',
                    payload
                })*/
            }
        },

        * DictTreeEdit({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(DictTreeEdit, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'updateList',
                    payload: response.RSP_BODY,
                })
            }
        },

        * DictTreeSave({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId,
                dictCode: payload.dictCode,
                dictName: payload.dictName,
                dictParentId: payload.dictParentId,
                dictStaus: payload.dictStaus,
                dictOrder: payload.dictOrder,
            }
            const response = yield call(DictTreeSave, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('修改成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
               /* yield put({
                    type: 'getTreeTypeSon',
                    payload
                })*/
            }
        },

        * DictTreeDel({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(DictTreeDel, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('删除成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
                yield put({
                    type: 'getTreeTypeSon',
                    data
                })
            }
        },

        * DictTreeInfo({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(DictTreeInfo, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'dicttreeinfo',
                    payload: response.RSP_BODY,
                })
            }
        },

        * DictTreeTreeList({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                pid: payload.pid
            }
            const response = yield call(DictTreeTreeList, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'dicttreetreelist',
                    payload: response.RSP_BODY.dictList,
                })
            }
        },

        * onlyCheck({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                tab: 'ap_dict_tree',
                col: 'DICT_CODE',
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
        gettrList(state, { payload }) {
            return {
                ...state,
                getTrList: payload,
            }
        },
        gettrListSon(state, { payload }) {
            return {
                ...state,
                getTrListSon: payload,
            }
        },
        updateList(state, { payload }) {
            return {
                ...state,
                updateList: payload,
            }
        },
        dicttreeinfo(state, { payload }) {
            return {
                ...state,
                dicttreeinfolist: payload,
            }
        },
        dicttreetreelist(state, { payload }) {
            return {
                ...state,
                dicttreetreelist: payload,
            }
        },
    }
})
