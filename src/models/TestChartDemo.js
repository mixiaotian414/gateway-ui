import modelExtend from 'dva-model-extend'
import { query } from 'services/TestChartDemo'

export default modelExtend({
    namespace: 'testchartdemo',
    state: {
        demolist: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((location) => {
                if (location.pathname === '/chartdemo') {
                    // dispatch({
                    //     type: 'query',
                    // })
                }
            })
        },
    },

    effects: {
        * query({ payload = {} }, { call, put }) {
            const data = {}
            const response = yield call(query, data)
            if (response.success == true) {
                yield put({
                    type: 'list',
                    payload: response.RSP_BODY.demoList,
                })
            }
        },
    },

    reducers: {
        list(state, { payload }) {
            return {
                ...state,
                demolist: payload,
            }
        },
    }
})
