/** @format */

import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'

import App from './App.jsx'

ReactDOM.render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
	document.getElementById('root')
)

serviceWorker.register()