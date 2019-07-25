import {
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
 * 处理后台返回路由数据
 * @param routers 后台返回路由数据
 */
export function filterRouters(routers) {
  const result = []
  routers.forEach(route => {
    let tmp
    if (route.pid === 0 || route.children) {
      tmp = {
        path: route.path,
        component: route.component,
        redirect: route.redirect ? route.redirect : 'noredirect',
        name: route.name,
        alwaysShow: route.alwaysShow,
        meta: {
          title: route.title,
          icon: route.icon
        }
      }
    } else {
      tmp = {
        path: route.path,
        component: route.component,
        name: route.name,
        meta: {
          title: route.title
        }
      }
    }
    if (route.children) {
      tmp.children = filterRouters(route.children)
    }
    result.push(tmp)
  })
  return result
}

/**
 * 处理后台返回路由中目录数据
 * @param directory 目录数据
 */
export function filterDirectory(directory) {
  let result = []
  directory.map(m1 => {
    directory.map(m2 => {
      if (m1.id === m2.pid) {
        m1.children.unshift(m2)
      }
    })
  })
  result = directory.filter(v => v.pid === 0)
  return result
}
const state = {
  routes: [],
  addRoutes: [],
  permissionButtons: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  },
  SET_PERMISSIONBUTTONS: (state, permissionButtons) => {
    state.permissionButtons = permissionButtons
  }
}

const actions = {
  generateRoutes({
    commit
  }, user) {
    return new Promise(resolve => {
      const {
        permissionRouter
      } = user
      const directory = permissionRouter.filter((item) => item.type === 1) // 目录
      const menu = permissionRouter.filter((item) => item.type === 2) // 菜单
      // Filter menu
      directory.map(d => {
        const children = []
        menu.map(m => {
          if (d.id === m.pid) {
            children.push(m)
          }
        })
        d.children = children
      })
      // Filter directory
      const accessedRoutes = filterRouters(filterDirectory(directory))

      commit('SET_ROUTES', accessedRoutes)
      // Filter buttons
      const filterButtons = permissionRouter.filter((item, index, arr) => item.type === 3) // 按钮
      const permissionButtons = []
      filterButtons.map(p => {
        permissionButtons.push(p.permissionValue)
      })
      console.log(filterButtons)
      commit('SET_PERMISSIONBUTTONS', permissionButtons)
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
