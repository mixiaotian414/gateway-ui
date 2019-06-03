import { message } from 'antd'
import { routerRedux } from 'dva/router'
import { chpasswd } from 'services/app'



export default {
  namespace: 'password',

  state: {},

  effects: {
    * passwordUpdate ({
               payload,
             }, { put, call, select }) {
      const response = yield call(chpasswd, payload)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('修改成功')
          yield put(routerRedux.push('/login'))

        }
      }
    },
  },

}
