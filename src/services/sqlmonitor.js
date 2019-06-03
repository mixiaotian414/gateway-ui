import { request } from 'utils'

export async function getTableList(params) {
    return request({
        url: '/gateway/druid/sql.json',
        method: 'POST',
        data: params,
    })
}