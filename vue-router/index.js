import { createMatcher } from './createMatcher'
import HTML5History from './history.js/h5'
import HashHistory from './history.js/hash'
import install, { Vue } from './install'
class VueRouter {
  constructor(options = {}) {
    const routes = options.routes
    this.mode = options.mode || 'hash'
    this.matcher = createMatcher(options.routes || []) // matcher + addRoutes
    // 根据hash或history实现不同路由系统
    // hash history base
    switch (this.mode) {
      case 'hash':
        this.history = new HashHistory(this)
        break
      case 'history':
        this.history = new HTML5History(this)
        break
    }
    this.beforeHooks = []
  }
  init(app) {
    const history = this.history
    const setupListener = () => {
      history.setupListener()
    }
    // 跳转到某个路径
    history.transtionTo(history.getCurrentLocation(), setupListener)
    history.listen((route) => {
      // current变化，给_route赋值
      app._route = route
    })
  }
  match(location) {
    return this.matcher.match(location)
  }
  push(location) {
    this.history.transtionTo(location, () => {
      // window.location.hash = location
      this.history.pushState(location)
    })
  }
  beforeEach(hook) {
    this.beforeHooks.push(hook)
  }
}

VueRouter.install = install

export default VueRouter
/**
 * $router $route
 * 组件：router-link router-view
 *
 *  Vue.use()
 * 1. 注册两个全局组件 router-link router-view
 * 2. $router $route是属性，通过defineProperty绑定到vue.prototype上
 *
 */
