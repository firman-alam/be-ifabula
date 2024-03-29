const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  author: { type: String, required: true },
  qty: { type: Number, default: 0 },
  borrowers: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      borrowedAt: { type: Date, default: null },
      dueDate: { type: Date, default: null },
    },
  ],
})

module.exports = mongoose.model('Book', bookSchema)
