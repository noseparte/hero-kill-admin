// 引入动态路由表与常量路由表
import {
  asyncRouterMap,
  constantRouterMap
} from 'src/router'
import { getAllMenus } from 'api/login';
/**
 * 通过authority判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.authority) {
    if (menus[route.authority] !== undefined) {
      return menus[route.authority];
    } else {
      return false;
    }
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(asyncRouterMap, menus, menuDatas) {
  // 满足条件添加过滤
  // filter() 方法runoob.com/jsref/jsref-filter.html
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      //  加载路由名字
      route.name = menuDatas[route.authority].title;
      // 加载路由ICON
      route.icon = menuDatas[route.authority].icon;
      // 判断子路由
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus, menuDatas);
      }
      return true
    }
    return false
  })
  // 返回路由表
  return accessedRouters
}

// 定义权限常量
const permission = {
  // 状态
  state: {
    // 常量路由表
    routers: constantRouterMap,
    // 添加路由（动态路由表）
    addRouters: []
  },
  // 状态修改
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({
      commit
    }, menus) {
      // 开始异步加载路由
      return new Promise(resolve => {
        // 开始获取菜单
        getAllMenus().then(data => {
          // 定义常量菜单数组
          const menuDatas = {};
          //  开始获取菜单
          for (let i = 0; i < data.length; i++) {
            menuDatas[data[i].code] = data[i];
          }
          // 生成动态路由表
          const accessedRouters = filterAsyncRouter(asyncRouterMap, menus, menuDatas);
          console.log('-------->accessedRouters:');
          console.log(accessedRouters);
          console.log('<--------accessedRouters:');
          // 同步设置动态路由表
          commit('SET_ROUTERS', accessedRouters);
          resolve();
        });
      })
    }
  }
};

export default permission;
