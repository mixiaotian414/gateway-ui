import modelExtend from 'dva-model-extend'
import { getTableList } from 'services/datasource'

export default modelExtend({
    namespace: 'datasource',
    state: {
        list: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/datasource') {
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
                    payload: response.Content[0],
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
