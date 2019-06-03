import { request, config } from 'utils'

const { api } = config
const { userSetting, userSettingDel} = api

export async function query (params) {
  return request({
    url: '/gateway/paramlist.json',
    method: 'post',
    data: params,
  })


}

export async function del (params) {
  return request({
    url: '/gateway/paramdel.json',
    method: 'post',
    data: params,
  })
}



export async function queryid (params) {
  return request({
    url: '/gateway/paramload.json',
    method: 'post',
    data: params,
  })
}
export async function create (params) {
  return request({
    url: '/gateway/paramadd.json',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/gateway/paramedit.json',
    method: 'post',
    data: params,
  })
}
