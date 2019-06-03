import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/gateway/indexbloodquery.json',
    method: 'post',
    data: params,
  })
}
export async function getIndexType(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
