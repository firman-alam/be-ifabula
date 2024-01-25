const jwt = require('jsonwebtoken')

const getUserIdFromToken = (authorizationHeader) => {
  if (!authorizationHeader) {
    return null
  }

  const token = authorizationHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
    return decoded.userId
  } catch (error) {
    console.error(error)
    return null
  }
}

module.exports = getUserIdFromToken
