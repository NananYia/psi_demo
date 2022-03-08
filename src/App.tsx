import * as React from 'react';

import Login from '../src/pages/login/login';
// import './App.less'
export default class App extends React.Component {

	render() {
		return (
			<div className="todo-container">
				<Login />
			</div>
		)
	}
}
