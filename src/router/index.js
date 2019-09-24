import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '../views/layout/Layout';
import Login from  '../views/login'

export const constantRouterMap = [
    {path: '/login', component: Login, hidden: true},
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
    },
    {path:'/pms',
        component:Layout,
        redirect: '/pms/product',
        name: 'pms',
        meta: {title: '商品', icon: 'product'},
        children: [{
            path: 'product',
            name: 'product',
            component: ()=> import('@/views/pms/product/index'),
            meta: {title: '商品列表', icon: 'product-list'}
        },
            {
                path: 'product',
                name: 'product',
                component: ()=> import('@/views/pms/product/index'),
                meta: {title: '商品列表2', icon: 'product-list'}
            }]
    }
]

export default new Router({
    scrollBehavior: ()=>({y:0}),
    routes: constantRouterMap
})
