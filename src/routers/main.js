const router = require('express').Router()
const ContactSchema = require('../database/model/contact.js')
const { check, validationResult } = require('express-validator')

router.get('/', (req, res) => {
  res.render('index', {
    TITLE: 'Puppala Koushik | Computer Science Student | IIITR(Indian Institute of Information Technology, Raichur) | Computer Programmer',
    DESCRIPTION: 'Puppala Koushik is a Student at Indian Institute of Information Technology, Raichur. He is pursuing B.Tech in C.S.E Department. I am making few Websites, helping in IIITR website and making few app',
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
      TITLE: 'Puppala Koushik | Computer Science Student | IIITR(Indian Institute of Information Technology, Raichur) | Computer Programmer',
      DESCRIPTION: 'Puppala Koushik is a Student at Indian Institute of Information Technology, Raichur. He is pursuing B.Tech in C.S.E Department. I am making few Websites, helping in IIITR website and making few app',
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
          TITLE: 'Puppala Koushik | Computer Science Student | IIITR(Indian Institute of Information Technology, Raichur) | Computer Programmer',
          DESCRIPTION: 'Puppala Koushik is a Student at Indian Institute of Information Technology, Raichur. He is pursuing B.Tech in C.S.E Department. I am making few Websites, helping in IIITR website and making few app',
          KEYWORDS: 'Puppala Koushik,PuppalaKoushik,Koushik Puppala,KoushikPuppala,Computer Science and Engineer,IIIT Raichur,IIT Hyderabad,Hyderabad,Rajahmundry,Raichur,IIITR,IITH',
          success: true
        })
      }
    })
  }
})

module.exports = router
