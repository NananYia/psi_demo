import React, { Component } from "react";
import { makeObservable, observable } from 'mobx'
import { Redirect, Route, Switch } from "react-router-dom";
import { observer } from 'mobx-react'
import { MenuUnfoldOutlined, MenuFoldOutlined,LoginOutlined } from '@ant-design/icons';
import { Layout, Menu } from "antd";
import { Header } from "antd/lib/layout/layout";
import store from "store";
import Home from "../home/home";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import { connect } from "react-redux";
import LeftNav from "../left-nav";
// import NotFound from "../../not-found/not-found";
import VendorList from "../ststem/vendor";
import CustomerList from "../ststem/customer";
import DepotList from "../ststem/depot"
import AccountList from "../ststem/account"
import RoleList from "../ststem/role"
import UserList from "../ststem/user"
import MaterialList from "../material/material";
import MaterialCategoryList from "../material/material_category";
// import PurchaseOrderList from "../bill/purchase_intest";
import PurchaseOrder from "../bill/purchase_order";
// import SaleOrderList from "../bill/sale_order";
import SaleOrderList from "../bill/sale_order";
import OtherInList from "../bill/other_in";
import OtherOutList from "../bill/other_out";
import './admin.less';
import ChangepwdModal from "./change-password";
import { USER_INFO } from "../../store/mutation-types";
import LoginOutText from "./login-out";

const { Footer, Sider, Content } = Layout;
// 后台管理的路由组件
@observer
export default class admin extends Component<any, any>{
	@observable
	private collapsed: boolean = false;

	constructor(props) {
		super(props);
		makeObservable(this);
	}
	onCollapse = () => {
		console.log(this.collapsed);
		this.collapsed = !this.collapsed
	};

	render() {
		return (
			<Layout style={{ minHeight: "100%" }} >
				<Sider trigger={null} collapsible collapsed={this.collapsed} theme="light">
					<LeftNav />
				</Sider>
				<Layout>
					<Header className="site-layout-background" style={{ padding: 0 }}>
						<div onClick={() => this.onCollapse()}>
							{this.collapsed ? <MenuUnfoldOutlined style={{ color: '#ffffff' }} /> : <MenuFoldOutlined style={{ color: '#ffffff' }}/>}
						</div>
						<div className="headertitle-container">
							<div className="welcome-content">欢迎您，{store.get(USER_INFO).username}</div>
							<ChangepwdModal />
							<LoginOutText/>
						</div>
					</Header>
					<Content style={{ margin: 20, backgroundColor: "#fff" }} className="panel">
						<Switch>
							<Route path="/home/system/home" component={Home} />

							{/* 采购订单 */}
							<Route path="/home/bill/purchase_in" component={PurchaseOrder} />

							{/* 销售订单 */}
							<Route path="/home/bill/sale_out" component={SaleOrderList} />

							{/* 其他入库 */}
							<Route path="/home/bill/other_in" component={OtherInList} />
							{/* 其他出库 */}
							<Route path="/home/bill/other_out" component={OtherOutList} />

							{/* 商品信息 */}
							<Route path="/home/material/material" component={MaterialList} />
							{/* 商品列表 */}
							<Route path="/home/material/material_category" component={MaterialCategoryList} />

							{/* 供应商信息 */}
							<Route path="/home/system/vendor" component={VendorList} />
							{/* 客户信息 */}
							<Route path="/home/system/customer" component={CustomerList} />
							{/* 角色信息 */}
							<Route path="/home/system/role" component={RoleList} />
							
							{/* 用户信息 */}
							<Route path="/home/system/user" component={UserList} />

							{/* 
								<Route path="/home/system/depot" component={DepotList} />
								<Route path="/home/system/account" component={AccountList} />
								<Route path="/charts/bar" component={Bar} />
								<Route path="/charts/pie" component={Pie} />
								<Route path="/charts/line" component={Line} />
							*/}
							{/* <Route component={NotFound} /> */}
							<Redirect to="/home/system/home" />
						</Switch>
						{/* </div> */}
					</Content>
					<Footer style={{ textAlign: "center", color: "#ccc" }}>
					</Footer>
				</Layout>
			</Layout>
		);
	}
}