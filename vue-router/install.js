import RouterView from './components/router-view'
import RouterLink from './components/router-link'
export let Vue = null
export default function install(_vue) {
  Vue = _vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 根组件
        this._router = this.$options.router // router实例
        this._routerRoot = this // vue实例
        this._router.init(this)
        //this._router.history.current
        Vue.util.defineReactive(
          this,
          '_route',
          this._router.history.current,
          () => {}
        )
      } else {
        //子组件
        this._routerRoot = this.$parent && this.$parent._routerRoot
      }
    },
  })

  Object.defineProperty(Vue.prototype, '$router', {
    // 方法
    get() {
      return this._routerRoot._router
    },
  })
  Object.defineProperty(Vue.prototype, '$route', {
    // 属性 -> this.current
    get() {
      return this._routerRoot._route
    },
  })
  Vue.component('router-view', RouterView)
  Vue.component('router-link', RouterLink)
}
