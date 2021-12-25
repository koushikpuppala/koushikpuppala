import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'boxicons/css/boxicons.min.css'
import 'aos/dist/aos.css'
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
