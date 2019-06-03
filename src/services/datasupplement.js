import {request} from 'utils'

export async function add (params) {
  return request({
    url: '/gateway/recordadd.json',
    method: 'post',
    data: params,
  })
}

export async function del (params) {
  return request({
    url: '/gateway/recorddel.json',
    method: 'POST',
    data: params,
  })
}

export async function update (params) {
  return request({
    url: '/gateway/recordsave.json',
    method: 'post',
    data: params,
  })
}

export async function query (params) {
  return request({
    url:  '/gateway/recordlist.json',
    method: 'post',
    data:params,
  })
}
