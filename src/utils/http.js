import axios from 'axios';
import {Message} from 'element-ui';
const http = {};
http.install = (Vue) => {
	axios.defaults.baseURL = "http://127.0.0.1:8888/api/private/v1/"
	// 添加请求拦截器
	axios.interceptors.request.use(function(config) {
		// 在发送请求之前做些什么
		if (config.url !== 'login') {
			const token = localStorage.getItem('token')
			config.headers.authorization = token;
		}
		return config;
	}, function(error) {
		// 对请求错误做些什么
		return Promise.reject(error);
	});

	// 添加响应拦截器
	axios.interceptors.response.use(function(response) {
		// 对响应数据做点什么
		let data = response.data;
		if(data.meta.status === 401){
			Message.warning('token过期');
			localStorage.clear()
		}
		return data;
	}, function(error) {
		// 对响应错误做点什么
		return Promise.reject(error);
	});
	Vue.prototype.$http = axios;
}
export default http
