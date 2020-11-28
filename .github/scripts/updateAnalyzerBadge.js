const { readFileSync, writeFileSync } = require("fs");

// Read analyzers file
const analyzersFile = readFileSync("src/config/analyzers.json");
const analyzers = JSON.parse(analyzersFile);

// Write the badge content
let content = readFileSync("./.github/badges/templateAnalyzers.svg").toString();
content = content.replace(/##COUNT##/g, analyzers.length);
writeFileSync("./.github/current/analyzers.svg", content);

console.info("Analyzers: " + analyzers.length);