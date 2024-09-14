import axios from "axios";
import { getStore, setStore } from "./storage";
import { Message } from "element-ui";
import router from "@/router";
import errorHandler from "./errorHandler";
import { showLoading, hideLoading } from "./loading";
let configChace = null; // 存放请求参数，在进入错误时候也关掉loading

let base = "";

// 超时设定
axios.defaults.timeout = 15000;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    // 判断当前请求是否设置了不显示Loading,默认显示
    if (config.headers.showLoading) {
      showLoading(config.headers.loadingTarget); // 如果设置了targer,使用设置的target,比如el-table
      configChace = config;
    }

    // console.info('进入拦截器', config)
    if (localStorage.token) {
      //判断token是否存在
      config.headers.Authorization = "Bearer " + localStorage.token; //将token设置成请求头
    }
    return config;
  },
  err => {
    if (configChace.headers.showLoading) {
      hideLoading();
      configChace = null;
    }
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 4003) {
      console.log("token过期");
      window.localStorage.removeItem("token");
      window.location.href = "/";
    }
    if(response.data.code !== 1000){
      Message.error(response.data.msg+':'+JSON.stringify(response.data.data));
    }

    // 判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
    if (response.config.headers.showLoading) {
      hideLoading();
    }
    return response;
  },
  error => {
    // 关闭loading
    if (configChace.headers.showLoading) {
      hideLoading();
      configChace = null;
    }
    //统一异常处理
    errorHandler(error);
    return Promise.reject(error);
  }
);

export const getRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "get",
    url: `${base}${url}`,
    params: params,
    headers: {
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};
export const getBlobRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "get",
    url: `${base}${url}`,
    params: params,
    responseType: "blob", // 声明返回blob格式
    headers: {
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const postRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const postJsonRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "application/json",
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const putRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const putJsonRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "put",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "application/json",
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const deleteRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "delete",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const postBodyRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const postExcelRequest = (url, params, showLoading, loadingTarget) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    headers: {
      "Content-Type": "multipart/form-data",
      accessToken: accessToken,
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};

export const postNoAuthRequest = (url, params, showLoading, loadingTarget) => {
  return axios({
    method: "post",
    url: `${base}${url}`,
    data: params,
    transformRequest: [
      function(data) {
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        ret = ret.substring(0, ret.length - 1);
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      showLoading: showLoading != undefined,
      loadingTarget: loadingTarget
    }
  });
};
/**
 * 无需token验证的GET请求 避免旧token过期导致请求失败
 * @param {*} url
 * @param {*} params
 */
export const getNoAuthRequest = (url, params) => {
  return axios({
    method: "get",
    url: `${base}${url}`,
    params: params
  });
};
