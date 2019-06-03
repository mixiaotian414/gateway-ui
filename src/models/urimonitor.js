import modelExtend from 'dva-model-extend'
import { getTableList } from 'services/urimonitor'

export default modelExtend({
    namespace: 'urimonitor',
    state: {
        list: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/urimonitor') {
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
