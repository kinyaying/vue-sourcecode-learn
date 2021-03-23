import History from './base'
function ensureHash() {
  if (window.location.hash === '') {
    window.location.hash = '/'
  }
}
function getHash() {
  return window.location.hash.slice(1)
}
export default class HashHistory extends History {
  constructor(router) {
    super(router)
    // 增加默认hash /#/
    ensureHash()
  }
  getCurrentLocation() {
    return getHash()
  }
  setupListener() {
    window.addEventListener('hashchange', () => {
      // 再去切换组件渲染
      this.transtionTo(getHash())
    })
  }
  pushState(hash) {
    window.location.hash = hash
  }
}
