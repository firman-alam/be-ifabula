const Transaction = require('../models/transaction')

const get_all_transactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'email')
      .populate({ path: 'book', select: 'title author' })
      .lean()

    if (!transactions?.length) {
      return res.status(400).json({ message: 'No transactions found' })
    }

    res.status(200).json({ data: transactions })
  } catch (error) {
    console.error('Error in get_all_transactions:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { get_all_transactions }
