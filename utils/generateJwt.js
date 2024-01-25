const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const generateToken = (userId, userEmail) => {
  const secretKey = process.env.TOKEN_SECRET
  const expiresIn = '1d'

  const token = jwt.sign({ userId, userEmail }, secretKey, { expiresIn })
  return token
}

module.exports = generateToken
