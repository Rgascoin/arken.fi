import { Dialog, Transition } from '@headlessui/react';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { JsonRpcApiProvider, JsonRpcSigner } from 'ethers';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useRef, useState } from 'react';

import { useUserContext } from '../../../contexts/userContext';
import factoryAbi from '../../../web3/abi/Factory.json';
import ierc20 from '../../../web3/abi/IErc.json';
import vaultAbi from '../../../web3/abi/Vault.json';
import getContract from '../../../web3/toolkit/getContract';
import MainPanel from './mainPanel';
import SidePanel from './sidePanel';
import VaultList from './vaultList';

const FactoryContractAddress = '0x9155497EAE31D432C0b13dBCc0615a37f55a2c87';

type ModalFormData = {
	vault: string;
	receiver: string;
	amount: number;
};

const Core = () => {
	const userClient = useUserContext();
	const router = useRouter();
	const { focus } = router.query;
	const [modalFormData, setModalFormData] = useState<ModalFormData>({
		vault: '',
		receiver: '',
		amount: 0,
	});
	const [vaultsAddresses, setVaultsAddresses] = useState<string[] | undefined>(undefined);

	const [open, setOpen] = useState(false);
	const cancelButtonRef = useRef(null);

	const onChange = (e: any) => {
		setModalFormData({ ...modalFormData, [e.target.name]: e.target.value });
	};

	const requestStaking = async () => {
		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer");
			return;
		}

		const signer = new JsonRpcSigner(userClient.provider as unknown as JsonRpcApiProvider, userClient.address);
		console.log(modalFormData.vault);
		const vaultContract = getContract(modalFormData.vault, vaultAbi, signer);
		if (!vaultContract) {
			console.log("Can't fetch the vault contract");
			return;
		}

		const assetAddress = await vaultContract.asset();
		const assetContract = getContract(assetAddress, ierc20, signer);
		if (!assetContract) {
			console.log("Can't fetch the erc20 contract");
			return;
		}

		const rxc = await assetContract.approve(modalFormData.vault, modalFormData.amount);
		await rxc.wait();

		const strat = await vaultContract.strategy();
		console.log('start:', strat);

		console.log(modalFormData.amount, modalFormData.receiver);
		await vaultContract.deposit(modalFormData.amount.toString(), modalFormData.receiver, { gasLimit: 1000000 });

		setModalFormData({
			vault: '',
			receiver: '',
			amount: 0,
		});
	};

	// TODO: Cut duplicate
	const fetchVaultList = async (): Promise<string[] | Promise<undefined>> => {
		if (!userClient.provider || !userClient.address) {
			console.error("Can't get signer");
			return;
		}

		const signer = new JsonRpcSigner(userClient.provider as unknown as JsonRpcApiProvider, userClient.address);
		const contract = getContract(FactoryContractAddress, factoryAbi, signer);
		if (!contract) {
			console.log("Can't fetch the contract");
			return;
		}

		// Fetching data until the array is empty
		const addresses = await contract.getVaults();
		return addresses;
	};

	useEffect(() => {
		const fetch = async () => {
			const list = await fetchVaultList();
			setVaultsAddresses(list);
			if (list) setModalFormData({ ...modalFormData, vault: list[0], receiver: userClient.address as string });
		};

		if (userClient.setPickedDeposit) userClient.setPickedDeposit(undefined);

		if (userClient.provider && userClient.address) fetch();
	}, [userClient.provider]);

	return (
		<>
			<div>
				<main className="lg:pr-96">
					<header className="flex items-center justify-between border-b border-white/5 p-4 sm:p-6 lg:px-8">
						<div className={'text-gray-400'}>
							<h1 className="text-base font-semibold leading-7 text-white">Your Vaults List</h1>
							<h2>Create an manage your Vaults</h2>
							<div className={'flex w-full flex-auto flex-wrap space-x-3'}>
								{focus === 'vaults' ? (
									<>
										<button
											onClick={async () => {
												await router.push({
													pathname: '/app/adminDashboard',
													query: { focus: '' },
												});
											}}
											className={`my-3 cursor-pointer rounded-xl border border-indigo-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600`}
										>
											Your Vaults
										</button>
										<button
											onClick={async () => {
												await router.push({
													pathname: '/app/adminDashboard',
													query: { focus: 'vaults' },
												});
											}}
											className={
												'my-3 cursor-pointer rounded-xl border border-indigo-600 bg-indigo-600/40 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600'
											}
										>
											All Vaults
										</button>
									</>
								) : (
									<>
										<button
											onClick={async () => {
												await router.push({
													pathname: '/app/adminDashboard',
													query: { focus: '' },
												});
											}}
											className={`my-3 cursor-pointer rounded-xl border border-indigo-600 bg-indigo-600/40 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600`}
										>
											Your Vaults
										</button>
										<button
											onClick={async () => {
												await router.push({
													pathname: '/app/adminDashboard',
													query: { focus: 'vaults' },
												});
											}}
											className={
												'my-3 cursor-pointer rounded-xl border border-indigo-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600'
											}
										>
											All Vaults
										</button>
									</>
								)}
								<button
									onClick={() => {
										setOpen(true);
									}}
									className={
										'my-3 cursor-pointer rounded-xl border border-orange-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-orange-700 hover:bg-orange-600'
									}
								>
									+ Create a Vault
								</button>
							</div>
						</div>
					</header>

					{/* Main list */}
					{focus === 'vaults' ? <VaultList /> : <MainPanel />}
				</main>

				{/* Side feed */}
				<SidePanel />
			</div>

			{/* Staking Modal */}
			<Transition.Root show={open} as={Fragment}>
				<Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
									<div className="bg-gray-700 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
										<div className="sm:flex sm:items-start">
											<div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
												<CurrencyDollarIcon
													className="h-6 w-6 text-indigo-600"
													aria-hidden="true"
												/>
											</div>
											<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
												<Dialog.Title
													as="h3"
													className="text-base font-semibold leading-6 text-gray-100"
												>
													Stake on Vault
												</Dialog.Title>
												<div className="mt-1">
													<p className="text-sm text-gray-300">
														Pick a Vault and Chose an amount to stake.
													</p>
												</div>
											</div>
										</div>
										<div className={'my-6'}>
											<div>
												<label
													htmlFor="vault"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													Vault
												</label>
												<select
													id="vault"
													name="vault"
													value={modalFormData.vault}
													onChange={onChange}
													className="mt-2 block w-full rounded-md border-0 bg-gray-600 py-1.5 pl-3 pr-10 text-gray-300 ring-1 ring-inset ring-gray-800 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
												>
													{vaultsAddresses &&
														vaultsAddresses.map((address, index) => (
															<option key={address}>{address}</option>
														))}
												</select>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="amount"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													Receiver
												</label>
												<div className="">
													<input
														type="text"
														name="receiver"
														value={modalFormData.receiver}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
														placeholder="0.00"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="amount"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													Amount
												</label>
												<div className="">
													<input
														type="number"
														name="amount"
														value={modalFormData.amount}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
														placeholder="0.00"
														aria-describedby="form text input"
													/>
												</div>
											</div>
										</div>{' '}
									</div>
									<div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
										<button
											className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 ease-in-out hover:scale-105 hover:bg-indigo-500 sm:ml-3 sm:w-auto"
											onClick={async () => {
												setOpen(false);
												await requestStaking();
											}}
										>
											Stake!
										</button>
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-gray-200 shadow-sm ring-1 ring-inset ring-gray-800 transition-all duration-150 ease-in-out hover:scale-105 hover:bg-gray-700 sm:mt-0 sm:w-auto"
											onClick={() => setOpen(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
};

export default Core;
