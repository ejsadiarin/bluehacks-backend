import { ZemmParser } from "./zemm.js";

const parser = new ZemmParser();

// DECODE (parse) TEST

console.log("\n");

// 3 SECTIONS TEST
const zemm1 = "001003dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor";
const zemm2 = "002003dFGcc1libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po2 saklol";
const zemm3 = "003003dFGcc1o po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po l3";

let result = parser.decode(zemm1);
result = parser.decode(zemm3);
result = parser.decode(zemm2);
console.log("3 SECTION TEST");
console.log(result);

console.log("\n");

// 1 SECTION TEST
const sec1_zemm1 = "001001dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor";
let sec1_test = parser.decode(sec1_zemm1);
console.log("1 SECTION TEST");
console.log(sec1_test);

// ENCODE TEST
// const zdata = [
//     {
//         section: 1,
//         maxSections: 1,
//         uuid: 'dFGc',
//         raw: [
//             '001001dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor'
//         ],
//         data: {
//             c1: '14.5665132,120.9932811',
//             n: 'john mark',
//             hc: '3',
//             d: 'saklolo po libog n po kami d2 sa bacoor'
//         },
//         done: true
//     },
//     {
//         section: 1,
//         maxSections: 1,
//         uuid: 'dFGc',
//         raw: [
//             '001001dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor'
//         ],
//         data: {
//             c1: '14.5665132,120.9932811',
//             n: 'john mark',
//             hc: '3',
//             d: 'saklolo po libog n po kami d2 sa bacoor'
//         },
//         done: true
//     }
// ]


const zdata = {
    data: {
        c1: '14.5665132,120.9932811',
        n: 'john mark',
        hc: '3',
        lat: 14.55,
        long: 7.3,
    }
}

console.log(parser.encode(zdata))
