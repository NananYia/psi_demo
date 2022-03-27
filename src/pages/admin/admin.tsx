import React, { Component } from "react";
import { makeObservable, observable } from 'mobx'
import { Redirect, Route, Switch } from "react-router-dom";
import { observer } from 'mobx-react'
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
import './admin.less';

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
		// const user = this.props.user;
		// 如果内存没有存储user ==> 当前没有登陆
		// if (!user || !user._id) {
		//   // 自动跳转到登陆(在render()中)
		//   return <Redirect to="/login" />;
		// }
		return (
			<Layout style={{ minHeight: "100%" }} >
				<Sider collapsible collapsed={this.collapsed} onCollapse={()=>this.onCollapse()} theme="light">
					<LeftNav/>
				</Sider>
				<Layout>
					{/* <Header>Header</Header> */}
					<Content style={{ margin: 20, backgroundColor: "#fff" }} className="panel">
							<Switch>
								<Route path="/home/system/home" component={Home} />
								<Route path="/home/system/vendor" component={VendorList} />
								<Route path="/home/system/customer" component={CustomerList} />
								{/* <Route path="/charts/bar" component={Bar} />
								<Route path="/charts/pie" component={Pie} />
								<Route path="/charts/line" component={Line} /> */}
								{/* <Route component={NotFound} /> */}
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