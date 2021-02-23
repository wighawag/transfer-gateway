#!/usr/bin/env node
const fs = require('fs-extra');
fs.copyFileSync(`coverage/coverage-summary.json`, './readme-summary.json');
