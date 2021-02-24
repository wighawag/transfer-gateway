# Transfer Gateways

_Another way to solve the two step approve and transfer process_

Transfer gateways are intermediary contract that make the transfer to the destination contract before calling the contract.

They can be pre-approved globally as immutable address from the ERC20 contract (see \_gateway in [solc_0.7/Test/BaseERC20.sol](solc_0.7/Test/BaseERC20.sol)) so ERC20 contract can benefit from it without requiring user confirmation.

Alternatively for existing contract, users can approve it only once and can then make purchase in any contract that support such gateways.

This technic is not exclusive to ERC20 and can be used for other contract types.

I am planning to make an ERC721Gateway that support the transfer of multiple ERC721 (from different token contract). use case : https://mystery.market so we can deploy new sale contract without every time requiring approval for transferring ERC721 into it.

## How it works

Let say there is a Sale Contract that sell some things (represented by id) for a specific price

User create the data to make the call to SaleContract

```js
const { data, to } = await SaleContract.populateTransaction.purchase(1);
```

Then the User call the TransferGateway `transferERC20AndCall` function with the tokeen address and amount to transfer

As shown in the diagram below, this in turn

- perforrm a transfer on the token to send the token to the destination
- call the destination and append the data, namely the sender, token address and amount to the msg.data (same as in [EIP-2771](https://eips.ethereum.org/EIPS/eip-2771))

![Diagram](diagram_transferERC20AndCall.svg)

<!--
```
sequenceDiagram
	User->>TransferGateway:transferERC20AndCall
    TransferGateway->>ERC20Token: transferFrom(user,SaleContract,amount)
	TransferGateway->>SaleContract: purchase(id)+apendedData(token,amount,sender)
```
-->

## Alternative: forwarding

The Gateway also allow to operate without any approval, by letting the sender make an atomic call that first transfer the token to the gateway and then call `forward` as shown in the following diagram:

![Diagram](diagram_forward.svg)

<!--
```
sequenceDiagram
	User->>AtomicContract:transaction
    rect rgb(100, 200, 200)
    AtomicContract->>ERC20Token: transferFrom(user, TransferGateway, amount)
    AtomicContract->>TransferGateway:forward
    end
    TransferGateway->>ERC20Token: transferFrom(this,SaleContract,amount)
	TransferGateway->>SaleContract: purchase(id)+apendedData(token,amount,sender)
```
-->
<!--BEGIN_TEST_COVERAGE_SUMMARY-->

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
<tr>
	<td class="file medium" ><a href="src/solc_0.7/ERC20TransferGateway.sol">ERC20TransferGateway.sol/</a></td>
	<td class="pic medium"><div class="chart"><div class="cover-fill" style="width: 66.67%;"></div><div class="cover-empty" style="width:33.33%;"></div></div></td>
  <td class="pct medium">66.67%</td>
  <td class="abs medium">6/9</td>
	<td class="pct high">100%</td>
  <td class="abs high">0/0</td>
  <td class="pct medium">75%</td>
  <td class="abs medium">3/4</td>
  <td class="pct medium">66.67%</td>
  <td class="abs medium">6/9</td>
</tr>
<tr>
	<td class="file low" ><a href="src/solc_0.7/ERC721TransferGateway.sol">ERC721TransferGateway.sol/</a></td>
	<td class="pic low"><div class="chart"><div class="cover-fill" style="width: 0%;"></div><div class="cover-empty" style="width:100%;"></div></div></td>
  <td class="pct low">0%</td>
  <td class="abs low">0/13</td>
	<td class="pct high">100%</td>
  <td class="abs high">0/0</td>
  <td class="pct low">0%</td>
  <td class="abs low">0/4</td>
  <td class="pct low">0%</td>
  <td class="abs low">0/13</td>
</tr>
</tbody>
</table>

<!--END_TEST_COVERAGE_SUMMARY-->undefined