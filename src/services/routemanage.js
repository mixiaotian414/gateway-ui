import { request, config } from 'utils'

const { api } = config
const { secdictselect, validateVal } = api

export async function getTableList(params) {
  return request({
    url: '/gateway/routelist.json',
    method: 'POST',
    data: params,
  })
}
export async function getSelectList(params) {
  return request({
    url: secdictselect,
    method: 'POST',
    data: params,
  })
}
export async function newTableList(params) {
  return request({
    url: '/gateway/routeadd.json',
    method: 'POST',
    data: params,
  })
}
export async function updTable(params) {
  return request({
    url: '/gateway/routeload.json',
    method: 'POST',
    data: params,
  })
}
export async function updTableList(params) {
  return request({
    url: '/gateway/routesave.json',
    method: 'POST',
    data: params,
  })
}
export async function delTableList(params) {
  return request({
    url: '/gateway/routedel.json',
    method: 'POST',
    data: params,
  })
}
export async function onlyCheck(params) {
  return request({
    url: validateVal,
    method: 'POST',
    data: params,
  })
}