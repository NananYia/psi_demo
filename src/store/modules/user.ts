import { login, logout } from "../../api/login"
import { ACCESS_TOKEN, USER_NAME, USER_INFO, UI_CACHE_DB_DICT_DATA, USER_ID, USER_LOGIN_NAME, CACHE_INCLUDED_ROUTES } from "../mutation-types"
import { welcome } from "../../utils/util"
import { getAction } from '../../api/manage'
import api from "../../api/api";
import store from "store";



// CAS验证登录
export const ValidateLogin = async (userInfo) => {
	try {
		const response: any = await getAction("/cas/client/validateLogin", userInfo);
		console.log("----cas 登录--------", response);
		if (response.success) {
			const result = response.result
			const userInfo = result.userInfo
			store.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
			store.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
			store.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
			store.set('SET_TOKEN', result.token)
			store.set('SET_INFO', userInfo)
			store.set('SET_NAME', { username: userInfo.username, realname: userInfo.realname, welcome: welcome() })
			store.set('SET_AVATAR', userInfo.avatar)
			return response
		} else {
			return response
		}
	} catch (error) {
		return error
	}
};
// 登录
export const LoginIn = async (userInfo) => {
	try {
		const response: any = await login(userInfo)
		if (response.code === 200) {
			if (response.data.msgTip == 'user can login') {
				const result = response.data
				store.set(USER_ID, result.user.id, 7 * 24 * 60 * 60 * 1000);
				store.set(USER_LOGIN_NAME, result.user.loginName, 7 * 24 * 60 * 60 * 1000);
				//前端7天有效期，后端默认1天，只要用户在1天内有访问页面就可以一直续期直到7天结束
				store.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
				store.set(USER_INFO, result.user, 7 * 24 * 60 * 60 * 1000)
				store.set('SET_TOKEN', result.token)
			}
			// store.set('SET_INFO', userInfo)
			return response
		} else {
			return response
		}
	} catch (error) {
		return error
	}
};
// 登出
export const Logout = (state?) => {
	let logoutToken = state.token;
	store.set('SET_TOKEN', '')
	store.set('SET_PERMISSIONLIST', [])
	store.remove(USER_ID)
	store.remove(USER_LOGIN_NAME)
	store.remove(USER_INFO)
	store.remove(UI_CACHE_DB_DICT_DATA)
	store.remove(CACHE_INCLUDED_ROUTES)
	logout().then(() => {
		return
	}).catch((error) => {
		return error
	})
};
// 第三方登录
export const ThirdLogin = (token) => {
	// thirdLogin(token).then(response => {
	//   if (response.code == '200') {
	//     const result = response.result
	//     const userInfo = result.userInfo
	//     store.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
	//     store.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
	//     store.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
	//     store.set('SET_TOKEN', result.token)
	//     store.set('SET_INFO', userInfo)
	//     store.set('SET_NAME', { username: userInfo.username, realname: userInfo.realname, welcome: welcome() })
	//     store.set('SET_AVATAR', userInfo.avatar)
	//     return response
	//   } else {
	//     return response
	//   }
	// }).catch(error => {
	//   return error
	// })
};
// 获取用户信息
export const GetPermissionList = async () => {
	let params = { pNumber: 0, userId: store.get(USER_ID) };
	try {
		const response: any = await api.queryPermissionsByUser(params)
		if (response && response.length > 0) {
			store.set('SET_PERMISSIONLIST', response)
		} else {
			// reject('getPermissionList: permissions must be a non-null array !')
		}
		return response
	} catch (error) {
		return error
	}
};

// const user = {
//   state: {
//     token: '',
//     username: '',
//     realname: '',
//     welcome: '',
//     avatar: '',
//     permissionList: [],
//     info: {}
//   },

//   mutations: {
//     SET_TOKEN: (state, token) => {
//       state.token = token
//     },
//     SET_NAME: (state, { username, realname, welcome }) => {
//       state.username = username
//       state.realname = realname
//       state.welcome = welcome
//     },
//     SET_AVATAR: (state, avatar) => {
//       state.avatar = avatar
//     },
//     SET_PERMISSIONLIST: (state, permissionList) => {
//       state.permissionList = permissionList
//     },
//     SET_INFO: (state, info) => {
//       state.info = info
//     },
//   },

//   actions: {
//     // CAS验证登录
//     ValidateLogin({ store.set }, userInfo) {
//       return new Promise((resolve, reject) => {
//         getAction("/cas/client/validateLogin",userInfo).then(response => {
//           console.log("----cas 登录--------",response);
//           if(response.success){
//             const result = response.result
//             const userInfo = result.userInfo
//             store.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
//             store.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
//             store.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
//             store.set('SET_TOKEN', result.token)
//             store.set('SET_INFO', userInfo)
//             store.set('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
//             store.set('SET_AVATAR', userInfo.avatar)
//             resolve(response)
//           }else{
//             resolve(response)
//           }
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
//     // 登录
//     Login({ store.set }, userInfo) {
//       debugger;
//       return new Promise((resolve, reject) => {
//         login(userInfo).then(response => {
//           if(response.code ==200){
//             if(response.data.msgTip == 'user can login'){
//               const result = response.data
//               store.set(USER_ID, result.user.id, 7 * 24 * 60 * 60 * 1000);
//               store.set(USER_LOGIN_NAME, result.user.loginName, 7 * 24 * 60 * 60 * 1000);
//               //前端7天有效期，后端默认1天，只要用户在1天内有访问页面就可以一直续期直到7天结束
//               store.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
//               store.set(USER_INFO, result.user, 7 * 24 * 60 * 60 * 1000)
//               store.set('SET_TOKEN', result.token)
//             }
//             store.set('SET_INFO', userInfo)
//             resolve(response)
//           }else{
//             reject(response)
//           }
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },
// // 获取用户信息
// GetPermissionList({ store.set }) {
//   return new Promise((resolve, reject) => {
//     //let v_token = store.get(ACCESS_TOKEN);
//     let params = {pNumber:0,userId: store.get(USER_ID)};
//     queryPermissionsByUser(params).then(response => {
//       const menuData = response;
//       if (menuData && menuData.length > 0) {
//         store.set('SET_PERMISSIONLIST', menuData)
//       } else {
//         reject('getPermissionList: permissions must be a non-null array !')
//       }
//       resolve(response)
//     }).catch(error => {
//       reject(error)
//     })
//   })
// },

//     // 登出
//     Logout({ store.set, state }) {
//       return new Promise((resolve) => {
//         //let logoutToken = state.token;
//         store.set('SET_TOKEN', '')
//         store.set('SET_PERMISSIONLIST', [])
//         store.remove(USER_ID)
//         store.remove(USER_LOGIN_NAME)
//         store.remove(USER_INFO)
//         store.remove(UI_CACHE_DB_DICT_DATA)
//         store.remove(CACHE_INCLUDED_ROUTES)
//         logout().then(() => {
//           resolve()
//         }).catch(() => {
//           resolve()
//         })
//       })
//     },
//     // 第三方登录
//     ThirdLogin({ store.set }, token) {
//       return new Promise((resolve, reject) => {
//         thirdLogin(token).then(response => {
//           if(response.code =='200'){
//             const result = response.result
//             const userInfo = result.userInfo
//             store.set(ACCESS_TOKEN, result.token, 7 * 24 * 60 * 60 * 1000)
//             store.set(USER_NAME, userInfo.username, 7 * 24 * 60 * 60 * 1000)
//             store.set(USER_INFO, userInfo, 7 * 24 * 60 * 60 * 1000)
//             store.set('SET_TOKEN', result.token)
//             store.set('SET_INFO', userInfo)
//             store.set('SET_NAME', { username: userInfo.username,realname: userInfo.realname, welcome: welcome() })
//             store.set('SET_AVATAR', userInfo.avatar)
//             resolve(response)
//           }else{
//             reject(response)
//           }
//         }).catch(error => {
//           reject(error)
//         })
//       })
//     },

//   }
// }

export default {
	ValidateLogin,
	LoginIn,
	Logout,
	GetPermissionList,
}