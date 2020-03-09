// 引入依赖loginByEmail，logout，getInfo， getMenus
import {
  loginByEmail,
  logout,
  getInfo,
  getMenus
} from 'api/login';
// 引入依赖 getToken,setToken,removeToken
// 在这个js实现用户登录登出，token存储
import {
  getToken,
  setToken,
  removeToken
} from 'utils/auth';

// 定义常量user
const user = {
  // 状态
  state: {
    // 用户
    user: '',
    // 状态
    status: '',
    // 编码
    code: '',
    // token，获取cookie里面获取token
    token: getToken(),
    // 姓名
    name: '',
    // 头像
    avatar: '',
    // 介绍
    introduction: '',
    // 角色
    roles: [],
    // 菜单
    menus: undefined,
    // 元素(目测这个可能是写错了，怕错所以没有删除)
    eleemnts: undefined,
    // 这个是我加的
    elements: undefined,
    // 权限菜单
    permissionMenus: undefined,
    // 设置
    setting: {
      // 文章平台
      articlePlatform: []
    }
  },
  // 修改状态（vue里面好像只能通过mutations才能修改状态，应该是约定吧）
  mutations: {
    // 赋值编码
    SET_CODE: (state, code) => {
      state.code = code;
    },
    // 赋值token
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    // 赋值介绍
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction;
    },
    // 赋值设置
    SET_SETTING: (state, setting) => {
      state.setting = setting;
    },
    // 赋值状态
    SET_STATUS: (state, status) => {
      state.status = status;
    },
    // 赋值名字
    SET_NAME: (state, name) => {
      state.name = name;
    },
    // 赋值头像
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar;
    },
    // 赋值角色
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },
    // 赋值菜单
    SET_MENUS: (state, menus) => {
      state.menus = menus;
    },
    // 赋值元素
    SET_ELEMENTS: (state, elements) => {
      state.elements = elements;
    },
    // 登录成功打印
    LOGIN_SUCCESS: () => {
      console.log('login success')
    },
    // 登出时将用户置空
    LOGOUT_USER: state => {
      state.user = '';
    },
    // 设置用户权限菜单
    SET_PERMISSION_MENUS: (state, permissionMenus) => {
      state.permissionMenus = permissionMenus;
    }
  },

  // 动作（个人理解：与外部程序发生互动的部分）
  actions: {
    // 邮箱登录,(login.js被调用完成初始化)
    LoginByEmail({
      commit
    }, userInfo) {
      // 赋值名字，同时进行修正名字前后空格
      // trim用法https://www.runoob.com/jsref/jsref-trim.html
      const username = userInfo.username.trim();
      // 同步token，roles，menus，elements四个状态
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      commit('SET_MENUS', undefined);
      commit('SET_ELEMENTS', undefined);
      // 移除token（清理上次登陆状态）
      removeToken();
      // resolve成功后执行，reject失败后执行
      // Promise函数介绍https://blog.csdn.net/qq_34645412/article/details/81170576
      return new Promise((resolve, reject) => {
        // 开始异步操作，发送用户名，密码，将返回token设置入cookie
        loginByEmail(username, userInfo.password).then(response => {
          // 将token设置入cookie
          setToken(response.data);
          // 将token同步放入user
          commit('SET_TOKEN', response.data);
          resolve();
          // 错误抛出
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GetInfo({
      commit,
      state
    }) {
      // resolve成功后执行，reject失败后执行
      // Promise函数介绍https://blog.csdn.net/qq_34645412/article/details/81170576
      return new Promise((resolve, reject) => {
        // 获取个人信息，携带token进行验证
        getInfo(state.token).then(response => {
          // 将返回值赋值给常量data
          const data = response;
          console.log('----------->userInfo:');
          console.log(data);
          console.log('<-----------userInfo');
          // 设置角色admin应该是可以改变的，目前写死用'admin'（后面回来改，目前先标记）
          commit('SET_ROLES', 'admin');
          //  设置名字
          commit('SET_NAME', data.name);
          // 设置头像，头像应该是可以改变的，目前写死（后面回来改，目前先标记）
          commit('SET_AVATAR', 'http://git.oschina.net/uploads/42/547642_geek_qi.png?1499487420');
          // 设置用户描述
          commit('SET_INTRODUCTION', data.description);
          // 定义菜单数组
          const menus = {};
          // 循环取出菜单
          for (let i = 0; i < data.menus.length; i++) {
            // 获取菜单编码设置为true，后面生成动态路由表时进行判断
            menus[data.menus[i].code] = true;
          }
          // 设置菜单
          commit('SET_MENUS', menus);
          // 定义基础元素列表（我理解是：增删改查按钮）
          const elements = {};
          // 循环取出元素
          for (let i = 0; i < data.elements.length; i++) {
            // 获取元素编码设置为true，后面操作前时进行判断
            elements[data.elements[i].code] = true;
          }
          console.log('----------->elements:');
          console.log(elements);
          console.log('<-----------elements');
          // 设置基础元素
          commit('SET_ELEMENTS', elements);
          //  成功后回调（目前不知道这个干了什么）
          resolve(response);
        }).catch(error => {
          reject(error);
        });
        // 获取菜单，携带token传递
        getMenus(state.token).then(response => {
          console.log('----------->PERMISSION_MENUS:');
          console.log(response)
          console.log('<-----------PERMISSION_MENUS');
          // 设置权限菜单
          commit('SET_PERMISSION_MENUS', response);
        });
      });
    },

    // 第三方验证登录
    LoginByThirdparty({
      commit,
      state
    }, code) {
      // resolve成功后执行，reject失败后执行
      // Promise函数介绍https://blog.csdn.net/qq_34645412/article/details/81170576
      return new Promise((resolve, reject) => {
        // 设置用户编码
        commit('SET_CODE', code);
        // 用户状态，用户邮箱，用户编码进行登录
        loginByThirdparty(state.status, state.email, state.code).then(response => {
          // 同步设置token
          commit('SET_TOKEN', response.data.token);
          // 将token存入cookie
          setToken(response.data.token);
          //  成功后回调（目前不知道这个干了什么）
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 登出
    LogOut({
      commit,
      state
    }) {
      // resolve成功后执行，reject失败后执行
      // Promise函数介绍https://blog.csdn.net/qq_34645412/article/details/81170576
      return new Promise((resolve, reject) => {
        // 登出操作（调用login.js）携带token去注销
        logout(state.token).then(() => {
          // 将token置空
          commit('SET_TOKEN', '');
          // 将角色置空
          commit('SET_ROLES', []);
          // 将菜单置空
          commit('SET_MENUS', undefined);
          // 将基础元素置空
          commit('SET_ELEMENTS', undefined);
          // 将权限菜单置空
          commit('SET_PERMISSION_MENUS', undefined);
          // 将cookie里面的token移除
          removeToken();
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    FedLogOut({
      commit
    }) {
      return new Promise(resolve => {
        // 将token置空
        commit('SET_TOKEN', '');
        // 将菜单置空
        commit('SET_MENUS', undefined);
        // 将基础元素置空
        commit('SET_ELEMENTS', undefined);
        // 将权限菜单置空
        commit('SET_PERMISSION_MENUS', undefined);
        // 移除token
        removeToken();
        resolve();
      });
    },

    // 动态修改权限
    ChangeRole({
      commit
    }, role) {
      // resolve成功后执行，reject失败后执行
      // Promise函数介绍https://blog.csdn.net/qq_34645412/article/details/81170576
      return new Promise(resolve => {
        // 设置新角色
        commit('SET_ROLES', [role]);
        // 设置token
        commit('SET_TOKEN', role);
        // 将token存入cookie
        setToken(role);
        resolve();
      })
    }
  }
};

export default user;
