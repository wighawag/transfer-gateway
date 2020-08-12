import { expect } from "local-chai";
import { ethers, deployments, getNamedAccounts } from "@nomiclabs/buidler";

const setup = deployments.createFixture(async () => {
  await deployments.fixture();
  const { others } = await getNamedAccounts();
  return {
    ERC20Consumer: await ethers.getContract("ERC20Consumer"),
    ERC20TransferGateway: await ethers.getContract("ERC20TransferGateway"),
    ERC20Token: await ethers.getContract("ERC20Token"),
    others: ((others as unknown) as string[]).map((acc) => {
      // TODO fix buidler-deploy type def
      return { address: acc };
    }),
  };
});

describe("ERC20Consumer", function () {
  it("calling it directly without pre-approval result in Allowance error", async function () {
    const { ERC20Consumer } = await setup();
    await expect(ERC20Consumer.purchase(1)).to.be.revertedWith(
      "NOT_ENOUGH_ALLOWANCE"
    );
  });

  it("calling it via erc20transfer gateway works", async function () {
    const {
      ERC20Consumer,
      ERC20TransferGateway,
      ERC20Token,
      others,
    } = await setup();
    const { data, to } = await ERC20Consumer.populateTransaction.purchase(1);
    await ERC20TransferGateway.transferERC20AndCall(
      ERC20Token.address,
      "500000000000000000",
      to,
      data
    );
  });

  it("calling it via erc20transfer gateway but with wrong amount fails", async function () {
    const {
      ERC20Consumer,
      ERC20TransferGateway,
      ERC20Token,
      others,
    } = await setup();
    const { data, to } = await ERC20Consumer.populateTransaction.purchase(1);
    await expect(
      ERC20TransferGateway.transferERC20AndCall(
        ERC20Token.address,
        "400000000000000000",
        to,
        data
      )
    ).to.be.revertedWith("UNEXPECTED_AMOUNT");
  });
});
