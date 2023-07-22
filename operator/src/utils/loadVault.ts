import fs from "fs";
import { ethers } from "ethers";
import etherProvider from "../config/etherProvider";
import vaultAbi from "../abi/Vault.json";
import Config from "../config/config";
import factoryAbi from "../abi/Factory.json";
import harvest from "./harvest";
import compound from "./compound";

export async function loadVault(
  owner: string,
  asset: string,
  vaultAddress: string
) {
  const content = fs.readFileSync("src/data/vaults.json", "utf8");

  const vaults = JSON.parse(content);

  const factoryAddress = Config.factoryAddress();

  const factory = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    etherProvider
  );
  const vault = new ethers.Contract(vaultAddress, vaultAbi, etherProvider);

  let vaultData;
  let i = 0;
  while (true) {
    try {
      const vault = await factory.vaultsMapping(owner, asset, i);
      if (vault[0] == vaultAddress) {
        vaultData = vault;
        break;
      }
      i++;
    } catch (err) {
      break;
    }
  }

  if (!vaultData) {
    throw new Error("Vault not found");
  }

  vaults[vaultAddress] = {
    operator: await vault.operator(),
    interval: vaultData[1] * 1000,
  };

  fs.writeFileSync("src/data/vaults.json", JSON.stringify(vaults));

  // TODO add cron job every x seconds
  let myVar = setInterval(function () {
    timer();
  }, vaultData[1] * 1000);

  async function timer() {
    try {
      console.log("new run for", vaultAddress, new Date().toLocaleString());
      await harvest(vaultAddress);
      await compound(vaultAddress);
    } catch (err) {
      console.log(err);
    }
  }
}
