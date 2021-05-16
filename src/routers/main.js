import express from 'express'
const router = express.Router()

router.get('/', (req, res) => {
  res.render('index', {
    TITLE: 'Puppala Koushik | Computer Science Student | IIITR | Developer',
    DESCRIPTION:
      'Koushik Puppala is a student at IIIT Raichur, which is under IIT Hyderabad. He is pursuing b.tech from CSE Department'
  })
})

export default router
