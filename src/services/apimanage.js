import { request, config } from 'utils'

const { api } = config
const { secdictselect, validateVal } = api

export async function getSelectList(params) {
  return request({
    url: secdictselect,
    method: 'POST',
    data: params,
  })
}
export async function getTableList(params) {
  return request({
    url: '/gateway/apilist.json',
    method: 'POST',
    data: params,
  })
}
export async function delTableList(params) {
  return request({
    url: '/gateway/apidelete.json',
    method: 'POST',
    data: params,
  })
}
export async function newTableList(params) {
  return request({
    url: '/gateway/apiadd.json',
    method: 'POST',
    data: params,
  })
}
export async function updTable(params) {
  return request({
    url: '/gateway/apiload.json',
    method: 'POST',
    data: params,
  })
}
export async function updTableList(params) {
  return request({
    url: '/gateway/apisave.json',
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
