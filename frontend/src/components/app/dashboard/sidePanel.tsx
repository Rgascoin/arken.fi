import React from 'react';

import { useUserContext } from '../../../contexts/userContext';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const SidePanel = () => {
	const userContext = useUserContext();

	return (
		<>
			<aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
				<header className="flex items-center justify-between border-b border-white/5 p-4 sm:p-6 lg:px-8">
					<div className={'text-gray-400'}>
						<h2 className="text-base font-semibold leading-7 text-white">Deposit information</h2>
						<h3 className={''}>Specific information on a deposit</h3>
					</div>
				</header>
				<div>
					{userContext.pickedDeposit ? (
						<div>
							<h2 className={'px-3 pt-3 text-white'}>{userContext.pickedDeposit.depositName}</h2>
							<h2 className={'px-3 pb-3 text-sm text-gray-400'}>
								{userContext.pickedDeposit.description}
							</h2>

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
							<div className={'flex items-center justify-center gap-x-8 px-3'}>
								<button
									className={
										'my-3 cursor-pointer rounded-xl border border-indigo-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600'
									}
								>
									+ Deposit
								</button>
								<button
									className={
										'my-3 cursor-pointer rounded-xl border border-red-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-red-700 hover:bg-red-600'
									}
								>
									- Withdraw
								</button>
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
