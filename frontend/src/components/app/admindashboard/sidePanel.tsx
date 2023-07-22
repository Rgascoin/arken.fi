import { ethers, JsonRpcApiProvider, JsonRpcSigner } from 'ethers';
import React, { useState } from 'react';

import { useUserContext } from '../../../contexts/userContext';

const SidePanel = () => {
	const userContext = useUserContext();
	const [dataForm, setDataForm] = useState<number>(0);

	const refillRunner = async () => {
		if (!userContext.provider || !userContext.address) {
			console.error("Can't get signer");
			return;
		}
		const stakedVaults: any = [];
		const signer = new JsonRpcSigner(userContext.provider as JsonRpcApiProvider, userContext.address);

		const tx = {
			to: userContext.pickedDeposit.operator,
			value: ethers.parseEther('2'),
		};
		await signer.sendTransaction(tx);
	};

	return (
		<>
			<aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
				<header className="flex items-center justify-between border-b border-white/5 p-4 sm:p-6 lg:px-8">
					<div className={'text-gray-400'}>
						<h2 className="text-base font-semibold leading-7 text-white">Vault information</h2>
						<h3 className={''}>Specific information on a Vault</h3>
					</div>
				</header>
				<div>
					{userContext.pickedDeposit ? (
						<div>
							<h2 className={'truncate px-3 pt-3 text-white'}>
								{userContext.pickedDeposit.vaultAddress}
							</h2>
							<h2 className={'px-3 pb-3 text-sm text-gray-400'}>
								gas left:{' '}
								{userContext.pickedDeposit.gas && ethers.formatEther(userContext.pickedDeposit.gas)}
							</h2>
							<button
								onClick={async () => {
									await refillRunner();
								}}
								className={
									'm-3 cursor-pointer rounded-xl border border-orange-600 px-3 py-1 text-sm text-gray-200 transition-all duration-150 hover:scale-105 hover:bg-orange-600'
								}
							>
								Refile in gas
							</button>

							<div className="bg-gray-700">
								<div className="mx-auto max-w-7xl">
									<div className="grid grid-cols-1 gap-px bg-white/5">
										{userContext.pickedDeposit.stats.map((stat: any) => (
											<div key={stat.name} className="bg-gray-800 px-4 py-6 sm:px-6 ">
												<p className="text-sm font-medium leading-6 text-gray-400">
													{stat.name}
												</p>

												<p className="mt-2 flex items-baseline gap-x-2">
													<span className="text-4xl font-semibold tracking-tight text-white">
														{stat.value}
													</span>
													{stat.unit ? (
														<span className="text-sm text-gray-400">{stat.unit}</span>
													) : null}
												</p>
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className={'py-4 text-center text-gray-500'}>Picked a deposit</div>
					)}
				</div>
			</aside>
		</>
	);
};

export default SidePanel;
