import { run, ethers } from "@nomiclabs/buidler";

async function main() {
  await run("compile");

  const accounts = await ethers.getSigners();

  const addresses = await Promise.all(accounts.map((acc)=> acc.getAddress()));
  console.log("Accounts:", addresses);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });