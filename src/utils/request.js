/**
 * 请求对象
 */

import axios from "axios";

// 定义新的请求对象
const request = axios.create({
  // 默认访问地址
  baseURL: "/api",
  // 超时时间设置为600s
  timeout: 600 * 1000,
});

// 请求拦截器
request.interceptors.response.use(
  // 成功回调
  (response) => {
    return response.data;
  },
  // 失败回调
  (error) => {
    return Promise.reject(error);
  }
)

// 默认暴露
export default request;