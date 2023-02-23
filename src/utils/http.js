/****   http.js   ****/
// 导入封装好的axios实例
import request from './request'

const http = {

    get(url, params) {

        const config = {
            method: 'get',
            url: url
        }
        if (params) config.params = params
        return request(config)
    },
    post(url, params) {
        const config = {
            method: 'post',
            url: url

        }
        if (params) config.data = params
        return request(config)
    },

}
//导出
export default http
