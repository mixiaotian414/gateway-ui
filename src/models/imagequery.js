import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'


export default modelExtend({
  namespace: 'imagequery',
  state: {

  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen((location) => {
        // if (location.pathname === '/imagequery') {
        //   dispatch({

        //   })
        // }
      })
    },
  },

  effects: {

  },

  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },

  }
})
