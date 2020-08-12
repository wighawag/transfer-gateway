import {
  BuidlerRuntimeEnvironment,
  DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { execute, log, read } = deployments;
  const { deployer, admin } = await getNamedAccounts();

  const currentAdmin = await read("Greeter", "getAdmin");
  if (currentAdmin !== admin) {
    log(`setting admin from ${currentAdmin} to ${admin}...`);
    await execute(
      "Greeter",
      { from: currentAdmin, log: true },
      "setAdmin",
      admin
    );
    log(`admin set to ${admin}`);
  }
};
export default func;
func.runAtTheEnd = true;
