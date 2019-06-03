import modelExtend from 'dva-model-extend'
import { getTableList } from 'services/sqlmonitor'

export default modelExtend({
    namespace: 'sqlmonitor',
    state: {
        list: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/sqlmonitor') {
                    dispatch({
                        type: 'getTableList'
                    })
                }
            })
        },
    },

    effects: {
        * getTableList({ payload }, { call, put, select }) {
            const response = yield call(getTableList)
            if (response.ResultCode == '1') {
                yield put({
                    type: 'list',
                    payload: response.Content,
                })
            }
        },
    },

    reducers: {
        list(state, { payload }) {
            return {
                ...state,
                list: payload,
            }
        },
    }
})
