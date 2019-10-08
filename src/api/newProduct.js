import request from "../utils/request";

export function fetchList(params) {
    return request({
        url:'/home/newProduct/list',
        method:'get',
        params: params
    })
}

export function updateRecommendStatus(params) {
    return request({
        url:'/home/newProduct/update/recommendStatus',
        method:'post',
        data: params
    })
}

export function deleteNewProduct(params) {
    return request({
        url:'/home/newProduct/delete',
        method:'post',
        data:params
    })
}

export function updateNewProductSort(params) {
    return request({
        url:'/home/newProduct/update/sort/'+params.id,
        method:'post',
        data:params
    })
}

export function createNewProduct(data) {
    return request({
        url:"/home/newProduct/create",
        method:'post',
        data: data
    })
}
