import compound from "./utils/compound";
import harvest from "./utils/harvest";
import config from "./config/config";
import { ethers } from "ethers";
import { loadVault } from "./utils/loadVault";
import factoryAbi from "./abi/Factory.json";
import etherProvider from "./config/etherProvider";

(async () => {
  let factoryAddress = config.factoryAddress();

  // Load the vaults from the factory
  const factory = new ethers.Contract(factoryAddress, factoryAbi, etherProvider);
  factory.on("VaultCreated", async (owner: string, asset: string, vaultAddress: string) => {
    console.log("VaultCreated", owner, asset, vaultAddress);
    await loadVault(owner, asset, vaultAddress);
  });

  // TODO load the vaults from the vaults.json file
})();
