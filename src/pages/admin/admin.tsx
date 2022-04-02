import React, { Component } from "react";
import { makeObservable, observable } from 'mobx'
import { Redirect, Route, Switch } from "react-router-dom";
import { observer } from 'mobx-react'
import { MenuUnfoldOutlined, MenuFoldOutlined,LoginOutlined } from '@ant-design/icons';
import { Layout, Menu } from "antd";
// import Header from "../../components/header";
import Home from "../home/home";
import Bar from "../charts/bar";
import Line from "../charts/line";
import Pie from "../charts/pie";
import { connect } from "react-redux";
import LeftNav from "../left-nav";
// import NotFound from "../../not-found/not-found";
import VendorList from "../ststem/vendor";
import CustomerList from "../ststem/customer";
import { Header } from "antd/lib/layout/layout";
import MaterialList from "../material/material";
import './admin.less';
import ChangepwdModal from "./change-password";

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
						{React.createElement(this.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
							className: 'trigger',
							onClick: () => this.onCollapse(),
						})}
						<div className="headertitle-container">
							<ChangepwdModal/>
							<div><LoginOutlined />退出登录</div>
						</div>
					</Header>
					<Content style={{ margin: 20, backgroundColor: "#fff" }} className="panel">
						<Switch>
							<Route path="/home/system/home" component={Home} />
							<Route path="/home/system/vendor" component={VendorList} />
							<Route path="/home/system/customer" component={CustomerList} />
							<Route path="/home/material/material" component={MaterialList} />
							{/* <Route path="/charts/bar" component={Bar} />
								<Route path="/charts/pie" component={Pie} />
								<Route path="/charts/line" component={Line} /> */}
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