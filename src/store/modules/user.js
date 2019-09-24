import {getToken, removeToken} from "@/utils/auth";
import {getInfo, login} from "../../api/login";
import {setToken} from "../../utils/auth";

const user = {
    state: {
        token: getToken(),
        name:'',
        avatar: '',
        roles:[]
    },

    mutations: {
        SET_TOKEN:(state, token) => {
          state.token = token
        },
        SET_NAME:(state, name) => {
            state.name = name
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_ROLES:(state, roles) => {
            state.roles = roles
        }
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim()
            return new Promise((resolve, reject) => {
                login(username, userInfo.password).then(response => {
                    const data = response.data
                    const tokenStr = data.tokenHead+data.token
                    setToken(tokenStr)
                    commit('SET_TOKEN', tokenStr)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },

        GetInfo({commit}) {
            return new Promise((resolve, reject)=>{
                getInfo().then(response => {
                    const data = response.data
                    if(data.roles && data.roles.length > 0) {
                        commit('SET_ROLES', data.roles)
                    }else {
                        reject('getInfo: roles must be a non-null array !')
                    }

                    commit('SET_NAME', data.username)
                    commit('SET_AVATAR', data.icon)
                    resolve(response)
                }).catch(error=>{
                    reject(error)
                })
            })
        },

        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit("SET_TOKEN", "")
                removeToken()
                resolve()
            })
        }
    }
}

export default user
