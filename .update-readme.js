#!/usr/bin/env node
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const slash = require('slash');
const path = require('path');
const templateString = `
## Test Coverage

<table style="border-collapse: collapse;width: 100%; text-align: right;" >
<thead>
<tr style="border-bottom: 1px solid #bbb;">
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="file" data-fmt="html" data-html="true" class="file">File</th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="pic" data-type="number" data-fmt="html" data-html="true" class="pic"></th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="statements" data-type="number" data-fmt="pct" class="pct">Statements</th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="statements_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="branches" data-type="number" data-fmt="pct" class="pct">Branches</th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="branches_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="functions" data-type="number" data-fmt="pct" class="pct">Functions</th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="functions_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="lines" data-type="number" data-fmt="pct" class="pct">Lines</th>
   <th style="background: #eeeeee; color: black; text-align: left; font-weight: normal; white-space: nowrap; padding: 10px;" data-col="lines_raw" data-type="number" data-fmt="html" class="abs"></th>
</tr>
</thead>
<tbody style="border: 1px solid #bbb;">
{{#each summary}}
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="file {{this.statements.levelClass}}" ><a href="{{this.filepath}}">{{this.name}}/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; {{this.statements.style}}" class="pic {{this.statements.levelClass}}"><div style="border-right: none !important; line-height: 0; {{this.statements.chartStyle}}"><div style="display:inline-block;
  height: 12px; width: {{this.statements.pct}}%; {{this.statements.fillStyle}}"></div><div style="display:inline-block; height: 12px; background: white; width:{{this.statements.rest_pct}}%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="pct {{this.statements.levelClass}}">{{this.statements.pct}}%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="abs {{this.statements.levelClass}}">{{this.statements.covered}}/{{this.statements.total}}</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="pct {{this.branches.levelClass}}">{{this.branches.pct}}%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="abs {{this.branches.levelClass}}">{{this.branches.covered}}/{{this.branches.total}}</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="pct {{this.functions.levelClass}}">{{this.functions.pct}}%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="abs {{this.functions.levelClass}}">{{this.functions.covered}}/{{this.functions.total}}</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="pct {{this.lines.levelClass}}">{{this.lines.pct}}%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; {{this.statements.style}}" class="abs {{this.lines.levelClass}}">{{this.lines.covered}}/{{this.lines.total}}</td>
</tr>
{{/each}}
</tbody>
</table>
`;

const template = Handlebars.compile(templateString);

const summary = JSON.parse(
  fs.readFileSync(`coverage/coverage-summary.json`).toString()
);

const list = [];
const excludes = [];
// [
//   'src/solc_0.5.12',
//   'src/solc_0.7/Test',
//   'src/solc_0.7/Interfaces',
//   'src/solc_0.7/BaseERC20TransferRecipient.sol',
// ];
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

  function addHelpers(obj) {
    obj.rest_pct = 100 - obj.pct;
    if (obj.pct < 50) {
      obj.levelClass = 'low';
      obj.style = 'background:#FCE1E5;';
      obj.fillStyle = 'background:#C21F39;';
      obj.chartStyle = ''; //'border:1px solid #C21F39;';
    } else if (obj.pct < 90) {
      obj.levelClass = 'medium';
      obj.style = 'background: #fff4c2;';
      obj.fillStyle = 'background: #f9cd0b;';
      obj.chartStyle = ''; //'border:1px solid #f9cd0b;';
    } else {
      obj.levelClass = 'high';
      obj.style = 'background:rgb(230,245,208);';
      obj.fillStyle = 'background:rgb(77,146,33);';
      obj.chartStyle = ''; //'border:1px solid rgb(77,146,33);';
    }

    return obj;
  }

  const statements = addHelpers(summary[key].statements);
  const functions = addHelpers(summary[key].functions);
  const lines = addHelpers(summary[key].lines);
  const branches = addHelpers(summary[key].branches);

  list.push({
    filepath,
    name,
    statements,
    functions,
    lines,
    branches,
  });
}
const result = template({summary: list, total: summary.total});
let readme = fs.readFileSync('README.md').toString();
const split1 = readme.split('<!--BEGIN_TEST_COVERAGE_SUMMARY-->');
const split2 = readme.split('<!--END_TEST_COVERAGE_SUMMARY-->');
readme = `${
  split1[0]
}<!--BEGIN_TEST_COVERAGE_SUMMARY-->\n${result}\n<!--END_TEST_COVERAGE_SUMMARY-->${
  split2[1] || ''
}`;
fs.writeFileSync('README.md', readme);
