const zemm1 = "001003dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor"
const zemm2 = "002003dFGcc1libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po2 saklol"
const zemm3 = "003003dFGcc1o po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po l3"

/*
 *
 * {
- key n val
- headers 
- key n val
- 
- 

 * }
 *
 *
 *
 *
 * */

const parseZemmHeader = (zemm) => {
    const raw = zemm.slice(0, 10)
    const section = parseInt(raw.slice(0, 3));
    const maxSections = parseInt(raw.slice(4, 6));
    const uuid = raw.slice(6, 10);

    return { section, maxSections, uuid }
}

const parseZemmKeyValue = (zemm) => {
    const kv = zemm.slice(10);

    const kv_raw = kv.split('|');
    let zemmJson = {};
    kv_raw.forEach((kva) => {
        const zemmObj = kva.split('§');
        zemmJson[zemmObj[0]] = zemmObj[1]
    })

    return zemmJson
}

const zemmSectionParser = (contents) => {
    return { headers: parseZemmHeader(contents), data: parseZemmKeyValue(contents) }
}

const zemms = [];

export const parseZemm = (contents) => {
    if (contents.length > 160) {
        return { error: "Invalid sms" }
    }

    const headers = parseZemmHeader(contents)

    const zemm = zemms.find((z) => z.uuid == headers.uuid)

    if (!zemm) {
        zemms.push(headers);
        return parseZemm(contents)
    }

    if (!zemm.raw) {
        zemm.raw = []
    }

    if (zemm.raw.length != zemm.maxSections) {
        zemm.raw.push(contents)
        zemm.section = zemm.raw.length
    }

    let zemmString = "";
    if (zemm.section == zemm.maxSections) {
        zemm.raw.sort((a, b) => parseZemmHeader(a).section - parseZemmHeader(b).section);
        const zemmString = zemm.raw.join("")

        zemm.data = zemmSectionParser(zemmString).data
        zemm.done = true
    }

    if (zemm.done) {
        return zemms.splice(zemms.indexOf(zemm), 1)
    }
    return zemm
}

let finalZemm = parseZemm(zemm1)
finalZemm = parseZemm(zemm3)
finalZemm = parseZemm(zemm2)
console.log(finalZemm)
