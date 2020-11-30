import {HardhatRuntimeEnvironment} from 'hardhat/types';
import {DeployFunction} from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  let dai = await deployments.getOrNull('DAI');
  if (!dai) {
    dai = await deploy('DAI', {
      from: deployer,
      contract: 'Dai',
      args: [await hre.getChainId()],
      log: true,
    });
  }
};
export default func;
func.tags = ['DAI'];
