import React, { Component } from "react";
import "./index.less";
import { Link, withRouter } from "react-router-dom";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Menu } from "antd";
import { menuList } from "../../config/menuConfig";
import { connect } from "react-redux";
// import { setHeadTitle } from "../../redux/action";
import { GetPermissionList } from "../../store/modules/user"
import {
	MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, VideoCameraOutlined,
	UploadOutlined, FileOutlined, AppstoreOutlined, MailOutlined, SettingOutlined
} from '@ant-design/icons';
// import { generateIndexRouter } from "src/utils/util";

const { SubMenu } = Menu;
// 左侧导航的组件
@observer
export default class LeftNav extends Component {
	@observable
	private menuNodes: any;
	@observable
	private openKey: any;

	constructor(props) {
		super(props);
		makeObservable(this);
		this.getMenuList();
	}

	// 判断当前登录用户对item是否有权限
	// hasAutu = (item) => {
	// 	const { key, isPublic } = item;
	// 	const menus = this.props.user.role.menus;
	// 	const username = this.props.user.username;
	// 	//  1.如果当前用户是admin
	// 	//  2.如果当前item是公开的
	// 	//  3.当前用户有此item的权限：key有没有在menus中
	// 	if (username === "admin" || isPublic || menus.indexOf(key) !== -1) {
	// 		return true;
	// 	} else if (item.children) {
	// 		//  4.如果当前用户有此item 的某个子item的权限
	// 		return !!item.children.find((child) => menus.indexOf(child.key) !== -1);
	// 	}
	// 	return false;
	// };
	// 根据menu的数据数组生成对应的标签数组
	// 使用map() + 递归调用

	// 把icon:'home'改为icon: <HomeOutlined />并导入import {HomeOutlined}  from '@ant-design/icons';
	// getMenuNodes = (menuList) => {
	// 	const path = this.props.location.pathname;
	// 	return menuList.map((item) => {
	// 		// 如果当前用户有item对应的权限，才需要显示对应的菜单项
	// 		if (this.hasAutu(item)) {
	// 			if (!item.children) {
	// 				//判断item是否是当前对应的item
	// 				if (item.key === path || path.indexOf(item.key) === 0) {
	// 					//更新redux中的headerTitle状态
	// 					this.props.setHeadTitle(item.title);
	// 				}
	// 				return (
	// 					<Menu.Item key={item.key} icon={item.icon}>
	// 						<Link
	// 							to={item.key}
	// 							onClick={() => this.props.setHeadTitle(item.title)}
	// 						>
	// 							<span>{item.title}</span>
	// 						</Link>
	// 					</Menu.Item>
	// 				);
	// 			} else {
	// 				// 查找一个与当前请求路径匹配的子Item
	// 				const cItem = item.children.find(
	// 					(cItem) => path.indexOf(cItem.key) === 0
	// 				);
	// 				// 如果存在, 说明当前item的子列表需要打开
	// 				if (cItem) {
	// 					this.openKey = item.key;
	// 				}
	// 				return (
	// 					<SubMenu
	// 						key={item.key}
	// 						icon={item.icon}
	// 						title={
	// 							<span>
	// 								<span>{item.title}</span>
	// 							</span>
	// 						}
	// 					>
	// 						{this.getMenuNodes(item.children)}
	// 					</SubMenu>
	// 				);
	// 			}
	// 		}
	// 	});
	// };
	getMenuList = async () => {
		try {
			const result: any = await GetPermissionList();
			const menuData = result;
			if (menuData === null || menuData === "" || menuData === undefined) {
				return;
			}
			let constRoutes = [];
			// constRoutes = generateIndexRouter(menuData);
			// // 添加主界面路由
			// store.dispatch('UpdateAppRouter', { constRoutes }).then(() => {
			//     // 根据roles权限生成可访问的路由表
			//     // 动态添加可访问路由表
			//     router.addRoutes(store.getters.addRouters)
			//     const redirect = decodeURIComponent(from.query.redirect || to.path)
			//     // next({ path: redirect })
			// })

		} catch (error) {
			// store.dispatch('Logout').then(() => {
			// next({ path: '/user/login' })
			// })
		}
	}

	render() {
		// 得到需要打开菜单项的key
		const openKey = this.openKey || 1;
		return (
			<div className="left-nav">
				<Link to="/home" className="left-nav-header">
					{/* <img src={require('../../assets/images/icon.png')} alt="logo" /> */}
					<h1>Nanan ERP</h1>
				</Link>
				<Menu
					mode="inline"
					theme="light"
					// selectedKeys={[path]}
					// defaultOpenKeys={[openKey]}
					defaultSelectedKeys={['1']}
					defaultOpenKeys={['sub1']}
				>
					{/* {this.menuNodes} */}
					<SubMenu key="sub1" icon={<MailOutlined />} title="Navigation One">
						<Menu.Item key="1">Option 1</Menu.Item>
						<Menu.Item key="2">Option 2</Menu.Item>
						<Menu.Item key="3">Option 3</Menu.Item>
					</SubMenu>
					<SubMenu key="sub2" icon={<AppstoreOutlined />} title="Navigation Two">
						<Menu.Item key="5">Option 5</Menu.Item>
						<Menu.Item key="6">Option 6</Menu.Item>
					</SubMenu>
					<SubMenu key="sub4" icon={<SettingOutlined />} title="Navigation Three">
						<Menu.Item key="9">Option 9</Menu.Item>
						<Menu.Item key="10">Option 10</Menu.Item>
						<Menu.Item key="11">Option 11</Menu.Item>
						<Menu.Item key="12">Option 12</Menu.Item>
					</SubMenu>
				</Menu>
			</div>
		);
	}
}