/**
 * 请求对象
 */

import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

// 定义新的请求对象
const request = axios.create({
  // 默认访问地址
  baseURL: "/api",
  // 超时时间设置为600s
  timeout: 600 * 1000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 添加token
    const loginUser = JSON.parse(localStorage.getItem("loginData"));
    if (loginUser && loginUser.token) {
      config.headers.token = loginUser.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
)

// 响应拦截器
request.interceptors.response.use(
  // 成功回调
  (response) => {
    return response.data;
  },
  // 失败回调
  (error) => {
    if(error.response.status === 401){
      ElMessage.error("登录信息已过期，请重新登录")
      router.push("/login")
    }
    return Promise.reject(error);
  }
)

// 默认暴露
export default request;