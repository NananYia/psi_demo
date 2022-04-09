import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'

export interface MyNavLinkItems {
	topage: string;
}

export default class MyNavLink extends Component<MyNavLinkItems, any> {
	constructor(props) {
		super(props);

	}
	render() {

		return (
			<NavLink activeClassName="atguigu" className="list-group-item" to={this.props.topage} {...this.props} />
		)
	}
}
