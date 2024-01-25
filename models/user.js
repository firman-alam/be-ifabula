const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  borrowedBook: {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null,
    },
    borrowedAt: {
      type: Date,
      default: null,
    },
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
