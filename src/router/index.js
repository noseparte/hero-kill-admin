import Vue from 'vue';
// 导入路由组件
import Router from 'vue-router';
// process.env是读取系统环境变量的，比如你在启动服务的时候，设置环境变量为production或者development，
// 那么在程序里面就可以通过process.env.NODE_ENV获取。
// 此时你就需要再写两个文件(注意文件的名称命名)分别导出不同环境下的文件目录如：
// eslint-disable-next-line no-irregular-whitespace
// *_production.js:   module.exports = file => () => import('@/pages/' + file + '.vue')
// eslint-disable-next-line no-irregular-whitespace
// *_develope.js:   module.exports = file =>  import('@/pages/' + file + '.vue')
const _import = require('./_import_' + process.env.NODE_ENV);
// 在开发环境中不使用延迟加载，因为延迟加载大页面会导致网页包热更新太慢。所以只有在生产环境中使用延迟加载

// 加载路由
Vue.use(Router);

// 基础布局
/* layout */
import Layout from '../views/layout/Layout';

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will no redirct in the levelbar
 * noDropdown : if `noDropdown:true` will has no submenu
 * meta : { role: ['admin'] }  will control the page role
 **/
// 不需要动态判断权限的路由
export const constantRouterMap = [{
  path: '/login',
  // 懒加载页面
  component: _import('login/index'),
  // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
  hidden: true
},
{
  path: '/authredirect',
  component: _import('login/authredirect'),
  hidden: true
},
{
  path: '/404',
  component: _import('error/404'),
  hidden: true
},
{
  path: '/401',
  component: _import('error/401'),
  hidden: true
},
{
  path: '/',
  component: Layout,
  redirect: '/dashboard',
  name: '首页',
  hidden: true,
  children: [{
    path: 'dashboard',
    component: _import('dashboard/index')
  }]
},
{
  path: '/introduction',
  component: Layout,
  redirect: '/introduction/index',
  icon: 'form',
  noDropdown: true,
  children: [{
    path: 'index',
    component: _import('introduction/index'),
    name: '简述'
  }]
}
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({
    y: 0
  }),
  // 路由列表
  routes: constantRouterMap
});

// 动态路由
export const asyncRouterMap = [{
  path: '/baseManager',
  component: Layout,
  name: '基础配置管理',
  icon: 'setting',
  // 服务编码
  authority: 'baseManager',
  children: [{
    path: 'userManager',
    icon: 'fa-user',
    component: _import('admin/user/index'),
    name: '用户管理',
    authority: 'userManager'
  }, {
    path: 'menuManager',
    icon: 'category',
    component: _import('admin/menu/index'),
    name: '菜单管理',
    authority: 'menuManager'
  }, {
    path: 'groupManager',
    icon: 'group_fill',
    component: _import('admin/group/index'),
    name: '角色权限管理',
    authority: 'groupManager'
  }, {
    path: 'groupTypeManager',
    icon: 'fa-users',
    component: _import('admin/groupType/index'),
    name: '角色类型管理',
    authority: 'groupTypeManager'
  }, {
    path: 'gateLogManager',
    icon: 'viewlist',
    component: _import('admin/gateLog/index'),
    name: '操作日志管理',
    authority: 'gateLogManager'
  }]
},
{
  path: '/authManager',
  component: Layout,
  name: '服务管理',
  icon: 'setting',
  authority: 'authManager',
  children: [{
    path: 'serviceManager',
    component: _import('auth/service/index'),
    name: '服务权限管理',
    authority: 'serviceManager'
  }, {
    path: 'test1235',
   // component: _import('auth/test1235/index'),
    name: '测试服务',
    authority: 'test1235'
  }]
},
{
  path: '/monitorManager',
  component: Layout,
  name: '监控模块管理',
  icon: 'integral',
  authority: 'monitorManager',
  children: [{
    path: 'serviceEurekaManager',
    component: _import('monitor/eureka/index'),
    name: 'Eureka注册中心',
    authority: 'serviceEurekaManager'
  }, {
    path: 'serviceMonitorManager',
    component: _import('monitor/service/index'),
    name: '服务状态监控',
    authority: 'serviceMonitorManager'
  }, {
    path: 'serviceZipkinManager',
    component: _import('monitor/zipkin/index'),
    name: '服务状态监控',
    authority: 'serviceZipkinManager'
  }]
}];

/*  新增服务示例
{
  //浏览器显示父路径(数据库对应path)
  path: '/authManager',
  //加载布局页面
  component: Layout,
  //服务名字
  name: '服务管理',
  //icon https://www.iconfont.cn/  图标库
  icon: 'setting',
  //服务编码
  authority: 'authManager',
  //子菜单
  children: [{
    //浏览器显示路径（数据库对应path）
    path: 'serviceManager',
    //挂载页面
    component: _import('auth/service/index'),
    //服务名字
    name: '服务权限管理',
    //服务编码
    authority: 'serviceManager'
  }]
},
*/