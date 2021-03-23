export let Vue

let pathMap = {}
function createMatcher(routes, parent = null) {
  routes.forEach((route) => {
    let path = parent ? `${parent.path}/${route.path}` : route.path
    pathMap[path] = {
      path,
      component: route.component,
      parent,
    }
    if (route.children) {
      createMatcher(route.children, route)
    }
  })

  function match(path) {
    return pathMap[path]
  }
  return { match }
}
function createRoute(record, location) {
  let matched = []
  if (record) {
    while (record) {
      matched.unshift(record)
      record = record.parent
    }
  }

  return {
    ...location,
    matched,
  }
}
function getCurrentLocation() {
  return location.hash.slice(1)
}
let START
export default class VueRouter {
  constructor(options) {
    this.matcher = createMatcher(options.routes)
    START = this.current = createRoute(null, { path: '/' })
    this.hooks = []
  }
  init(app) {
    this.cb = (route) => {
      // current变化，给_route赋值
      app._route = route
    }
    this.transtionTo(getCurrentLocation(), this.setupListener)
  }

  transtionTo(path, cb) {
    let record = this.matcher.match(path) //匹配到后
    let route = createRoute(record, { path })
    // 两次跳转路径一致，不跳转, 比对长度防止第一次跳转不走cb
    if (path === this.current.path && START !== this.current) {
      return
    }
    // 把current变成响应式，后期更改current更新视图
    const iterator = (hook, next) => {
      hook(this.current, route, () => {
        next()
      })
    }
    function runQueue(queue, iterator, cb) {
      // 异步迭代
      function step(index) {
        // 可以实现中间件逻辑
        if (index >= queue.length) return cb()
        let hook = queue[index] // 先执行第一个 将第二个hook执行的逻辑当做参数传入
        iterator(hook, () => step(index + 1))
      }
      step(0)
    }

    runQueue(this.hooks, iterator, () => {
      this.updateRoute(route)
      cb && cb.apply(this)
    })
  }

  updateRoute(route) {
    this.cb && this.cb(route)
    this.current = route
  }
  setupListener() {
    window.addEventListener('hashchange', () => {
      this.transtionTo(getCurrentLocation())
    })
  }
  push(location) {
    this.transtionTo(location, () => {
      window.location.hash = location
    })
  }
  beforeEach(hook) {
    this.hooks.push(hook)
  }
}
VueRouter.install = function(_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate() {
      if (this.$options.router) {
        // 根
        this._router = this.$options.router
        this._routerRoot = this
        this._router.init(this)
        Vue.util.defineReactive(this, '_route', this._router.current, () => {})
      } else {
        //子
        this._routerRoot = this.$parent ? this.$parent._routerRoot : null
      }
    },
  })

  Vue.component('router-view', {
    functional: true,
    render(h, { parent, data }) {
      let route = parent.$route
      let depth = 0
      data.routerView = true
      while (parent) {
        // 根据matched 渲染对应的router-view
        if (parent.$vnode && parent.$vnode.data.routerView) {
          depth++
        }
        parent = parent.$parent
      }
      let record = route.matched[depth]
      if (!record) {
        return h()
      }
      return h(record.component, data)
    },
  })

  Vue.component('router-link', {
    props: {
      to: {
        require: true,
        type: String,
      },
    },
    render() {
      let click = () => {
        this.$router.push(this.to)
      }
      return <a onClick={click}>{this.$slots.default}</a>
    },
  })
  Object.defineProperty(Vue.prototype, '$route', {
    get() {
      return this._routerRoot._route
    },
  })
  Object.defineProperty(Vue.prototype, '$router', {
    get() {
      return this._routerRoot._router
    },
  })
}
