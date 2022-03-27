import * as React from 'react';
import Login from '../src/pages/login/index';
import Home from '../src/pages/home/home';
import Admin from "../src/pages/admin/admin";
import LoadingLayout from '../src/components/LoadingLayout'
import { Switch, Route, Redirect } from "react-router-dom";
// import './App.less'
export default class App extends React.Component {

	constructor(props) { 
		super(props);
	}

	render() {
		return (
			<div className="todo-container">
				{/* 只匹配其中一个 */}
				<Switch>
					<Route path="/login" component={Login}></Route>
					<Route path="/home" component={Admin}></Route>
					<Redirect to="/login" />
				</Switch>
			</div>
		)
	}
}
