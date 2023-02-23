import http from '../utils/http'
//
/**
 *  @parms resquest 请求地址
 *  @param '/testIp'代表vue-cil中config，index.js中配置的代理
 */
const resquest = "https://localhost:9888"

export default {
  /**
   * 注册
   * @param params
   * @returns {*}
   */
  sign_up(params) {
    return http.post(`${resquest}/user/sign_up`, params)
  },
  /**
   * 登录
   * @param params
   * @returns {*}
   */
  sign_in(params) {
    return http.post(`${resquest}/user/sign_in`, params)
  },
  /**
   * 签出
   * @param params
   * @returns {*}
   */
  sign_out(params) {
    return http.post(`${resquest}/user/sign_out`, params)
  },
  service(params) {
    return http.post(`${resquest}/service`, params)
  },

}
