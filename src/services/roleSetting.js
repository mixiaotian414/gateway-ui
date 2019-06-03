import {request,config} from 'utils'

const {api} =config
const {roleSetting} = api

export async function query (params) {
  return request({
    url: roleSetting,
    method: 'post',
    data:params,
  })
}
export async function deleteRole (params) {

  return request({
    url: '/gateway/roledel.json',
    method: 'post',
    data: params,
  })
}
export async function addRole (params) {

  return request({
    url: '/gateway/roleadd.json',
    method: 'post',
    data: params,
  })
}
export async function updateRole (params) {

  return request({
    url: '/gateway/rolesaveInfo.json',
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {

  return request({
    url: 'gateway/roleinfo.json',
    method: 'post',
    data: params,
  })
}
export async function menuTree (params) {

  return request({
    url: 'gateway/menusyntree.json',
    method: 'post',
    data: params,
  })
}
export async function menuChecked (params) {

  return request({
    url: 'gateway/menuchecked.json',
    method: 'post',
    data: params,
  })
}
export async function queryMenuItem (params) {

  return request({
    url: 'gateway/menuedit.json',
    method: 'post',
    data: params,
  })
}
export async function funcTree (params) {

  return request({
    url: 'gateway/functiontree.json',
    method: 'post',
    data: params,
  })
}
export async function funcChecked (params) {

  return request({
    url: 'gateway/functionchecked.json',
    method: 'post',
    data: params,
  })
}
export async function queryFuncItem (params) {

  return request({
    url: 'gateway/functionload.json',
    method: 'post',
    data: params,
  })
}
export async function rmsave (params) {

  return request({
    url: 'gateway/rolermsave.json',
    method: 'post',
    data: params,
  })
}
export async function frsave (params) {

  return request({
    url: 'gateway/rolefrsave.json',
    method: 'post',
    data: params,
  })
}
export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
