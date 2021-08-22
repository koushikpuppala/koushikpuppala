/** @format */

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Main from './Pages/Main'
import NotFound from './Pages/NotFound'

class App extends React.Component {
	render() {
		return (
			<div>
				<Router>
					<Switch>
						<Route path='/' component={Main} exact />
						<Route path='*' component={NotFound} />
					</Switch>
				</Router>
			</div>
		)
	}
}

export default App
