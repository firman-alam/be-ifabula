const express = require('express')
const tx = require('../controllers/transaction-controller')

const router = express.Router()

router.get('/', tx.get_all_transactions)

module.exports = router
