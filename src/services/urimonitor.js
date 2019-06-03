import { request } from 'utils'

export async function getTableList(params) {
    return request({
        url: '/gateway/druid/weburi.json',
        method: 'POST',
        data: params,
    })
}