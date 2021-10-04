#!/usr/bin/env node
const fs = require('fs-extra');
const slash = require('slash');
const path = require('path');

const summary = JSON.parse(
  fs.readFileSync(`coverage/coverage-summary.json`).toString()
);

const excludes = [
  'src/solc_0.5.12',
  'src/solc_0.8',
  'src/solc_0.7/Test',
  'src/solc_0.7/Interfaces',
  'src/solc_0.7/BaseERC20TransferRecipient.sol',
];
let result = `
## Test Coverage

|     | File | Statements |     | Functions |     | Branches |     | Lines |     |
| :-: | :--- | ---------: | --: | --------: | --: | -------: | --: | ----: | --: |
`;

for (const key of Object.keys(summary)) {
  if (key === 'total') {
    continue;
  }
  const filepath = slash(key);
  const name = path.basename(filepath);
  let excluding = false;
  for (const exclude of excludes) {
    if (filepath.startsWith(exclude)) {
      excluding = true;
      break;
    }
  }
  if (excluding) {
    continue;
  }

  const data = summary[key];
  const statements = data.statements;

  let mark = '';
  if (statements.pct < 50) {
    mark = ':exclamation:';
  } else if (statements.pct < 100) {
    mark = ':warning:';
  } else {
    mark = ':heavy_check_mark:';
  }

  console.log(data);

  result +=
    `| ${mark} | [${name}](${filepath}) | ${statements.pct}% | ${
      statements.covered
    }/${statements.total} | ${data.functions.pct}% | ${
      data.functions.covered
    }/${data.functions.total} | ${
      data.branches.total > 0 ? `${data.branches.pct}%` : '-'
    } | ${
      data.branches.total > 0
        ? `${data.branches.covered}/${data.branches.total}`
        : '-'
    } | ${data.lines.pct}% | ${data.lines.covered}/${data.lines.total} |` +
    '\n';
}
let readme = fs.readFileSync('README.md').toString();
const split1 = readme.split('<!--BEGIN_TEST_COVERAGE_SUMMARY-->');
const split2 = readme.split('<!--END_TEST_COVERAGE_SUMMARY-->');
readme = `${
  split1[0]
}<!--BEGIN_TEST_COVERAGE_SUMMARY-->\n${result}\n<!--END_TEST_COVERAGE_SUMMARY-->${
  split2[1] || ''
}`;
fs.writeFileSync('README.md', readme);
