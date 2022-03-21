import api from './index'
import * as axios from "../../src/utils/request";
import ajax from './ajax';

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 */
export const login = (parameter) => {
  return ajax('/user/login',parameter,"post")
  // return ajax({
  //   url: '/user/login',
  //   method: 'post',
  //   data: parameter
  // })
}

export const logout=()=>{
  return axios({
    url: '/user/logout',
    method: 'get'
  })
}