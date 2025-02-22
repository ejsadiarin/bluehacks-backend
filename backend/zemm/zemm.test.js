import { ZemmParser } from "./zemm.js";

const parser = new ZemmParser();

console.log("\n");
// 3 SECTIONS TEST
const zemm1 = "001003dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor";
const zemm2 = "002003dFGcc1libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po2 saklol";
const zemm3 = "003003dFGcc1o po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po libog n po kami d2 sa bacoor cavite saklolo po l3";

let result = parser.parse(zemm1);
result = parser.parse(zemm3);
result = parser.parse(zemm2);
console.log("3 SECTION TEST");
console.log(result);

console.log("\n");
// 1 SECTION TEST
const sec1_zemm1 = "001001dFGcc1§14.5665132,120.9932811|n§john mark|hc§3|d§saklolo po libog n po kami d2 sa bacoor";
let sec1_test = parser.parse(sec1_zemm1);
console.log("1 SECTION TEST");
console.log(sec1_test);
