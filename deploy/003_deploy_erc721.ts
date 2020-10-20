import {HardhatRuntimeEnvironment, DeployFunction} from 'hardhat/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const {deployments, getNamedAccounts} = hre;
  const {deploy} = deployments;

  const {deployer} = await getNamedAccounts();

  // await deploy("ERC721Token", {
  //   from: deployer,
  //   log: true,
  // });
};
export default func;
func.tags = ['ERC721Token'];
