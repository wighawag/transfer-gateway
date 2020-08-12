import {
  BuidlerRuntimeEnvironment,
  DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const ALibrary = await deployments.get("ALibrary");

  await deploy("AContract", {
    from: deployer,
    log: true,
    libraries: {
      ALibrary: ALibrary.address,
    },
  });
};
export default func;
func.tags = ["AContract"];
func.dependencies = ["ALibrary"];
