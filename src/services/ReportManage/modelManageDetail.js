import {request,config} from 'utils'

const {api} =config

export async function query (data) {
  /*  let data ={
      ...params,
      ...pagecommen,
      "PARAMS":{"paraCode":"200005"}
    }*/

  return request({
    url: '/gateway/reportanalysis.json',
    method: 'post',
    data,
  })
}
export async function queryColumn (data) {

  return request({
    url: '/gateway/reportsearchlist.json',
    method: 'post',
    data,
  })
}
