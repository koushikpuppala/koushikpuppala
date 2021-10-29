/** @format */

import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Main from './Pages/Main'
import NotFound from './Pages/NotFound'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

toast.configure()
class App extends React.Component {
	componentDidMount() {
		if (navigator.onLine) {
			toast.success('You are online!')
		} else {
			toast.error('You are offline!', { autoClose: false })
		}
	}
	shouldComponentUpdate() {
		return false
	}
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
