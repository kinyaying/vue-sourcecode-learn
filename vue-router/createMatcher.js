import { createRouteMap } from './create-route-map'

export function createMatcher(routes) {
  let { pathMap } = createRouteMap(routes)
  // pathMap中找对应的路由
  function match(path) {
    return pathMap[path]
  }
  // 动态路由，将新路由插入老路由的映射表中
  function addRoutes(routes) {
    createMatcher(routes, pathMap)
  }
  return {
    addRoutes, // 动态路由，将新路由插入老路由的映射表中
    match,
  }
}
