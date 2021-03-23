export function createRouteMap(routes, oldPathMap) {
  let pathMap = oldPathMap || {}
  routes.forEach((route) => {
    addRouteRecord(route, pathMap)
  })
  return { pathMap }
}

function addRouteRecord(route, pathMap, parent) {
  let path = parent ? parent.path + '/' + route.path : route.path
  let record = {
    path,
    component: route.component,
    parent,
  }
  pathMap[path] = record
  route.children &&
    route.children.forEach((childRoute) => {
      addRouteRecord(childRoute, pathMap, record)
    })
}
