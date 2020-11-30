import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const DAI = await deployments.get('DAI');
  const erc20TransferGateway = await deployments.get('ERC20TransferGateway');

  await deploy('DAIConsumer', {
    from: deployer,
    contract: 'ERC20Consumer',
    args: [erc20TransferGateway.address, DAI.address, '500000000000000000'],
    log: true,
  });
};

export default func;
func.tags = ['DAIConsumer'];
func.dependencies = ['ERC20TransferGateway', 'DAI'];
