import {
  BuidlerRuntimeEnvironment,
  DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { deploy, execute, read, log } = deployments;

  const { deployer } = await getNamedAccounts();

  await deploy("Greeter", { from: deployer, args: ["hello world"], log: true });

  const currentGreeting = await read("Greeter", "greet");
  log({ currentGreeting });

  if (!bre.network.live) {
    await execute(
      "Greeter",
      { from: deployer, log: true },
      "setGreetingThatWorks",
      "hi"
    );
  }
};
export default func;
