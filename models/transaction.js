const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  action: { type: String, required: true },
  borrowedAt: { type: Date, default: null, required: true },
  dueDate: { type: Date, default: null },
  returnDate: { type: Date, default: null },
})

module.exports = mongoose.model('Transaction', transactionSchema)
