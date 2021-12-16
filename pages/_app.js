import React from 'react'
import '../stylesheets/Global.scss'
export class App extends React.Component {
	constructor(props) {
		super(props)
		this.props = props
	}
	render() {
		return <this.props.Component {...this.props.pageProps} />
	}
}

export default App
