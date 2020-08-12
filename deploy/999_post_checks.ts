import {
  BuidlerRuntimeEnvironment,
  DeployFunction,
} from "@nomiclabs/buidler/types";

const func: DeployFunction = async function (bre: BuidlerRuntimeEnvironment) {
  const { deployments } = bre;
  const { read } = deployments;

  const example = await deployments.get("Example");
  console.log({ example: example.address });
  console.log(
    `example at ${example.address} : ${await read("Example", "greet")}`
  );
};

export default func;
func.runAtTheEnd = true;
