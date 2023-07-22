import { Contract, Wallet } from "ethers";
import vaultAbi from "../abi/Vault.json";
import provider from "src/config/etherProvider";
import fs from "fs";
import Config from "src/config/config";

const compound = async (
  vaultAddress: string,
) => {
  const mnemonic = Config.mnemonics();
  const vault = new Contract(vaultAddress, vaultAbi, provider);
  const operator = await vault.operator();

  const content = fs.readFileSync('data/wallets.json', 'utf8');
  const wallets = JSON.parse(content);

  const path = wallets[operator];
  const wallet = Wallet.fromMnemonic(mnemonic, path.path).connect(provider);

  vault.connect(wallet);

  try {
    // compound the rewards
    const tx = await vault.compound();

    const receipt = await tx.wait();
    if (receipt.status === 0) {
      throw new Error(`Transaction reverted: ${tx.hash}`);
    }
  } catch (err: any) {
    throw new Error(`Cannot compound: ${err.message}`);
  }

  console.log("compounded", vaultAddress);
};

export default compound;
