import fs from "fs";
import harvest from "./harvest";
import compound from "./compound";
import { BigNumber } from "ethers";

export async function loadStoredVault() {
  const content = fs.readFileSync("src/data/vaults.json", "utf8");

  const vaults = JSON.parse(content);

  for (let [key, value] of Object.entries(vaults)) {
    setInterval(function () {
      timer(key);
    }, (value as any).interval);
  }

  async function timer(vaultAddress: string) {
    try {
      console.log("new run for", vaultAddress, new Date().toLocaleString());
      await harvest(vaultAddress);
      await compound(vaultAddress);
    } catch (err) {
      console.log(err);
    }
  }
}
