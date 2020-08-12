import { deployments, ethers } from "@nomiclabs/buidler";

async function main() {
  const Greeter = await ethers.getContract('Greeter');
  const greet = await Greeter.callStatic.greet();
  console.log("greet:", greet);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });