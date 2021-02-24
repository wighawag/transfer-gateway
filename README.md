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
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="file low" ><a href="src/solc_0.5.12/Dai.sol">Dai.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:#FCE1E5;" class="pic low"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 5%; background:#C21F39;"></div><div style="display:inline-block; height: 12px; background: white; width:95%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">5%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">2/40</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/26</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">6.25%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">1/16</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">4.88%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">2/41</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="file high" ><a href="src/solc_0.7/BaseERC20TransferRecipient.sol">BaseERC20TransferRecipient.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:rgb(230,245,208);" class="pic high"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 100%; background:rgb(77,146,33);"></div><div style="display:inline-block; height: 12px; background: white; width:0%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">5/5</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">2/2</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">3/3</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">6/6</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="file medium" ><a href="src/solc_0.7/ERC20TransferGateway.sol">ERC20TransferGateway.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background: #fff4c2;" class="pic medium"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 66.67%; background: #f9cd0b;"></div><div style="display:inline-block; height: 12px; background: white; width:33.33%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct medium">66.67%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs medium">6/9</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct medium">75%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs medium">3/4</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct medium">66.67%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs medium">6/9</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="file low" ><a href="src/solc_0.7/ERC721TransferGateway.sol">ERC721TransferGateway.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:#FCE1E5;" class="pic low"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 0%; background:#C21F39;"></div><div style="display:inline-block; height: 12px; background: white; width:100%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/13</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/4</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/13</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="file high" ><a href="src/solc_0.7/Interfaces/DAIERC20.sol">DAIERC20.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:rgb(230,245,208);" class="pic high"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 100%; background:rgb(77,146,33);"></div><div style="display:inline-block; height: 12px; background: white; width:0%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="file high" ><a href="src/solc_0.7/Interfaces/ERC20With2612.sol">ERC20With2612.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:rgb(230,245,208);" class="pic high"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 100%; background:rgb(77,146,33);"></div><div style="display:inline-block; height: 12px; background: white; width:0%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="file medium" ><a href="src/solc_0.7/Test/BaseERC20.sol">BaseERC20.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background: #fff4c2;" class="pic medium"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 60.47%; background: #f9cd0b;"></div><div style="display:inline-block; height: 12px; background: white; width:39.53%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct medium">60.47%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs medium">26/43</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct low">45.83%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs low">11/24</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct low">40%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs low">4/10</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="pct medium">60.47%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background: #fff4c2;" class="abs medium">26/43</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="file low" ><a href="src/solc_0.7/Test/DAIWithInitialBalance.sol">DAIWithInitialBalance.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:#FCE1E5;" class="pic low"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 9.09%; background:#C21F39;"></div><div style="display:inline-block; height: 12px; background: white; width:90.91%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">9.09%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">1/11</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/8</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">25%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">1/4</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">9.09%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">1/11</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="file high" ><a href="src/solc_0.7/Test/ERC20Consumer.sol">ERC20Consumer.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:rgb(230,245,208);" class="pic high"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 100%; background:rgb(77,146,33);"></div><div style="display:inline-block; height: 12px; background: white; width:0%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">11/11</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct medium">75%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs medium">6/8</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">3/3</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">11/11</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="file low" ><a href="src/solc_0.7/Test/ERC20WithInitialBalance.sol">ERC20WithInitialBalance.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:#FCE1E5;" class="pic low"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 0%; background:#C21F39;"></div><div style="display:inline-block; height: 12px; background: white; width:100%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/11</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/6</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/4</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="pct low">0%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:#FCE1E5;" class="abs low">0/11</td>
</tr>
<tr style="border-bottom: 1px solid #bbb;">
	<td style="text-align: left; white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="file high" ><a href="src/solc_0.7/Test/NFTConsumer.sol">NFTConsumer.sol/</a></td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; min-width: 120px !important; background:rgb(230,245,208);" class="pic high"><div style="border-right: none !important; line-height: 0; "><div style="display:inline-block;
  height: 12px; width: 100%; background:rgb(77,146,33);"></div><div style="display:inline-block; height: 12px; background: white; width:0%;"></div></div></td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
	<td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="pct high">100%</td>
  <td style="white-space: nowrap; color: black; border-right: 1px solid #bbb; background:rgb(230,245,208);" class="abs high">0/0</td>
</tr>
</tbody>
</table>

<!--END_TEST_COVERAGE_SUMMARY-->undefined