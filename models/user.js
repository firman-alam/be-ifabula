const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  borrowedBook: {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', default: null },
    borrowedAt: { type: Date, default: null },
    dueDate: { type: Date, default: null },
  },
})

module.exports = mongoose.model('User', userSchema)
