const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require("cors")
require("dotenv").config()

const corsOptions = require("./config/corsOptions")

const PORT = process.env.PORT || 9000

app.use(cors(corsOptions))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use('/user', require('./routes/user-route'))
app.use('/book', require('./routes/book-route'))

mongoose
  .connect(process.env.MONGODBURL)
  .then(() => console.log('DB Connected!'))

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
