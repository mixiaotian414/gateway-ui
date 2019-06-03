import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/reportquery.json',
    method: 'post',
    data:params,
  })
}

export async function del (params) {
  return request({
    url: '/gateway/reportfiledel.json',
    method: 'POST',
    data: params,
  })
}
