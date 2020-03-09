import Cookies from 'js-cookie'

// token键
const TokenKey = 'Admin-Token'

// 获取token
// export导出函数（es6写法）
export function getToken() {
  // 通过token键获取cookies里面的值也就是token
  return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
  // 在cookie里面存储token，在user.js会被使用
  return Cookies.set(TokenKey, token)
}

// 移除token
export function removeToken() {
  // 在cookie里面移除token，一般使用在登出
  return Cookies.remove(TokenKey)
}
