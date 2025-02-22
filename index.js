import bodyParser from 'body-parser'
import express from 'express'
import { ZemmParser } from './zemm/zemm.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))

/**
 * Information about an SOS distress signal.
 * @param {string} sender_number - The phone number of the person sending the SOS
 * @param {string} sender_name - The name of the person sending the SOS
 * @param {float} lat - The latitude of location
 * @param {float} long - The longitude of location
 * @param {number} head_count - Number of people involved in the emergency
 * @param {string} description - Detailed description of the emergency situation
 * @param {string|Buffer} image - Image data related to the emergency
 */
const sos = {}

// requires body: "003003dFGcc1o po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po l3"
// Victim-view
// POST /send-sos req.body: string
app.post("/send-sos", async (req, res) => {
    const zemm = new ZemmParser()
    const decodedData = zemm.decode(req.body.data); // Fixed: req.body instead of res.body
    // save database
    sos[decodedData.uuid] = {
        sender_number: decodedData.data.n || decodedData.data.num || decodedData.data.number || '',
        sender_name: decodedData.data.n || decodedData.data.name || '',
        lat: parseFloat(decodedData.data.lat || 0),
        lng: parseFloat(decodedData.data.long || decodedData.data.lng || 0),
        head_count: parseInt(decodedData.data.hc || decodedData.data.headCount || 0),
        description: decodedData.data.d || decodedData.data.dsec || '',
        image: decodedData.data.image || decodedData.data.img || '',
    };
    res.status(200).json({
        success: true,
        uuid: decodedData.uuid
    })
})

// Respondent-view
app.get("/list-sos", async (req, res) => {
    try {
        res.status(200).json({
            sos: sos
        })
    } catch (e) {
        console.error(e)
    }
})

// From object to "zemm" protocol format
// Respondent-view
app.get("/accept-sos/:id", async (req, res) => {
    try {
        const { id } = req.params
        const zemm = new ZemmParser()
        const data = zemm.getZemmByUUID(id)
        const raw = zemm.encode(data)

        res.status(200).json({
            "raw": raw,
        })
    } catch (e) {
        console.error(e)
    }
})

// Respondent-view
app.delete("/resolve-sos", async (req, res) => {
    try {
        res.status(200).json({
            sos: sos
        })
    } catch (e) {
        console.error(e)
    }
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
