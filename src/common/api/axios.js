import axios from 'axios';
import {getStore, setStore} from './storage';
import router from '@/router'

let base = '';

// 超时设定
axios.defaults.timeout = 15000;


// http request 拦截器
axios.interceptors.request.use(
  config => {
    // console.info('进入拦截器', config)
    if (localStorage.token) { //判断token是否存在
      config.headers.Authorization = "Bearer " + localStorage.token;  //将token设置成请求头
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

// http response 拦截器
axios.interceptors.response.use(
  response => {
    if (response.data.code === 4003) {
      console.log("token过期");
      window.localStorage.removeItem("token")
      window.location.href = '/'

    }
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);


export const getRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    headers: {
      'accessToken': accessToken
    }
  });
};
export const getBlobRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'get',
    url: `${base}${url}`,
    params: params,
    responseType: 'blob', // 声明返回blob格式
    headers: {
      'accessToken': accessToken
    }
  });
};

export const postRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      ret = ret.substring(0, ret.length - 1);
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  });
};

export const putRequest = (url, params) => {
  let accessToken = getStore("accessToken");
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      ret = ret.substring(0, ret.length - 1);
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'accessToken': accessToken
    }
  });
};

export const postBodyRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'accessToken': accessToken
    }
  });
};

export const postExcelRequest = (url, params) => {
  let accessToken = getStore('accessToken');
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data',
      'accessToken': accessToken
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
    method: 'get',
    url: `${base}${url}`,
    params: params
  });
};

export const postNoAuthRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
    transformRequest: [function (data) {
      let ret = '';
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&';
      }
      ret = ret.substring(0, ret.length - 1);
      return ret;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
};
