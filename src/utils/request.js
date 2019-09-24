import axios from 'axios'

const service = axios.create({
    baseURL:"http://39.98.190.128:8080",
    timeout: 15000
})

service.interceptors.request.use(config => {
    // if(store.getters.token) {
    //     config.headers['Aut']
    // }
})

export default service
