const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader) {
    console.log('Authorization header missing')
    return res.sendStatus(401)
  }

  const token = authHeader.split(' ')[1]

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      console.log('Token verification failed:', err)
      return res.sendStatus(403)
    }

    req.user = decoded
    next()
  })
}

module.exports = verifyJWT
