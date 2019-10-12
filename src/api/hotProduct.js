import request from "../utils/request";

export function fetchList(params) {
    return request({
        url:"/home/recommendProduct/list",
        method:'get',
        params:params
    })
}

export function updateRecommendStatus(params) {
    return request({
        url:"/home/recommendProduct/update/recommendStatus",
        method:'post',
        data:params
    })
}

export function deleteHotProduct(data) {
    return request({
        url:'/home/recommendProduct/delete',
        method:'post',
        data:data
    })
}

export function updateHotProductSort(params) {
    return request({
        url:"/home/recommendProduct/update/sort/"+params.id,
        method:"post",
        params:params
    })
}

export function createHotProduct(data) {
    return request({
        url:"/home/recommendProduct/create",
        method:'post',
        data:data
    })
}
