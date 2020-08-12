import {
  BuidlerRuntimeEnvironment,
  DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const Greeter = await deployments.get("Greeter");

  await deploy("Example", {
    from: deployer,
    proxy: "postUpgrade",
    args: [Greeter.address],
    log: true,
  });
};
export default func;
