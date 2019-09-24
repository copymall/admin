import router from './router';
import store from './store';
import NProgress from 'nprogress';
import {getToken} from "@/utils/auth";
import {Message} from "element-ui";

const whiteList = ['/login'];

router.beforeEach((to, from, next) => {
    NProgress.start()
    if(getToken()) {
        if(to.path === '/login') {
            next({path:'/'})
            NProgress.done();
        }else {
            if(store.getters.roles.length === 0) {
                store.dispatch('GetInfo').then(()=>{
                    next()
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(()=>{
                        Message.error(err||"Verification failed, please login again")
                        next({path:'/'})
                    })
                })
            }else {
                next();
            }
        }
    }else {
        if(whiteList.indexOf(to.path) !== -1) {
            next()
        }else {
            next("/login")
            NProgress.done()
        }
    }
})

router.afterEach(()=>{
    NProgress.done()
})
