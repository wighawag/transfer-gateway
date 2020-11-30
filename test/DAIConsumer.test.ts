import {expect} from './chai-setup';
import hre from 'hardhat';
import deployDAIComsumer from './deploy/deploy_dai_consumer';
const {ethers, deployments, getUnnamedAccounts, getNamedAccounts} = hre;

function setupUsers(users: string[]) {
  return Promise.all(
    users.map((acc: string) =>
      (async () => {
        return {
          address: acc,
          DAI: await ethers.getContract('DAI', acc),
        };
      })()
    )
  );
}

const setup = deployments.createFixture(async () => {
  await deployments.fixture(['ERC20TransferGateway', 'DAI']);
  await deployDAIComsumer(hre);
  const {deployer} = await getNamedAccounts();
  const others = await getUnnamedAccounts();
  const DAIAsMinter = await ethers.getContract('DAI', deployer);

  for (const other of others) {
    // give others 100 DAI
    await DAIAsMinter.mint(other, '100000000000000000000');
  }

  const setupObject = {
    DAIConsumer: await ethers.getContract('DAIConsumer'),
    ERC20TransferGateway: await ethers.getContract('ERC20TransferGateway'),
    DAI: await ethers.getContract('DAI'),
    others: await setupUsers(others),
  };

  for (const other of setupObject.others) {
    // for all others : allow transfer gateway
    await other.DAI.approve(
      setupObject.ERC20TransferGateway.address,
      '0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF'
    );
  }

  return setupObject;
});

describe('DAIConsumer', function () {
  it('calling it directly without pre-approval result in Allowance error', async function () {
    const {DAIConsumer} = await setup();
    await expect(DAIConsumer.purchase(1)).to.be.revertedWith(
      'Dai/insufficient-allowance'
    );
  });

  it('calling it via erc20transfer gateway works', async function () {
    const {DAIConsumer, ERC20TransferGateway, DAI} = await setup();
    const {data, to} = await DAIConsumer.populateTransaction.purchase(1);
    await ERC20TransferGateway.transferERC20AndCall(
      DAI.address,
      '500000000000000000',
      to,
      data
    );
  });

  it('calling it via erc20transfer gateway but with wrong amount fails', async function () {
    const {DAIConsumer, ERC20TransferGateway, DAI} = await setup();
    const {data, to} = await DAIConsumer.populateTransaction.purchase(1);
    await expect(
      ERC20TransferGateway.transferERC20AndCall(
        DAI.address,
        '400000000000000000',
        to,
        data
      )
    ).to.be.revertedWith('UNEXPECTED_AMOUNT');
  });
});
