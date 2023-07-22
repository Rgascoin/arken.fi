import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { ethers, JsonRpcApiProvider, JsonRpcSigner } from 'ethers';
import React, { useEffect, useState } from 'react';

import { useUserContext } from '../../../contexts/userContext';
import factoryAbi from '../../../web3/abi/Factory.json';
import vaultAbi from '../../../web3/abi/Vault.json';
import getContract from '../../../web3/toolkit/getContract';

const deployments = [
	{
		id: 1,
		vaultAddress: 'Deposit #1',
		color: 'text-green-400 bg-green-400/10',
		description: 'on StakerZ',
		data: '123.00 ETH',
		dataColor: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
		stats: [
			{ name: 'Vault Balance', value: '23,533.00', unit: 'ape' },
			{ name: 'User Balance', value: '123.00', unit: 'ape' },
			{ name: 'Re-stake', value: '5.00', unit: 'ape' },
		],
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const FactoryContractAddress = '0x9155497EAE31D432C0b13dBCc0615a37f55a2c87';

const MainPanel = () => {
	const userClient = useUserContext();
	const [activeStakings, setActiveStakings] = useState<any>(undefined);

	const pickedDeposit = async (depositData: unknown) => {
		if (userClient.setPickedDeposit) userClient.setPickedDeposit(depositData);
	};

	const fetchVaultList = async (): Promise<string[] | Promise<undefined>> => {
		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer");
			return;
		}

		const signer = new JsonRpcSigner(userClient.provider as JsonRpcApiProvider, userClient.address);
		const contract = getContract(FactoryContractAddress, factoryAbi, signer);
		if (!contract) {
			console.log("Can't fetch the contract");
			return;
		}

		// Fetching data until the array is empty
		const addresses = await contract.getVaults();
		return addresses;
	};

	const fetchVaultsBalance = async (vaultsAddresses: string[]) => {
		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer");
			return;
		}
		const stakedVaults: any = [];
		const signer = new JsonRpcSigner(userClient.provider as JsonRpcApiProvider, userClient.address);

		await Promise.all(
			vaultsAddresses.map(async (vaultAddress: string, index: number) => {
				const vaultContract = getContract(vaultAddress, vaultAbi, signer);
				if (!vaultContract) return;
				const userBalance = await vaultContract.balanceOf(userClient.address);
				if (userBalance.toString() !== '0') {
					const totalAsset = await vaultContract.totalAssets();

					stakedVaults.push({
						id: index,
						vaultAddress,
						color: 'text-green-400 bg-green-400/10',
						description: 'Happy staking.',
						data: `${ethers.formatEther(userBalance)} Eth`,
						dataColor: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
						stats: [
							{ name: 'Vault Balance', value: `${ethers.formatEther(totalAsset)}`, unit: 'Ape' },
							{ name: 'User Balance', value: `${ethers.formatEther(userBalance)}`, unit: 'Ape' },
							{ name: 'Re-stake', value: 'XX', unit: 'Ape' },
						],
					});
				}

				// VaultsBalances.push({address: vaultAddress, totalAsset: totalAsset.toString(), initials: vaultAddress.substring(0,3), bgColor: 'bg-red-600'})
			}),
		);
		return stakedVaults;
	};

	useEffect(() => {
		const fetch = async () => {
			const addresses = await fetchVaultList();
			if (!addresses) {
				console.error('failed to get vaults addresses');
				return;
			}
			const fetchedVaults = await fetchVaultsBalance(addresses);
			setActiveStakings(fetchedVaults);
		};

		fetch();
	}, []);

	return (
		<>
			<ul role="list" className="divide-y divide-white/5">
				{activeStakings &&
					activeStakings.map((stake: any) => (
						<li
							key={stake.id}
							className="relative flex cursor-pointer items-center space-x-4 p-4 transition-all ease-in-out hover:bg-gray-700 sm:px-6 lg:px-8"
						>
							<div className="min-w-0 flex-auto">
								<div className="flex items-center gap-x-3">
									<div
										className={
											// eslint-disable-next-line @typescript-eslint/ban-ts-comment
											// @ts-ignore
											classNames(stake.color, 'flex-none rounded-full p-1')
										}
									>
										<div className="h-2 w-2 rounded-full bg-current" />
									</div>
									<h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
										<button
											onClick={async () => {
												await pickedDeposit(stake);
											}}
											className="flex gap-x-2"
										>
											<span className="truncate whitespace-nowrap">
												{stake.vaultAddress.substring(0, 6)}...
											</span>
											<span className="absolute inset-0" />
										</button>
									</h2>
								</div>
								<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
									<p className="whitespace-nowrap">{stake.description}</p>
								</div>
							</div>
							<div className={'flex-row gap-2 md:flex'}>
								<div
									className={classNames(
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-ignore
										stake.dataColor,
										'md:rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset truncate',
									)}
								>
									{stake.data}
								</div>
							</div>
							<ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
						</li>
					))}
			</ul>
		</>
	);
};

export default MainPanel;
