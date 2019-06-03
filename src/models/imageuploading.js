import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import { message, Modal } from 'antd';

export default modelExtend({
  namespace: 'imageuploading',
  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/imageuploading') {
          // window.open("http://192.168.1.63:9000/");
        }
      })
    },
  },

  effects: {

  },

  reducers: {

  }
})
