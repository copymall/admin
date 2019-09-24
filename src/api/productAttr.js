import request from '../utils/request'

export function fetchList(cid, params) {
    return request({
        url:'/productAttribute/list/'+cid,
        method:'get',
        params:params
    })
}