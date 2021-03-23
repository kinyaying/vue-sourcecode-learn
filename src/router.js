import Vue from 'vue'
// import VueRouter from 'vue-router'
// import VueRouter from '../vue-router/index.js'
import VueRouter from '../vue-router/vue-router.min.js'
import Foo from './pages/foo.vue'
import Bar from './pages/bar.vue'
Vue.use(VueRouter)
const routes = [
  {
    path: '/foo',
    component: Foo,
    children: [
      {
        path: 'test',
        component: {
          render: (h) => <h1>test</h1>,
        },
      },
    ],
  },
  {
    path: '/bar',
    component: Bar,
    children: [
      {
        path: 'a',
        component: {
          render: (h) => <h1>aaa</h1>,
        },
      },
      {
        path: 'b',
        component: {
          render: (h) => <h1>bbb</h1>,
        },
      },
    ],
  },
]
const router = new VueRouter({
  mode: 'history',
  routes,
})
// 当导航变化时 会依次执行这两个方法
router.beforeEach((from, to, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})
router.beforeEach((from, to, next) => {
  setTimeout(() => {
    next()
  }, 1000)
})

export default router
