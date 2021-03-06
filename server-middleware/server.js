const express = require('express')
const cors = require('cors')

const branchRouter = require('./routers/branchs')

const app = express()

app.use(cors({ credentials: true, origin: true }))

app.use(express.json())

app.use(branchRouter)

module.exports = app
