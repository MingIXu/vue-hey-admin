import {
  asyncRoutes,
  constantRoutes
} from '@/router'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routers 后台返回路由数据
 */
export function filterRouters(routers) {
  const result = []
  routers.forEach(route => {
    const tmp = {
      hidden: route.hidden,
      path: route.path,
      component: route.component,
      redirect: route.redirect ? route.redirect : 'noredirect',
      name: route.name,
      alwaysShow: route.alwaysShow,
      meta: {
        title: route.title,
        icon: route.icon,
        roles: route.roles,
        noCache: route.noCache,
        breadcrumb: route.breadcrumb
      }
    }
    if (route.children) {
      tmp.children = filterRouters(route.children)
    }
    result.push(tmp)
  })
  return result
}
const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes({
    commit
  }, roles) {
    return new Promise(resolve => {
      let accessedRoutes
      if (roles.includes('admin')) {
        accessedRoutes = asyncRoutes || []
      } else {
        accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
      }
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
