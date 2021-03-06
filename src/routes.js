const express = require('express')
const router = express.Router()
const {check, validationResult} = require('express-validator/check')
const {matchedData} = require('express-validator/filter')

const PoiController = require('./controllers/PoiController')

router.get('/', (req, res) => {
  res.render('index')
})

// routes.js
router.get('/poi', (req, res) => {
  res.render('poi', {
    data: {},
    errors: {}
  })
})

router.post('/poi', [
  check('title')
    .isLength({min: 1})
    .withMessage('Title is required'),
  check('location')
    .isLength({min: 1})
    .withMessage('Location is required'),
  check('date')
    .isLength({min: 1})
    .withMessage('Date is required'),
  check('description')
    .isLength({min: 20})
    .withMessage('Description is too short. It needs to be at least 20 characters long.'),
  check('links')
], (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.render('poi', {
      data: req.body,
      errors: errors.mapped()
    })
  }
  const data = matchedData(req)
  console.log('Sanitized: ', data)
  PoiController.create(data, function (error) {
    if (!error) {
      req.flash('success', 'Thanks for the submission! :)')
      res.redirect('/')
    } else {
      req.flash('error', 'Your registration failed please try again! :(')
      res.redirect('/')
    }
  })
})

module.exports = router
