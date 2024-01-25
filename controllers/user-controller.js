const bcrypt = require('bcrypt')
const User = require('../models/user')

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

    res
      .status(201)
      .json({ message: 'User created successfully', user: newUser })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
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

    res.status(200).json({ message: 'Sign in successful', user: user })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}

module.exports = { sign_in, sign_up }
