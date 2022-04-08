import React, { Component } from "react";
import "./index.less";
import { Link } from "react-router-dom";
import { observer } from 'mobx-react'
import { makeObservable, observable } from 'mobx'
import { Menu, Tabs } from "antd";
import { GetPermissionList } from "../../store/modules/user"
import { generateIndexRouter } from "../../utils/util";
import { HomeIcons } from "../../components/HomeIcons";
import MyNavLink from '../../components/MyNavLink'
import MySpin from "src/components/Spin";
import { allneed_menu_meta, purchase_menu_meta } from "./menData";
import { getSomeValue } from "../../utils/getSomeValueArray";
const { SubMenu } = Menu;
const { TabPane } = Tabs;
// 左侧导航的组件
@observer
export default class LeftNav extends Component <any,any>{
	@observable
	private openKey: any;
	@observable
	private constRoutes: any;

	constructor(props) {
		super(props);
		makeObservable(this);
		this.getMenuList();
	}
	getMenuList = async () => {
		try {
			const menuData: any = await GetPermissionList();
			if (menuData === null || menuData === "" || menuData === undefined) {
				return;
			}
			const result = generateIndexRouter(menuData);
			return this.constRoutes = result;
		} catch (error) {
			console.log(error);
		}
	}

	renderMenuItem = () => { 
		const findconstRoutes = getSomeValue(this.constRoutes, allneed_menu_meta, 'name') as any;
		return (
			findconstRoutes.map((item, index) => { 
				if (index === 0) {
					return <Menu.Item icon={HomeIcons(item.meta.icon)} key={index}> {item.name}</Menu.Item>
				} else if (item.name === "采购管理") { 
					return (
						item.children.map((item, index) => {
							if (item.name == "采购入库") {
								return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
									<MyNavLink toPage={`/home${item.meta.url}`}>采购订单管理</MyNavLink>
								</Menu.Item>
							} else return null;
						})
					)
				}
				else if (item.name === "销售管理") {
					return (
						item.children.map((item, index) => {
							if (item.name == "销售出库") {
								return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
									<MyNavLink toPage={`/home${item.meta.url}`}>销售订单管理</MyNavLink>
								</Menu.Item>
							} else return null;
						})
					)
				}
				else if (item.name === "库存管理" || item.name === "系统管理") {
					return (
						item.children.map((item, index) => {
							if (index<2) {
								return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
									<MyNavLink toPage={`/home${item.meta.url}`}>{item.name}</MyNavLink>
								</Menu.Item>
							} else return null;
						})
					)
				}
				else if (item.name === "报表查询" ) {
					return (
						item.children.map((item, index) => {
							if (item.name === "商品库存") {
								return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
									<MyNavLink toPage="/home/material/material_stock">库存管理</MyNavLink>
								</Menu.Item>
							} else return null;
						})
					)
				}
				else if (item.name === "基本资料") {
					return (
						item.children.map((item, index) => {
							if (index < 2) {
								if (item.name === "供应商信息") {
									return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
										<MyNavLink toPage={`/home${item.meta.url}`}>供应商管理</MyNavLink>
									</Menu.Item>
								} else { 
									return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
										<MyNavLink toPage={`/home${item.meta.url}`}>客户管理</MyNavLink>
									</Menu.Item>
								}
							} else return null;
						})
					)
				}
				else {
					return (
						<SubMenu key={index} icon={HomeIcons(item.meta.icon)} title={item.name}>
							{item?.children && item.children.length > 0 ?
									item.children.map((item, index) => {
										if (index < 2) {
											return <Menu.Item icon={HomeIcons(item.meta.icon)} key={item.meta.id}>
												<MyNavLink toPage={`/home${item.meta.url}`}>{item.name}</MyNavLink>
											</Menu.Item>
										} else return null;
									})

								: null
							}
						</SubMenu>
					)
				}
			}	
			) 
		)
	}

	render() {
		return (
			<div className="left-nav">
				<Link to="/home" className="left-nav-header">
					{/* <img src={require('../../assets/images/icon.png')} alt="logo" /> */}
					<h1>Nanan ERP</h1>
				</Link>
				<Menu
					mode="inline"
					theme="light"
					// defaultSelectedKeys={['1']}
					// defaultOpenKeys={['sub1']}
				>
					{this.constRoutes ?
						this.renderMenuItem()
						: <MySpin />
					}
				</Menu>
			</div>
		);
	}
}