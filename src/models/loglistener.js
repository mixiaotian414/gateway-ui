import modelExtend from 'dva-model-extend'
import { getLog } from 'services/loglistener'

export default modelExtend({
    namespace: 'loglistener',
    state: {
        loglist: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/loglistener') {
                    dispatch({
                        type: 'updateState',
                        payload: {
                            loglist: [],
                        }
                    })
                }
            })
        },
    },

    effects: {
        * GetLog({ payload }, { call, put }) {
            const data = {
                startRow: payload.startRow || '',
                endRow: payload.endRow || '',
            }
            const response = yield call(getLog, data)
            if (response.success == true) {
                yield put({
                    type: 'querylist',
                    payload: response.RSP_BODY.readList,
                })
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
        querylist(state, { payload }) {
            return {
                ...state,
                loglist: payload,
            }
        },
    }
})
