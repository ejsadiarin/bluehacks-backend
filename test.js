import { sendSMSMessage } from "macky-sms";
import { ZemmParser } from "./zemm/zemm.js";

const zemm = new ZemmParser()

const values = {
    name: "ejs",
    headCount: "1",
    desc: "desdkvjsfdvdf sdfksdfj",
    image: "",
}
const lat = 14
const lng = 30

const data = { data: values, lat, lng };
const d = zemm.encode(data)
sendSMSMessage("http://localhost:3000/send-sos", d);

// 2
const values2 = {
    name: "ejs",
    headCount: "1",
    desc: "desdkvjsfdvdf sdfksdfj",
    image: "",
}
const lat2 = 14
const lng2 = 30

const data2 = { data: values2, lat2, lng2 };
const d2 = zemm.encode(data2)
sendSMSMessage("http://localhost:3000/send-sos", d2);
