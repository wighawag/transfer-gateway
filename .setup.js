#!/usr/bin/env node
const fs = require('fs-extra');
function copyFromDefault(p) {
  if (!fs.existsSync(p)) {
    const defaultFile = `${p}.default`;
    if (fs.existsSync(defaultFile)) {
      fs.copyFileSync(`${p}.default`, p);
    }
  }
}

['.vscode/settings.json', '.vscode/extensions.json', '.vscode/launch.json'].map(
  copyFromDefault
);

// To ensure that when transfer-gateway is used as a library, the import resolve to the frozen dep in src/openzeppelin
// we copy the openzeppelin source code in the src folder and import them from here instead of "@openzeppelin"
fs.emptyDirSync('_lib/openzeppelin');
fs.copySync('node_modules/@openzeppelin', '_lib/openzeppelin');
