const config = require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const database = require('./database/index')
const ContactSchema = require('./database/model/contact')

/* Making Constants */
const app = express()
const port = config.Port
const host = config.Host

/* Setting up the Environment */
app.disable('x-powered-by')
app.use(cors())
app.use(bodyParser.json())
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)
database()

app.get('/', (req, res) => {
	res.status(200).send('I am Ready with Database')
})
app.post('/contact', (req, res) => {
	const ContactForm = ContactSchema({
		Name: req.body.Name,
		Email: req.body.Email,
		Subject: req.body.Subject,
		Message: req.body.Message,
	})

	ContactForm.save(ContactForm)
		.then((data) => {
			res.status(200).send(data)
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || 'Some error occurred while Adding Hospital to Database.',
			})
		})
})

/* Running the server */
app.listen(port, host, () => {
	console.log(`Website is running at http://localhost:${port}`)
})
