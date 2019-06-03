import { request, config } from 'utils'

const { api } = config
const { dashboard } = api

export function query (params) {
  return request({
    url: dashboard,
    method: 'get',
    data: params,
  })
}
export function queryloglist (params) {
  return request({
    url: '/gateway/homesysloglist.json',
    method: 'post',
    data: params,
  })
}
export function queryloglistbytime (params) {
  return request({
    url: '/gateway/homesysloglistbytime.json',
    method: 'post',
    data: params,
  })
}

export function querynotifylist (params) {
  return request({
    url: '/gateway/homenotifylist.json',
    method: 'post',
    data: params,
  })
}
