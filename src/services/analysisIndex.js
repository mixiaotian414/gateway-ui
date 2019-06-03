import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/demolist.json',
    method: 'post',
    data:params,
  })
}
