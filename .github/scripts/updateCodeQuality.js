const { readFileSync, copyFileSync } = require("fs");

const content = readFileSync("tslint_result.json");
const data = JSON.parse(content.toString());
console.info(data.length + " lints");

if ( data.length > 30 ) {
    copyFileSync("./.github/bagdes/codeQualityD.svg", "./.github/current/quality.svg");
} else if ( data.length > 20 ) {
    copyFileSync("./.github/badges/codeQualityC.svg", "./.github/current/quality.svg");
} else if ( data.length > 10 ) {
    copyFileSync("./.github/badges/codeQualityB.svg", "./.github/current/quality.svg");
} else {
    copyFileSync("./.github/badges/codeQualityA.svg", "./.github/current/quality.svg");
}

console.info("OK");