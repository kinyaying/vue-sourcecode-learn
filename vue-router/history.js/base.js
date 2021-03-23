import { Vue } from '../install'

// 路由公共方法
export default class History {
  constructor(router) {
    this.router = router

    // 保存路径变化
    this.current = createRoute(null, { path: '/' })
  }
  transtionTo(path, cb) {
    let record = this.router.match(path) //匹配到后
    let route = createRoute(record, { path })
    // 两次跳转路径一致，不跳转, 比对长度防止第一次跳转不走cb
    if (
      path === this.current.path &&
      route.matched.length == this.current.matched.length
    ) {
      return
    }

    // if (this.current.path == path) {
    //   return
    // }
    // 把current变成响应式，后期更改current更新视图
    // Vue.util.defineReactive(obj,key,value,fn)
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

    runQueue(this.router.beforeHooks, iterator, () => {
      this.updateRoute(route)
      cb && cb()
    })
  }
  listen(cb) {
    this.cb = cb
  }
  updateRoute(route) {
    this.current = route
    this.cb && this.cb(route) // 改变current 还要改变_route
  }
}
// 创建路由

function createRoute(record, location) {
  const matched = []
  if (record) {
    while (record) {
      matched.unshift(record)
      record = record.parent
    }
  }
  // {path: '/', matched: []}
  return {
    ...location,
    matched: matched,
  }
}
