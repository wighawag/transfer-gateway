#!/usr/bin/env node
const fs = require('fs-extra');

if (!fs.existsSync('.vscode/settings.json')) {
  fs.copyFileSync('.vscode/settings.json.default', '.vscode/settings.json');
}

// To ensure that when transfer-gateway is used as a library, the import resolve to the frozen dep in src/openzeppelin
// we copy the openzeppelin source code in the src folder and import them from here instead of "@openzeppelin"
fs.emptyDirSync('src/openzeppelin');
fs.copySync('node_modules/@openzeppelin', 'src/openzeppelin');
