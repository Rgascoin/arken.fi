import React, {useEffect, useState} from 'react';
import getContract from "../../../web3/toolkit/getContract";

interface VaultData {
	address: string;
	totalAsset: string;
	initials: string;
	bgColor: string;
}

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

import factoryAbi from '../../../web3/abi/Factory.json';
import vaultAbi from '../../../web3/abi/Vault.json';
import {useUserContext} from "../../../contexts/userContext";
import {JsonRpcApiProvider, JsonRpcSigner, Provider} from "ethers";
const FactoryContractAddress = '0x9155497EAE31D432C0b13dBCc0615a37f55a2c87';

const VaultList = () => {
	const userClient = useUserContext();
	const [vaults, setVaults] = useState<VaultData[] | undefined>()

	const fetchVaultList = async (): Promise<string[] | Promise<undefined>> => {
		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer")
			return;
		}

		const signer = new JsonRpcSigner(userClient.provider as JsonRpcApiProvider, userClient.address)
		const contract = getContract(FactoryContractAddress, factoryAbi, signer);
		if (!contract) {
			console.log("Can't fetch the contract")
			return;
		}

		// Fetching data until the array is empty
		const addresses = await contract.getVaults();
		return addresses;
	}

	const fetchVaultsBalance = async (vaultsAddresses: string[]) => {
		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer")
			return;
		}
		const VaultsBalances: VaultData[] = [];
		const signer = new JsonRpcSigner(userClient.provider as JsonRpcApiProvider, userClient.address)

		await Promise.all(vaultsAddresses.map(async (vaultAddress: string) => {
			const vaultContract = getContract(vaultAddress, vaultAbi, signer);
			if (!vaultContract) return;
			const totalAsset = await vaultContract.totalAssets();
			VaultsBalances.push({address: vaultAddress, totalAsset: totalAsset.toString(), initials: vaultAddress.substring(0,3), bgColor: 'bg-red-600'})
		}));
		return VaultsBalances;
	}

	useEffect(() => {
		const fetch = async () => {
			const addresses = await fetchVaultList();
			if (!addresses) {
				console.error('failed to get vaults addresses')
				return;
			}
			const fetchedVaults = await fetchVaultsBalance(addresses);
			setVaults(fetchedVaults)
		}

		fetch();
	}, [])

	return (
		<div>
			<ul role="list" className="mx-6 my-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
				{vaults && vaults.map((vault) => (
					<li
						key={vault.address}
						// onClick={async () => {
						// 	await setDataForm(project);
						// }}
						className="col-span-1 flex cursor-pointer rounded-md shadow-sm transition-all ease-in-out hover:scale-105"
					>
						<div
							className={classNames(
								vault.bgColor,
								'flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white',
							)}
						>
							{vault.initials}
						</div>
						<div className="flex flex-1 items-center justify-between truncate rounded-r-md border-y border-r border-gray-700 bg-gray-700">
							<div className="flex-1 truncate px-4 py-2 text-sm">
								<div className="font-medium text-gray-200 hover:text-gray-100">{vault.address}</div>
								<p className="truncate text-gray-400">Total asset: {vault.totalAsset}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default VaultList;
