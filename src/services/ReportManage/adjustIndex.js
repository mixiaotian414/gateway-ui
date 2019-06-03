import {request,config} from 'utils'

const {api} =config


export async function query (params) {
  return request({
    url:  '/gateway/derivedatalist.json',
    method: 'post',
    data:params,
  })
}


export async function create (params) {
  return request({
    url:  '/gateway/derivedataupdate.json',
    method: 'post',
    data: params,
  })
}
