import store from "store";
import axios, { AxiosInstance, AxiosInterceptorManager, AxiosPromise, AxiosRequestConfig, AxiosResponse, Method } from 'axios'
// import Store from '../store'
import { Modal, notification } from 'antd'
import { ACCESS_TOKEN } from "../store/mutation-types"
import qs from "qs";
import { apiKeyDataType, apiKeyType } from "../api/api";

type ResultDataType = apiKeyDataType[apiKeyType];
/**
 * 【指定 axios的 baseURL】
 * 如果手工指定 baseURL: '/p siERP-boot'
 * 则映射后端域名，通过 vue.config.js
 * @type {*|string}
 */
// let apiBaseUrl = window._CONFIG['/psiERP-boot'] || "/psiERP-boot";
let apiBaseUrl = "http://localhost:3000/psiERP-boot";
// 创建 axios 实例
interface NewAxiosInstance extends AxiosInstance {
	/* 
	设置泛型T，默认为any，将请求后的结果返回变成AxiosPromise<T>
	*/
	<T = any>(config: AxiosRequestConfig): AxiosPromise<T>;
	interceptors: {
		request: AxiosInterceptorManager<AxiosRequestConfig>;
		response: AxiosInterceptorManager<AxiosResponse<ResultDataType>>;
	}
}

const service: NewAxiosInstance = axios.create({
	baseURL: apiBaseUrl,
	timeout: 90000, // 请求超时时间
	withCredentials: true, // 跨域携带cookie
	xsrfCookieName: 'xsrf-token' //当创建实例的时候配置默认配置
})

const err = (error) => {
	if (error.response) {
		let data = error.response.data
		const token = store.get(ACCESS_TOKEN)
		switch (error.response.status) {
			case 403:
				notification.error({
					message: '系统提示',
					description: '拒绝访问',
					duration: 4
				})
				break
			case 500:
				if (token && data === "loginOut") {
					Modal.error({
						title: '登录已过期',
						content: '很抱歉，登录已过期，请重新登录',
						okText: '重新登录',
						mask: false,
						onOk: () => {
							store.remove(ACCESS_TOKEN)
							window.location.reload()
						}
					})
				}
				break
			case 404:
				notification.error({
					message: '系统提示',
					description: '很抱歉，资源未找到!',
					duration: 4
				})
				break
			case 504:
				notification.error({
					message: '系统提示',
					description: '网络超时'
				})
				break
			case 401:
				notification.error({
					message: '系统提示',
					description: '未授权，请重新登录',
					duration: 4
				})
				if (token) {
					// Store.dispatch('Logout').then(() => {
					// 	setTimeout(() => {
					// 		window.location.reload()
					// 	}, 1500)
					// })
				}
				break
			default:
				notification.error({
					message: '系统提示',
					description: data.message,
					duration: 4
				})
				break
		}
	}
	return Promise.reject(error)
};

const QS_METHOD: Method[] = ['POST', 'post', 'PUT', 'put'];
const GET_METHOD: Method[] = ['GET', 'get', 'DELETE', 'delete'];
// 添加请求拦截器，这里面可以配置一下每次请求都需要携带的参数，比如 token，timestamp等等，根据项目自己配置
service.interceptors.request.use(response => {
	const token = store.get(ACCESS_TOKEN)
	if (token) {
		response.headers['X-Access-Token'] = token // 让每个请求携带自定义 token 请根据实际情况自行修改
	}
	// if (response.method && QS_METHOD.includes(response.method)) {// 这里只处理post请求，根据自己情况修改
	// 	response.data = qs.stringify(response.data);
	// } else if (response.method && GET_METHOD.includes(response.method)) {//设置GET的请求参数
	// 	response.params = qs.parse(response.data);
	// 	response.data = undefined;
	// }
	response.headers['Access-Control-Allow-Origin'] = '*';
	// 每次请求带上时间戳 防刷处理
	// if (config.method === 'get' || config.method === 'delete') {
	// 	config.params = {
	// 		...config.params,
	// 		timestamp: Date.parse(new Date()) / 1000
	// 	}
	// } else if (config.method === 'post' || config.method === 'put') {
	// 	config.data = {
	// 		...config.data,
	// 		timestamp: Date.parse(new Date()) / 1000
	// 	}
	// } else {
	// 	config.data = {
	// 		...config.data,
	// 		timestamp: Date.parse(new Date()) / 1000
	// 	}
	// }
	return response
}, (error) => {
	return error
})

// 添加响应拦截器 ，这里的 response是接收服务器返回后的结果，也可以在这里做一些状态判断
service.interceptors.response.use((response) => {
	return response.data
}, err)

// const installer = {
// 	vm: {},
// 	install(Vue, router = {}) {
// 		// Vue.use(VueAxios, router, service)
// 	}
// }

export { service as axios }
