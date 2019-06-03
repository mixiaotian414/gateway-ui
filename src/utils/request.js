/* global window */
import axios from 'axios'
import qs from 'qs'
import jsonp from 'jsonp'
import lodash from 'lodash'
import pathToRegexp from 'path-to-regexp'
import { message } from 'antd'
import { YQL, CORS } from './config'
import { routerRedux } from 'dva/router'

const fetch = (options) => {
  let {
    method = 'get',
    data,
    fetchType,
    url,
  } = options


  const cloneData = lodash.cloneDeep(data)


  try {
    let domin = ''
    if (url.match(/[a-zA-z]+:\/\/[^/]*/)) {
      [domin] = url.match(/[a-zA-z]+:\/\/[^/]*/)
      url = url.slice(domin.length)
    }
    const match = pathToRegexp.parse(url)
    url = pathToRegexp.compile(url)(data)
    for (let item of match) {
      if (item instanceof Object && item.name in cloneData) {
        delete cloneData[item.name]
      }
    }
    url = domin + url
  } catch (e) {
    message.error(e.message)
  }
  const newData = {
    "REQ_HEAD": {},
    "REQ_BODY": {
      ...cloneData
    }
  }
  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      jsonp(url, {
        param: `${qs.stringify(data)}&callback`,
        name: `jsonp_${new Date().getTime()}`,
        timeout: 4000,
      }, (error, result) => {
        if (error) {
          reject(error)
        }
        resolve({ statusText: 'OK', status: 200, data: result })
      })
    })
  } else if (fetchType === 'YQL') {
    url = `http://query.yahooapis.com/v1/public/yql?q=select * from json where url='${options.url}?${encodeURIComponent(qs.stringify(options.data))}'&format=json`
    data = null
  }

  switch (method.toLowerCase()) {
    case 'get':
      return axios.get(url, {
        params: cloneData,
      })
    case 'delete':
      return axios.delete(url, {
        data: newData,
      })
    case 'post':
      return axios.post(url, newData)
    case 'put':
      return axios.put(url, newData)
    case 'patch':
      return axios.patch(url, newData)
    case 'postfile':
      return axios.post(url, newData,{
        responseType: 'blob',
      })
    default:
      return axios(options)
  }
}

export default function request (options) {
  if (options.url && options.url.indexOf('//') > -1) {
    const origin = `${options.url.split('//')[0]}//${options.url.split('//')[1].split('/')[0]}`
    if (window.location.origin !== origin) {
      if (CORS && CORS.indexOf(origin) > -1) {
        options.fetchType = 'CORS'
      } else if (YQL && YQL.indexOf(origin) > -1) {
        options.fetchType = 'YQL'
      } else {
        options.fetchType = 'JSONP'
      }
    }
  }

  return fetch(options).then((response) => {





    const { statusText, status } = response
    let data = options.fetchType === 'YQL' ? response.data.query.results.json : response.data
    if (data instanceof Array) {
      data = {
        list: data,
      }
    }
    if (response.config.url.indexOf("/gateway/user.json") === -1) {
      if (data.hasOwnProperty('RSP_HEAD')) {
        if (data.RSP_HEAD.hasOwnProperty('TRAN_SUCCESS')) {
          if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          } else {
            if (data.RSP_HEAD.ERROR_CODE === 'GATEHP7007') {
              window.location.reload()
            }
            message.error('[' + data.RSP_HEAD.ERROR_CODE + ']--' + data.RSP_HEAD.ERROR_MESSAGE)
          }
        }
      }
    }
    if (response.config.url.indexOf("/gateway/exportexcel.expt") !== -1) {
      data={
        ...response,
      }
    }

    if (response.config.url.indexOf("/gateway/downloadxmi.expt") !== -1) {
      data={
        ...response,
      }
    }

    return Promise.resolve({
      success: true,
      message: statusText,
      statusCode: status,
      ...data,
    })

}).catch(
    (error) => {
      const { response } = error
      let msg
      let statusCode
      if (response && response instanceof Object) {
        const { data, statusText } = response
        statusCode = response.status
        msg = data.message || statusText
      } else {
        statusCode = 600
        msg = error.message || 'Network Error'
      }
      message.error('[' + statusCode + ']--' + msg)
      /* eslint-disable */
      return Promise.reject({ success: false, statusCode, message: msg })
    })
}
