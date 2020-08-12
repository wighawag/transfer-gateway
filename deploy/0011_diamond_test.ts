import {
  BuidlerRuntimeEnvironment,
  DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = bre;
  const { diamond } = deployments;

  const { deployer } = await getNamedAccounts();

  const Greeter = await deployments.get("Greeter");

  await diamond.deploy("DiamondExample", {
    from: deployer,
    facets: ["ActionFacet", "NewFacet", "TestFacet"],
    log: true,
  });
};
export default func;
func.skip = async () => true;
