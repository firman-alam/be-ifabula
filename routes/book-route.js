const express = require('express')
const book = require('../controllers/book-controller')

const router = express.Router()

router.get('/', book.get_all_book)
router.get('/:id', book.get_book_by_id)

router.post('/', book.add_book)
router.post('/borrow', book.borrow_book)
router.post('/return', book.return_book)

module.exports = router
