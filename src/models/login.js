import { routerRedux } from 'dva/router'
import { login } from 'services/login'

export default {
  namespace: 'login',

  state: {},

  effects: {
    * login ({
      payload,
    }, { put, call, select }) {
      const response = yield call(login, payload)
      const {locationQuery} = yield select(_ => _.app)

      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
        const {from} = locationQuery
        yield put({type: 'app/query'})
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      }
    }

    },
  },

}
