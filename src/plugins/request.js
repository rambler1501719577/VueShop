import axios from 'axios'
// axios实例
const service = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 5000, // request timeout
	paramsSerializer: function(params) {
		return qs.stringify(params, {
			arrayFormat: 'brackets'
		})
	},
})

// 请求的拦截器
service.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// 响应拦截器
service.interceptors.response.use(
	response => {
		return response;
	},
	error => {
		return Promise.reject(error)
	}
)

// 返回axios实例
export default service
