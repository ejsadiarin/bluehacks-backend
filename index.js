import bodyParser from 'body-parser'
import express from 'express'

const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
})
