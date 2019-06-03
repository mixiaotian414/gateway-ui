import { request, config } from 'utils'

const { api } = config
const { menumanage } = api

export async function querylist (params) {
  return request({
    url: menumanage,
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {
  return request({
    url: '/gateway/menuedit.json',
    method: 'post',
    data: params,
  })
}
export async function del (params) {
  return request({
    url:  '/gateway/menudel.json',
    method: 'post',
    data: params,
  })
}

export async function add (params) {
  return request({
    url: '/gateway/menuadd.json',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/gateway/menusave.json',
    method: 'post',
    data: params,
  })
}
//路由
export async function queryrutelist (params) {
  return request({
    url: '/gateway/routelist.json',
    method: 'post',
    data: params,
  })
}
//路由绑定
export async function routebind (params) {
  return request({
    url: '/gateway/menumenuroute.json',
    method: 'post',
    data: params,
  })
}
//角色
export async function queryPersonnelrole (params) {
  return request({
    url: '/gateway/menumenurole.json',
    method: 'post',
    data: params,
  })
}
//路由选中
export async function menucheck_menu (params) {
  return request({
    url: '/gateway/menucheckmenu.json',
    method: 'post',
    data: params,
  })
}
export async function getSelectList(params) {
  return request({
    url: '/gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
