import config from "./config/config";
import { ethers } from "ethers";
import { loadVault } from "./utils/loadVault";
import factoryAbi from "./abi/Factory.json";
import etherProvider from "./config/etherProvider";
import cors from 'cors';

import express from "express";

import fs from "fs";
import { loadStoredVault } from "./utils/loadStoredVaults";

function randomWallet(mnemonic: string, path: string): ethers.Wallet {
  return ethers.Wallet.fromMnemonic(mnemonic, path);
}

(async () => {
  const factoryAddress = config.factoryAddress();

  await loadStoredVault();

  // Load the vaults from the factory
  const factory = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    etherProvider
  );
  factory.on(
    "VaultCreated",
    async (owner: string, asset: string, vaultAddress: string) => {
      console.log("VaultCreated", owner, asset, vaultAddress);
      try {
        await loadVault(owner, asset, vaultAddress);
      } catch (err) {
        console.log(err);
      }
    }
  );

  const app = express();
  const port = config.port();

  const allowedOrigins = ['http://localhost:3000'];
  const options: cors.CorsOptions = {
    origin: allowedOrigins
  };

// Then pass these options to cors:
  app.use(cors(options));

  app.get("/", (req: any, res: any) => {
    const path = "m/44'/60'/0'/0/" + Math.floor(Math.random() * 1000000);
    const wallet = randomWallet(config.mnemonics(), path);

    const content = fs.readFileSync("src/data/wallets.json", "utf8");
    const wallets = JSON.parse(content);

    wallets[wallet.address] = path;

    fs.writeFileSync("src/data/wallets.json", JSON.stringify(wallets));

    res.send(wallet.address);
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  // TODO load the vaults from the vaults.json file
})();
