import Vue from 'vue'
import VueRouter from 'vue-router'

//懒加载引入
const index = ()=> import('../views/index')

Vue.use(VueRouter)

const routes = [
    {
        path:'/',
        name:"title",
        title:"cy",
        component:index,      //还是会先加载它
        meta: {
            title: '首页入口'
        }
        
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
