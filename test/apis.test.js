import axios from 'axios'

const Api = async () => {
	const response = await axios('https://apis.avengers-assemble.tech')
	return console.log(response.data)
}

Api()
