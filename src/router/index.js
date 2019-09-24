import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout';

export const constantRouterMap = [
    {
        path:'',
        component: Layout,
        redirect: '/home',
        children: [{
            path: 'home',
            name: 'home',
            component: ()=> import('@/views/home/index'),
            meta: {title: '首页', icon: 'home'}
        }]
    }
]

export default new Router({
    scrollBehavior: ()=>({y:0}),
    routes: constantRouterMap
})
