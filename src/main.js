import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

//引入 Element Ui 以及样式
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

// svg
import('@/icons')


/*//iview
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';*/


// clipboard
import clipboard from 'clipboard'
Vue.prototype.clipboard = clipboard


import vuescroll from "vuescroll";//引入vuescroll
import "vuescroll/dist/vuescroll.css";//引入vuescroll样式

Vue.use(ElementUI)
/*Vue.use(ViewUI);*/
// 你可以在这里设置全局配置
Vue.use(vuescroll, {
  ops: {}, // 在这里设置全局默认配置
  name: 'vue-scroll' // 在这里自定义组件名字，默认是vueScroll
});


Vue.config.productionTip = false

//根据路由设置标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
