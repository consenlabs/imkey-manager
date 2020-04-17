import axios from 'axios' // 引入axios
import qs from 'qs' // 引入qs
axios.defaults.baseURL = 'http://localhost:8888/api/imkey/' //请求地址的域名（此处使用了代理所以直接填／apis

// 拦截响应response，进行错误处理
axios.interceptors.response.use(function (response) {
    // 成功处理
    return response;
}, function (error) {
    // 失败处理
    error.code = error.response.status
    switch (error.response.status) {
        case 400: error.message = '错误请求'
            break;
        case 401: error.message = '未授权，请重新登录'
            break;
        case 403: error.message = '拒绝访问'
            break;
        case 404: error.message = '请求错误,未找到该资源'
            break;
        case 405: error.message = '请求方法未允许'
            break;
        case 408: error.message = '请求超时'
            break;
        case 500: error.message = '服务器端出错'
            break;
        case 501: error.message = '网络未实现'
            break;
        case 502: error.message = '网络错误'
            break;
        case 503: error.message = '服务不可用'
            break;
        case 504: error.message = '网络超时'
            break;
        case 505: error.message = 'http版本不支持该请求'
            break;
        default: error.message = `连接错误${error.response.status}`
    }
    return Promise.reject(error);
});

async function request(options) {
// 这里主要是post方法的封装，get方法同理
    options.method = 'post'
    if (options.config === 'formData') {
        options.headers = {'Content-Type': 'multipart/form-data'}
    } else {
        options.data = qs.stringify(options.data)
    }
    return new Promise((resolve,reject) => {
        axios(options).then(res => {
            //  这里主要根据后来返回的数据作判断，请根据实际情况
            if(res.data.status === 0) {
                resolve(res.data)
            } else {
                this.$message.error(`status: ${res.data.status}, message: ${ res.data.message }`)
                reject(res.data)
            }
        }).catch(error => {
            // 显示拦截器对respone处理后的可读错误
            this.$message.error(`${error.code} : ${ error.message }`)
        })
    })
}

export default { request }
