import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd';
import { getSelectList, getSecdictSyntree, getSecdictSyntreeson, SecdictAddType, SecdictAddDict, SecdictDeltype, SecdictDel, SecdictLoadType, SecdictLoad, SecdictTypeSave, SecdictSave, SecdictTreeDict, SecdictDictInfo, SecdictDictTypeInfo, onlyCheck } from 'services/secdict'

export default modelExtend({
    namespace: 'secdict',
    state: {
        getTrList: [],
        getTrListson: [],
        updatelistone: [],
        updatelisttwo: [],
        treedict: [],
        dictinfo: [],
        typeinfo: [],
        getSelList: [],
        onlychecklist: []
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/secdict') {
                    dispatch({
                        type: 'getTreeType'
                    })
                    dispatch({
                        type: 'updateState',
                        payload: {
                            treedict: [],
                            dictinfo: [],
                            typeinfo: [],
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

        * SecdictTreeDict({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictTypeId: payload.dictTypeId
            }
            const response = yield call(SecdictTreeDict, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'gettreedict',
                    payload: response.RSP_BODY.dictList,
                })
            }
        },

        * getTreeType({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                pid: '#'
            }
            const response = yield call(getSecdictSyntree, data)
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
                pid: payload == undefined ? '#' : payload.dictTypeId
            }
            const response = yield call(getSecdictSyntreeson, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'gettrListson',
                    payload: response.RSP_BODY.dictList,
                })
            }
        },

        * SecdictAddType({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId,
                dictCode: payload.dictCode,
                dictName: payload.dictName,
                dictStatus: payload.dictStatus,
                dictOrder: payload.dictOrder,
                dictTypeDesc: payload.dictTypeDesc
            }
            const response = yield call(SecdictAddType, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('添加成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
            }
        },

        * SecdictAddDict({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId,
                dictValue: payload.dictValue,
                dictName: payload.dictName,
                status: payload.status,
                dictOrder: payload.dictOrder,
                dictDesc: payload.dictDesc,
                dictTypeId: payload.dictTypeId
            }
            const response = yield call(SecdictAddDict, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('添加成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
            }
        },

        * SecdictDeltype({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(SecdictDeltype, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('删除成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
            }
        },

        * SecdictDel({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(SecdictDel, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('删除成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
            }
        },

        * SecdictLoadType({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(SecdictLoadType, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'updateList',
                    payload: response.RSP_BODY,
                })
            }
        },

        * SecdictLoad({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(SecdictLoad, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'updateListtwo',
                    payload: response.RSP_BODY,
                })
            }
        },

        * SecdictTypeSave({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId,
                dictCode: payload.dictCode,
                dictName: payload.dictName,
                dictStatus: payload.dictStatus,
                dictTypeDesc: payload.dictTypeDesc,
                dictTypeOrder: payload.dictTypeOrder,
            }
            const response = yield call(SecdictTypeSave, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('修改成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
            }
        },

        * SecdictSave({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId,
                dictName: payload.dictName,
                dictValue: payload.dictValue,
                status: payload.status,
                dictOrder: payload.dictOrder,
                dictDesc: payload.dictDesc,
                dictTypeId: payload.dictTypeId,
            }
            const response = yield call(SecdictSave, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                message.success('修改成功')
                yield put({
                    type: 'getTreeType',
                    data
                })
            }
        },

        * SecdictDictInfo({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(SecdictDictInfo, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'updateState',
                    payload: {
                        typeinfo: []
                    },
                })
                yield put({
                    type: 'getdictinfo',
                    payload: response.RSP_BODY,
                })
            }
        },

        * SecdictDictTypeInfo({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                dictId: payload.dictId
            }
            const response = yield call(SecdictDictTypeInfo, data)
            if (response.RSP_HEAD.TRAN_SUCCESS == '1') {
                yield put({
                    type: 'getdicttypetnfo',
                    payload: response.RSP_BODY,
                })
            }
        },

        * onlyCheck({ payload }, { call, put, select }) {
            const id = yield select(state => state)
            const app = id.app.user.appId
            const data = {
                appId: app,
                tab: 'ap_dictionary_type',
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
        },
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
        gettrListson(state, { payload }) {
            return {
                ...state,
                getTrListson: payload,
            }
        },
        updateList(state, { payload }) {
            return {
                ...state,
                updatelistone: payload,
            }
        },
        updateListtwo(state, { payload }) {
            return {
                ...state,
                updatelisttwo: payload,
            }
        },
        gettreedict(state, { payload }) {
            return {
                ...state,
                treedict: payload,
            }
        },
        getdictinfo(state, { payload }) {
            return {
                ...state,
                dictinfo: payload,
            }
        },
        getdicttypetnfo(state, { payload }) {
            return {
                ...state,
                typeinfo: payload,
            }
        },
        getselList(state, { payload }) {
            return {
                ...state,
                getSelList: payload,
            }
        },
    }
})
