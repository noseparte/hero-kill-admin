// 引入cookies
import Cookies from 'js-cookie';

// 定义常量app
const app = {
  // 状态
  state: {
    // 侧边栏
    sidebar: {
      // 是否打开侧边栏
      opened: !+Cookies.get('sidebarStatus')
    },
    // 主题（可以后面切换）
    theme: 'default',
    // 存活的新的通道（我猜测是wedsocket使用，用来做消息盒子）
    livenewsChannels: Cookies.get('livenewsChannels') || '[]',
    // 多标签视图，存放所有浏览过的且不重复的路由数据
    visitedViews: []
  },
  // 修改状态,里面装着一些改变数据方法的集合这是Veux设计很重要的一点，
  // 就是把处理数据逻辑方法全部放在mutations里面，使得数据和视图分离。切记：Vuex中store数据改变的唯一方法就是mutation！
  mutations: {
    // 切换侧边栏
    TOGGLE_SIDEBAR: state => {
      // 如果侧边栏是打开
      if (state.sidebar.opened) {
        // cookies存储侧边栏状态为1（sidebarStatus--->1）
        Cookies.set('sidebarStatus', 1);
      } else {
        // cookies存储侧边栏状态为0（sidebarStatus--->0）
        Cookies.set('sidebarStatus', 0);
      }
      // 状态变化
      state.sidebar.opened = !state.sidebar.opened;
    },
    // 打开新页签--添加路由数据的方法
    ADD_VISITED_VIEWS: (state, view) => {
      // 通过some方法检查视图是否已经打开，有就直接返回
      if (state.visitedViews.some(v => v.path === view.path)) return
      // 没有就将视图存入visitedViews
      state.visitedViews.push({ name: view.name, path: view.path })
    },
    // 关闭页签
    DEL_VISITED_VIEWS: (state, view) => {
      // 定义一个块级区域的变量index，用来记录要关闭的标签页标号
      let index
      // 循环进行获取视图数组的索引与值
      // entries的方法介绍https://www.runoob.com/jsref/jsref-entries.html
      for (const [i, v] of state.visitedViews.entries()) {
        // 当v的路径与视图路径相等
        if (v.path === view.path) {
          // 将索引i赋值给index，然后跳出循环
          index = i
          break
        }
      }
      // 删除数组里面的项目，
      // splice方法介绍https://www.w3school.com.cn/jsref/jsref_splice.asp
      state.visitedViews.splice(index, 1)
    }
  },
  // 动作，提供对外方法commit：同步操作，dispatch：含有异步操作，
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    addVisitedViews: ({ commit }, view) => {
      commit('ADD_VISITED_VIEWS', view)
    },
    delVisitedViews: ({ commit }, view) => {
      commit('DEL_VISITED_VIEWS', view)
    }
  }
};

// es6写法，导出常量app
export default app;
