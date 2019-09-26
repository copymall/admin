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
        }, {
            path:'addProduct',
            name: 'addProduct',
            component:()=>import('@/views/pms/product/add'),
            meta:{title:'添加商品', icon:'product-add'}
        }, {
            path:'updateProduct',
            name: 'updateProduct',
            component: ()=> import('@/views/pms/product/update'),
            meta:{title:'修改商品', icon:'product-add'},
            hidden: true
        }, {
            path:'productCate',
            name:'productCate',
            component:()=>import('@/views/pms/productCate/index'),
            meta:{title:'商品分类',icon:'product-cate'}
        }]
    },
    {
        path:'/oms',
        component:Layout,
        redirect:'/oms/order',
        name:'oms',
        meta:{title:'订单',icon:'order'},
        children:[
            {
                path:'order',
                name:'order',
                component:()=>import('@/views/oms/order/index'),
                meta: {title: '订单列表',icon:'product-list'}
            },
        ]
    }
]

export default new Router({
    scrollBehavior: ()=>({y:0}),
    routes: constantRouterMap
})
