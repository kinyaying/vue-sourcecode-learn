import Bar from '../../src/pages/bar'
export default {
  functional: true,
  render(h, { parent, data }) {
    // current ->$route
    let route = parent.$route // 获取current
    // 将matched依次给router-view  先父后子
    // 父 * - 父 -子
    let depth = 0
    while (parent) {
      // 1. 得是组件
      if (parent.$vnode && parent.$vnode.data.routerView) {
        depth++
      }
      parent = parent.$parent
    }
    let record = route.matched[depth]

    if (!record) {
      return h()
    }
    data.routerView = true
    return h(record.component, data)
  },
}
