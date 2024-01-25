const bcrypt = require('bcrypt')

const User = require('../models/user')
const generateToken = require('../utils/generateJwt')
const getUserIdFromToken = require('../utils/getUserIdFromToken')

const sign_up = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body

    // Check if the email is already registered
    const duplicateUser = await User.findOne({ email }).lean().exec()
    if (duplicateUser) {
      return res.status(409).json({ message: 'Email is already registered' })
    }

    // Hash the password before storing it
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user with the hashed password
    const newUser = await User.create({
      email,
      password: hashedPassword,
      isAdmin,
    })

    res.status(201).json({
      message: 'User created successfully',
      user: newUser,
      status: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message, status: false })
  }
}

const sign_in = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find the user by email
    const user = await User.findOne({ email }).exec()

    // Check if the user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Check if the password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    const token = generateToken(user._id, user.email)

    res.status(200).json({
      message: 'Sign in successful',
      user,
      token,
      status: true,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: error.message, status: false })
  }
}

const data_user = async (req, res) => {
  const id = getUserIdFromToken(req.headers.authorization)

  if (!id) {
    return res.status(400).json({ message: 'User Id required' })
  }

  const user = await User.findById(id).select('-password').exec()

  if (!user) {
    return res.status(400).json({ message: 'User not found' })
  }

  res.status(200).json({ data: user })
}

const all_user = async (req, res) => {
  const users = await User.find().select('-password').lean()

  if (!users?.length) {
    return res.status(400).json({ message: 'No users found' })
  }

  res.status(200).json({ data: users })
}

const borrowed_user = async (req, res) => {
  try {
    const users = await User.find({ 'borrowedBook.book': { $ne: null } })
      .select('-password')
      .lean()

    if (!users?.length) {
      return res
        .status(400)
        .json({ message: 'No users found with borrowed books' })
    }

    res.status(200).json({ data: users })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { sign_in, sign_up, data_user, all_user, borrowed_user }
