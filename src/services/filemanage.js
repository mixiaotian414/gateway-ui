import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/metadatalist.json',
    method: 'post',
    data:params,
  })
}
export async function LoadReport(params) {
  return request({
    url: '/gateway/downloadxmi.expt',
    method: 'postfile',
    data:params,
  })
}

