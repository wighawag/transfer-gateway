import assert from "assert";
import { ethers, deployments, getNamedAccounts } from "@nomiclabs/buidler";
const { diamond } = deployments;

import chai, { expect } from "chai";
import { waffleChai } from "@ethereum-waffle/chai";
chai.use(waffleChai);

let deployer: string;
before(async function () {
  const namedAccounts = await getNamedAccounts();
  deployer = namedAccounts.deployer;
});

describe("Diamond", function () {
  beforeEach(async function () {
    await deployments.fixture();
  });

  it("hello world", async function () {
    const DiamondExample = await ethers.getContract("DiamondExample");
    assert.equal(await DiamondExample.hello("world"), "hello world");
  });

  it("hello world fails after upgrade", async function () {
    await diamond.deploy("DiamondExample", {
      from: deployer,
      facets: ["ActionFacet", "NewFacet", "TestFacet"],
    });
    const DiamondExample = await ethers.getContract("DiamondExample");

    expect(() => DiamondExample.hello("world")).to.throw(
      "DiamondExample.hello is not a function"
    );

    assert.equal(await DiamondExample.hello2("world"), "hello2 world");
    assert.equal((await DiamondExample.getNumber()).toString(), "0");
  });
});
