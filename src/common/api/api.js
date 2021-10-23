// 统一请求路径前缀在libs/axios.js中修改
import {
  getRequest,
  getNoAuthRequest,
  postNoAuthRequest,
  postBodyRequest,
  postRequest,
  putRequest, getBlobRequest, postBlobRequest, postJsonRequest
} from "./axios";
import axios from "axios";
// 认证
export const siteInfo = (id, params) => {
  return getNoAuthRequest("/oauth2/info/" + id, params);
};
// 认证
export const authorize = params => {
  return postNoAuthRequest("/oauth2/authorize", params);
};
// 认证过
export const authorized = params => {
  return postRequest("/oauth2/authorized", params);
};
// 获取token
export const token = params => {
  return getNoAuthRequest("/oauth2/token", params);
};

// 获取随机secretKey
export const getSecretKey = params => {
  return getRequest("/client/getSecretKey", params);
};
// 获取客户端
export const getClientDataList = params => {
  return getRequest("/client/getByCondition", params);
};
// 添加客户端
export const addClient = params => {
  return postRequest("/client/save", params);
};
// 编辑客户端
export const updateClient = params => {
  return putRequest("/client/update", params);
};
// 删除客户端
export const deleteClient = params => {
  return postRequest("/client/delByIds", params);
};

// 获取菜单树
export const treeMenu = params => {
  return getRequest("/menu/tree", params);
};
// 长业务
export const business = params => {
  return getRequest("/business/", params);
};
// 获取用户列表
export const userList = params => {
  return getRequest("/user", params);
};
// 获取菜单树
export const login = params => {
  return postBodyRequest("/user/login", params);
};
// 获取问题列表
export const questionList = params => {
  return getRequest("/question", params);
};
// 新建问题列表
export const addQuestion = params => {
  return postBodyRequest("/question", params);
};
// 获取回答列表
export const findAnswerByQuestionId = params => {
  return getRequest("/answer", params);
};
// 获取回答列表
export const exportUser = params => {
  return getBlobRequest("/user/export", params);
};
// 获取回答列表
export const taskPage = params => {
  return postJsonRequest("/task/page", params);
};
// 新建问题列表
export const addTask = params => {
  return postBodyRequest("/task", params);
};
