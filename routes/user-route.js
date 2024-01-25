const express = require('express')
const user = require('../controllers/user-controller')

const router = express.Router()

router.post('/sign-up', user.sign_up)
router.post('/sign-in', user.sign_in)

module.exports = router
