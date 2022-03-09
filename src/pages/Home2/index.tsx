import * as React from 'react';
import MyNavLink from '../../components/MyNavLink'
import { Route, Switch, Redirect } from 'react-router-dom'
import News from '@src/pages/Home2/News/index'
import Message from '@src/pages/Home2/Message/index'

export default class Home extends React.Component {

	render() {
		return (
			<div>
				<h3>我是Home的内容</h3>
				<div>
					<ul className="nav nav-tabs">
						<li>
							<MyNavLink toPage="/home/news">News</MyNavLink>
						</li>
						<li>
							<MyNavLink toPage="/home/message">Message</MyNavLink>
						</li>
					</ul>
					{/* 注册路由 */}
					<Switch>
						<Route path="/home/news" component={News} />
						<Route path="/home/message" component={Message} />
						<Redirect to="/home/news" />
					</Switch>
				</div>
			</div>
		)
	}
}
