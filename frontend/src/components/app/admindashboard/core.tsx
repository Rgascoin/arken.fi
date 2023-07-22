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
	owner: string;
	strategy: string;
	operator: string;
	fee: bigint;
	feeRecipient: string;
	interval: bigint;
	asset: string;
	name: string;
	symbol: string;
};

const Core = () => {
	const userClient = useUserContext();
	const router = useRouter();
	const { focus } = router.query;
	const [modalFormData, setModalFormData] = useState<ModalFormData>({
		owner: '',
		strategy: '',
		operator: '',
		fee: 0n,
		feeRecipient: '',
		interval: 0n,
		asset: '',
		name: '',
		symbol: '',
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
		const vaultContract = getContract(FactoryContractAddress, factoryAbi, signer);
		if (!vaultContract) {
			console.log("Can't fetch the vault contract");
			return;
		}

		const assetAddress = await vaultContract.createVault(
			modalFormData.owner,
			modalFormData.strategy,
			modalFormData.operator,
			modalFormData.fee,
			modalFormData.feeRecipient,
			modalFormData.interval,
			modalFormData.asset,
			modalFormData.name,
			modalFormData.symbol,
		);
		await assetAddress.wait();
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('http://localhost:3001/');

				setModalFormData({
					owner: userClient.address as string,
					strategy: '',
					operator: await response.text(),
					fee: 500n,
					feeRecipient: userClient.address as string,
					interval: 604800n,
					asset: '0x4d224452801ACEd8B2F0aebE155379bb5D594381',
					name: 'First Vault',
					symbol: 'FVLT',
				});
			} catch (e: any) {
				console.log(e);
			}
		};

		if (userClient.setPickedDeposit) userClient.setPickedDeposit(undefined);

		if (userClient.provider && userClient.address) fetchData();
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
											className={`my-3 cursor-pointer rounded-xl border border-yellow-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-yellow-700 hover:bg-yellow-600`}
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
												'my-3 cursor-pointer rounded-xl border border-yellow-600 bg-yellow-600/40 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-yellow-700 hover:bg-yellow-600'
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
											className={`my-3 cursor-pointer rounded-xl border border-yellow-600 bg-yellow-600/40 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-yellow-700 hover:bg-yellow-600`}
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
												'my-3 cursor-pointer rounded-xl border border-yellow-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-yellow-700 hover:bg-yellow-600'
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
											<div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
												<CurrencyDollarIcon
													className="h-6 w-6 text-yellow-600"
													aria-hidden="true"
												/>
											</div>
											<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
												<Dialog.Title
													as="h3"
													className="text-base font-semibold leading-6 text-gray-100"
												>
													Create a Vault
												</Dialog.Title>
												<div className="mt-1">
													<p className="text-sm text-gray-300">
														Provide some information to create your vault.
													</p>
												</div>
											</div>
										</div>
										<div className={'my-6'}>
											<div>
												<label
													htmlFor="amount"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													Owner
												</label>
												<div className="">
													<input
														type="text"
														name="owner"
														value={modalFormData.owner}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="strategy"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													strategy
												</label>
												<div className="">
													<input
														type="text"
														name="strategy"
														value={modalFormData.strategy}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="operator"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													operator
												</label>
												<div className="">
													<input
														type="text"
														name="operator"
														value={modalFormData.operator}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="fee"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													fee
												</label>
												<div className="">
													<input
														type="number"
														name="fee"
														value={modalFormData.fee.toString()}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="feeRecipient"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													feeRecipient
												</label>
												<div className="">
													<input
														type="text"
														name="feeRecipient"
														value={modalFormData.feeRecipient}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="feeRecipient"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													interval
												</label>
												<div className="">
													<input
														type="number"
														name="interval"
														value={modalFormData.interval.toString()}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="feeRecipient"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													asset
												</label>
												<div className="">
													<input
														type="text"
														name="asset"
														value={modalFormData.asset}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="feeRecipient"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													name
												</label>
												<div className="">
													<input
														type="text"
														name="name"
														value={modalFormData.name}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
											<div className={'mt-2'}>
												<label
													htmlFor="symbol"
													className="block text-sm font-medium leading-6 text-gray-200"
												>
													symbol
												</label>
												<div className="">
													<input
														type="text"
														name="symbol"
														value={modalFormData.symbol}
														onChange={onChange}
														className="block w-full rounded-md border-0 bg-gray-600 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-yellow-600 sm:text-sm sm:leading-6"
														aria-describedby="form text input"
													/>
												</div>
											</div>
										</div>{' '}
									</div>
									<div className="bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
										<button
											className="inline-flex w-full justify-center rounded-md bg-yellow-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-150 ease-in-out hover:scale-105 hover:bg-yellow-500 sm:ml-3 sm:w-auto"
											onClick={async () => {
												setOpen(false);
												await requestStaking();
											}}
										>
											Create!
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
