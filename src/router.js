import Vue from 'vue'
import VueRouter from 'vue-router'
import Foo from './pages/foo.vue'
import Bar from './pages/bar.vue'
Vue.use(VueRouter)
const routes = [
  { path: '/foo', component: Foo },
  { path: '/bar', component: Bar },
]
// const routes = new VueRouter(routesConfig)
const router = new VueRouter({
  routes, // (缩写) 相当于 routes: routes
})

export default router
