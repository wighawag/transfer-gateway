#!/usr/bin/env node
const fs = require('fs-extra');
const Handlebars = require('handlebars');
const slash = require('slash');
const path = require('path');
const templateString = `
## Test Coverage

<style>
table.coverage {
  border-collapse: collapse;
  margin: 10px 0 0 0;
  padding: 0;
}

table.coverage td {
  margin: 0;
  padding: 0;
  vertical-align: top;
}
table.coverage td.line-count {
    text-align: right;
    padding: 0 5px 0 20px;
}
table.coverage td.line-coverage {
    text-align: right;
    padding-right: 10px;
    min-width:20px;
}

table.coverage td span.cline-any {
    display: inline-block;
    padding: 0 5px;
    width: 100%;
}
.coverage-summary {
  border-collapse: collapse;
  width: 100%;
}
.coverage-summary tr { border-bottom: 1px solid #bbb; }
.keyline-all { border: 1px solid #ddd; }
.coverage-summary td, .coverage-summary th { padding: 10px; }
.coverage-summary tbody { border: 1px solid #bbb; }
.coverage-summary td { color: black; border-right: 1px solid #bbb; }
.coverage-summary td:last-child { border-right: none; }
.coverage-summary th {
  background: #eeeeee;
  color: black;
  text-align: left;
  font-weight: normal;
  white-space: nowrap;
}
/* .coverage-summary th.file { border-right: none !important; } */
/* .coverage-summary th { border: 2px solid black; } */
.coverage-summary th.pct { }
.coverage-summary th.pic,
.coverage-summary th.abs,
.coverage-summary td.pct,
.coverage-summary td.abs { text-align: right; }
.coverage-summary td.file { white-space: nowrap;  }
.coverage-summary td.pic { min-width: 120px !important;  }
.coverage-summary tfoot td { }

.status-line {  height: 10px; }
/* dark red */
.red.solid, .status-line.low, .low .cover-fill { background:#C21F39 }
.low .chart { border:1px solid #C21F39 }
/* medium red */
.cstat-no, .fstat-no, .cbranch-no, .cbranch-no { background:#F6C6CE }
/* light red */
.low, .cline-no { background:#FCE1E5 }
/* light green */
.high, .cline-yes { background:rgb(230,245,208) }
/* medium green */
.cstat-yes { background:rgb(161,215,106) }
/* dark green */
.status-line.high, .high .cover-fill { background:rgb(77,146,33) }
.high .chart { border:1px solid rgb(77,146,33) }
/* dark yellow (gold) */
.medium .chart { border:1px solid #f9cd0b; }
.status-line.medium, .medium .cover-fill { background: #f9cd0b; }
/* light yellow */
.medium { background: #fff4c2; }
/* light gray */
span.cline-neutral { background: #eaeaea; }
.cover-fill, .cover-empty {
  display:inline-block;
  height: 12px;
}
.chart {
  line-height: 0;
}
.cover-empty {
    background: white;
}
.cover-full {
    border-right: none !important;
}
</style>

<table class="coverage-summary">
<thead>
<tr>
   <th data-col="file" data-fmt="html" data-html="true" class="file">File</th>
   <th data-col="pic" data-type="number" data-fmt="html" data-html="true" class="pic"></th>
   <th data-col="statements" data-type="number" data-fmt="pct" class="pct">Statements</th>
   <th data-col="statements_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th data-col="branches" data-type="number" data-fmt="pct" class="pct">Branches</th>
   <th data-col="branches_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th data-col="functions" data-type="number" data-fmt="pct" class="pct">Functions</th>
   <th data-col="functions_raw" data-type="number" data-fmt="html" class="abs"></th>
   <th data-col="lines" data-type="number" data-fmt="pct" class="pct">Lines</th>
   <th data-col="lines_raw" data-type="number" data-fmt="html" class="abs"></th>
</tr>
</thead>
<tbody>
{{#each summary}}
<tr>
	<td class="file {{this.statements.levelClass}}" ><a href="{{this.filepath}}">{{this.name}}/</a></td>
	<td class="pic {{this.statements.levelClass}}"><div class="chart"><div class="cover-fill" style="width: {{this.statements.pct}}%;"></div><div class="cover-empty" style="width:{{this.statements.rest_pct}}%;"></div></div></td>
  <td class="pct {{this.statements.levelClass}}">{{this.statements.pct}}%</td>
  <td class="abs {{this.statements.levelClass}}">{{this.statements.covered}}/{{this.statements.total}}</td>
	<td class="pct {{this.branches.levelClass}}">{{this.branches.pct}}%</td>
  <td class="abs {{this.branches.levelClass}}">{{this.branches.covered}}/{{this.branches.total}}</td>
  <td class="pct {{this.functions.levelClass}}">{{this.functions.pct}}%</td>
  <td class="abs {{this.functions.levelClass}}">{{this.functions.covered}}/{{this.functions.total}}</td>
  <td class="pct {{this.lines.levelClass}}">{{this.lines.pct}}%</td>
  <td class="abs {{this.lines.levelClass}}">{{this.lines.covered}}/{{this.lines.total}}</td>
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
const excludes = [
  'src/solc_0.5.12',
  'src/solc_0.7/Test',
  'src/solc_0.7/Interfaces',
  'src/solc_0.7/BaseERC20TransferRecipient.sol',
];
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
    obj.levelClass = obj.pct < 50 ? 'low' : obj.pct < 90 ? 'medium' : 'high';
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
readme = `${split1[0]}<!--BEGIN_TEST_COVERAGE_SUMMARY-->\n${result}\n<!--END_TEST_COVERAGE_SUMMARY-->${split2[1]}`;
fs.writeFileSync('README.md', readme);
