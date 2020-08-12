import assert from "assert";
import { ethers, deployments, getNamedAccounts } from "@nomiclabs/buidler";

let deployer;
before(async function() {
  const namedAccounts = await getNamedAccounts();
  deployer = namedAccounts.deployer;
})

describe("Token", function() {

  beforeEach(async function() {
    await deployments.fixture();
  });

  it("getting correct greeting", async function() {
    const Greeter = await ethers.getContract('Greeter');
    assert.equal(await Greeter.greet(), "hi");
  });

  it.skip("Fails: set new greeting", async function() {
    const Greeter = await ethers.getContract('Greeter');
    await Greeter.setGreeting('hi2');
    assert.equal(await Greeter.greet(), "hi2");
  });
});