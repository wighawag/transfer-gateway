import {BuidlerRuntimeEnvironment, DeployFunction} from '@nomiclabs/buidler/types';

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = bre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  const erc20TransferGateway = await deployments.get('ERC20TransferGateway');

  await deploy('ERC20Token', {
    from: deployer,
    contract: 'DAIWithInitialBalance',
    args: ['10000000000000000000', '1000000000000000000000000000', erc20TransferGateway.address],
    log: true,
  });
};
export default func;
func.tags = ['ERC20Token'];
func.dependencies = ['ERC20TransferGateway'];
