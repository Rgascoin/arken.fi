import { Contract, Wallet } from "ethers";
import vaultAbi from "../abi/Vault.json";
import provider from "../config/etherProvider";
import fs from "fs";
import Config from "../config/config";

const harvest = async (vaultAddress: string) => {
  try {
    const mnemonic = Config.mnemonics();
    const vault = new Contract(vaultAddress, vaultAbi, provider);
    const operator = await vault.operator();

    const content = fs.readFileSync("src/data/wallets.json", "utf8");
    const wallets = JSON.parse(content);

    const path = wallets[operator];
    const wallet = Wallet.fromMnemonic(mnemonic, path).connect(provider);

    const newVault = new Contract(vaultAddress, vaultAbi, wallet);

    // Harvest the rewards
    const tx = await newVault.harvest();

    const receipt = await tx.wait();
    if (receipt.status === 0) {
      throw new Error(`Transaction reverted: ${tx.hash}`);
    }
  } catch (err: any) {
    throw new Error(`Cannot harvest: ${err.message}`);
  }

  console.log("harvested", vaultAddress);
};

export default harvest;
