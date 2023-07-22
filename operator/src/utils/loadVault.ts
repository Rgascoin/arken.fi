import fs from 'fs';
import { ethers } from 'ethers';
import etherProvider from '../config/etherProvider';
import vaultAbi from '../abi/Vault.json';
import Config from 'src/config/config';
import factoryAbi from '../abi/Factory.json';
import cron from "node-cron";
import harvest from './harvest';
import compound from './compound';

export async function loadVault(owner: string, asset: string, vaultAddress: string) {
    const content = fs.readFileSync('data/vaults.json', 'utf8');

    const vaults = JSON.parse(content);

    const factoryAddress = Config.factoryAddress();

    const factory = new ethers.Contract(factoryAddress, factoryAbi, etherProvider);
    const vault = new ethers.Contract(vaultAddress, vaultAbi, etherProvider);

    const createdVaults = await factory.vaultsMapping(owner, asset);
    const vaultData = createdVaults.find((vault: any) => vault[0] === vaultAddress);

    vaults[vaultAddress] = {operator: await vault.operator(), interval: vaultData[1]};

    fs.writeFileSync('data/vaults.json', JSON.stringify(vaults));

    // TODO add cron job every x seconds
    cron.schedule(`*/${vaultData[1]} * * * *`, async () => {
        await harvest(vaultAddress);
        await compound(vaultAddress);
    });
}
