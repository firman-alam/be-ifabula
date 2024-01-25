const Book = require('../models/book')
const User = require('../models/user')
const Transaction = require('../models/transaction')

const add_book = async (req, res) => {
  const { title, image, author, qty } = req.body

  const duplicate = await Book.findOne({ title }).lean().exec()
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate note title' })
  }

  const book = Book.create({ title, image, author, qty })

  if (book) {
    return res.status(201).json({ message: 'Book created' })
  } else {
    return res.status(400).json({ message: 'Invalid book data received' })
  }
}

const get_all_book = async (req, res) => {
  const books = await Book.find().lean()

  if (!books?.length) {
    return res.status(400).json({ message: 'No books found' })
  }

  res.status(200).json({ data: books })
}

const get_book_by_id = async (req, res) => {
  const id = req.params.id

  if (!id) {
    return res.status(400).json({ message: 'Book Id required' })
  }

  const book = await Book.findById(id)
    .populate('borrowers.user', 'email')
    .exec()

  if (!book) {
    return res.status(400).json({ message: 'Book not found' })
  }

  res.status(200).json({ data: book })
}

const borrow_book = async (req, res) => {
  try {
    const { user_id, book_id } = req.body

    const user = await User.findById(user_id).exec()
    const book = await Book.findById(book_id).exec()

    if (!user || !book) {
      return res.status(404).json({ message: 'User or Book not found' })
    }

    if (user.borrowedBook && user.borrowedBook.book) {
      return res
        .status(400)
        .json({ message: 'User already has a borrowed book' })
    }

    if (book.qty <= 0) {
      return res
        .status(400)
        .json({ message: 'Book is not available for borrowing' })
    }

    const borrowedAt = new Date()
    const dueDate = new Date(borrowedAt)
    dueDate.setDate(dueDate.getDate() + 5)

    book.qty -= 1
    book.borrowers.push({ user: user._id, borrowedAt, dueDate })
    user.borrowedBook = { book: book._id, borrowedAt, dueDate }

    await book.save()
    await user.save()

    await Transaction.create({
      user: user._id,
      book: book._id,
      action: 'pinjam',
      borrowedAt: borrowedAt,
      dueDate: dueDate,
    })

    res.status(200).json({ message: 'Book borrowed successfully', book })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

const return_book = async (req, res) => {
  try {
    const { user_id, book_id } = req.body

    const user = await User.findById(user_id).exec()
    const book = await Book.findById(book_id).exec()

    if (!user || !book) {
      return res.status(404).json({ message: 'User or Book not found' })
    }

    if (
      !user.borrowedBook ||
      user.borrowedBook.book.toString() !== book._id.toString()
    ) {
      return res.status(400).json({ message: 'User did not borrow this book' })
    }

    book.qty += 1
    book.borrowers = book.borrowers.filter(
      (borrower) => borrower.user.toString() !== user._id.toString()
    )

    await Transaction.create({
      user: user._id,
      book: book._id,
      action: 'kembalikan',
      borrowedAt: user.borrowedBook.borrowedAt,
      dueDate: user.borrowedBook.dueDate,
      returnDate: new Date(),
    })

    user.borrowedBook = { book: null, borrowedAt: null }

    await book.save()
    await user.save()

    res.status(200).json({ message: 'Book returned successfully', book })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = {
  add_book,
  get_book_by_id,
  get_all_book,
  borrow_book,
  return_book,
}
