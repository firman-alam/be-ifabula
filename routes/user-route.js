const express = require('express')
const user = require('../controllers/user-controller')

const router = express.Router()

router.post('/sign-up', user.sign_up)
router.post('/sign-in', user.sign_in)
router.get('/data', user.data_user)
router.get('/all', user.all_user)
router.get('/borrow', user.borrowed_user)

module.exports = router
