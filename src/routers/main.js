const router = require('express').Router()
const ContactSchema = require('../database/model/contact.js')
const { check, validationResult } = require('express-validator')

router.get('/', (req, res) => {
	res.render('index', {
		TITLE: 'Koushik Puppala | Computer Science Engineer',
		DESCRIPTION: 'Koushik Puppala is a Student at the Indian Institute of Information Technology, Raichur. I am making few Websites, helping with the IIITR website, and making a few apps',
		KEYWORDS: 'Puppala Koushik,PuppalaKoushik,Koushik Puppala,KoushikPuppala,Computer Science and Engineer,IIIT Raichur,IIT Hyderabad,Hyderabad,Rajahmundry,Raichur,IIITR,IITH',
		success: false
	})
})

router.post('/', [
	check('Name', 'You must Enter your Name').not().isEmpty(),
	check('Email', 'You must Enter your Email').not().isEmpty(),
	check('Email', 'Your Email is not valid').isEmail().normalizeEmail(),
	check('Subject', 'You must Enter Subject').not().isEmpty(),
	check('Message', 'You must Enter Message what you want to tell').not().isEmpty()
], (req, res) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		const alert = errors.array()
		res.render('submit', {
			TITLE: 'Koushik Puppala | Computer Science Engineer',
			DESCRIPTION: 'Koushik Puppala is a Student at the Indian Institute of Information Technology, Raichur. I am making few Websites, helping with the IIITR website, and making a few apps',
			KEYWORDS: 'Puppala Koushik,PuppalaKoushik,Koushik Puppala,KoushikPuppala,Computer Science and Engineer,IIIT Raichur,IIT Hyderabad,Hyderabad,Rajahmundry,Raichur,IIITR,IITH',
			alert,
			success: false
		})
	} else {
		const ContactForm = ContactSchema({
			Name: req.body.Name,
			Email: req.body.Email,
			Subject: req.body.Subject,
			Message: req.body.Message
		})
		ContactForm.save(ContactForm, (err, collection) => {
			if (err) {
				res.send(err)
			} else {
				res.render('submit', {
					TITLE: 'Koushik Puppala | Computer Science Engineer',
					DESCRIPTION: 'Koushik Puppala is a Student at the Indian Institute of Information Technology, Raichur. I am making few Websites, helping with the IIITR website, and making a few apps',
					KEYWORDS: 'Puppala Koushik,PuppalaKoushik,Koushik Puppala,KoushikPuppala,Computer Science and Engineer,IIIT Raichur,IIT Hyderabad,Hyderabad,Rajahmundry,Raichur,IIITR,IITH',
					success: true
				})
			}
		})
	}
})

module.exports = router
