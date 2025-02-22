import bodyParser from 'body-parser'
import express from 'express'
import { parseZemm } from './zemm/zemm.js'

const app = express()

app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

// From object to "zemm" protocol format
app.get("/send", async (req, res) => {
    res.status(200).json({
        "data": ""
    })
})

// requires body: "003003dFGcc1o po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po l3"
// GET
app.post("/receive", async (req, res) => {
    parseZemm(res.body.data)
})
