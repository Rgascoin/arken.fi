import React, {useEffect, useState} from 'react';
import getContract from "../../../web3/toolkit/getContract";

const vaults = [
	{
		name: 'Drake',
		initials: 'DKRS',
		desc: 'Total: 234,123 ETH',
		bgColor: 'bg-red-600',
	},
	{
		name: 'Cat',
		initials: 'CT',
		desc: 'Total: 234,123 ETH',
		bgColor: 'bg-green-600',
	},
	{
		name: 'SupraChain',
		initials: 'SPRCH',
		desc: 'Total: 234,123 ETH',
		bgColor: 'bg-blue-600',
	},
	{
		name: 'Irgr',
		initials: 'Ir',
		desc: 'Total: 234,123 ETH',
		bgColor: 'bg-orange-600',
	},
	{
		name: 'Yahourt',
		initials: 'yht',
		desc: 'Total: 234,123 ETH',
		bgColor: 'bg-blue-600',
	},
	{
		name: 'pitch',
		initials: 'DCK',
		desc: 'Total: 234,123 ETH',
		bgColor: 'bg-orange-600',
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

import factoryAbi from '../../../web3/abi/Factory.json';
import {useUserContext} from "../../../contexts/userContext";
import {JsonRpcApiProvider, JsonRpcSigner, Provider} from "ethers";
const contractAddress = '0x60193d4AB61C2872CAA509Ee532F9Db169730A46';

const VaultList = () => {
	const userClient = useUserContext();
	const [vaultsAddress, setVaultsAddress] = useState<string[] | undefined>()

	const fetchVaultList = async () => {
		const fetchedAddresses: string[] = [];

		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer")
			return;
		}

		const signer = new JsonRpcSigner(userClient.provider as JsonRpcApiProvider, userClient.address)
		const contract = getContract(contractAddress, factoryAbi, signer);
		if (!contract) {
			console.log("Can't fetch the contract")
			return;
		}

		// Fetching data until the array is empty
		try {
			let index = 0;
			while (true) {
				const address = await contract.vaults(index);
				fetchedAddresses.push(address);
				index++;
			}
		} catch (error) {
			console.error("Error fetching vault:", error);
		}
		console.log(fetchedAddresses)
	}

	useEffect(() => {
		fetchVaultList();
	}, [])

	return (
		<div>
			<ul role="list" className="mx-6 my-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-2">
				{vaults.map((vault) => (
					<li
						key={vault.name}
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
								<div className="font-medium text-gray-200 hover:text-gray-100">{vault.name}</div>
								<p className="truncate text-gray-400">{vault.desc}</p>
							</div>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default VaultList;
