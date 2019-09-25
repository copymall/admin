import request from "../utils/request";

export function fetchListWithChildren() {
    return request({
        url:'/productCategory/list/withChildren',
        method:'get'
    })
}
