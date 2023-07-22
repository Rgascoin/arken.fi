import React, { useState } from 'react';

import { useUserContext } from '../../../contexts/userContext';

enum ActionState {
	none = 'NONE',
	deposit = 'DEPOSIT',
	withdraw = 'WITHDRAW',
}

const SidePanel = () => {
	const userContext = useUserContext();
	const [dataForm, setDataForm] = useState<number>(0);
	const [actionState, setActionState] = useState<ActionState>(ActionState.none);

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
									onClick={async () => {
										setActionState(ActionState.deposit);
									}}
									className={
										'my-3 cursor-pointer rounded-xl border border-indigo-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600'
									}
								>
									+ Deposit
								</button>
								<button
									onClick={async () => {
										setActionState(ActionState.withdraw);
									}}
									className={
										'my-3 cursor-pointer rounded-xl border border-red-600 px-4 py-1 text-sm text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-red-700 hover:bg-red-600'
									}
								>
									- Withdraw
								</button>
							</div>

							{actionState !== ActionState.none && (
								<div>
									{' '}
									<div className={'mx-20 my-4 border border-gray-600'} />
									<div className={'m-3'}>
										<label
											htmlFor="email"
											className="block text-sm font-medium leading-6 text-gray-200"
										>
											{actionState === ActionState.deposit ? 'Deposit' : 'Withdraw'}
											{'  '}amount{' '}
											<span className={'cursor-pointer text-sm text-gray-400 hover:underline'}>
												{' '}
												- max
											</span>
										</label>
										<div className="mt-2">
											<input
												type="number"
												name="dataForm"
												id="dataForm"
												value={dataForm}
												onChange={(e: any) => {
													setDataForm(e.target.value);
												}}
												className="block w-full rounded-md border-0 bg-gray-900 px-3 py-1.5 text-gray-300 shadow-sm ring-1 ring-inset ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
												placeholder="0.00"
												aria-describedby="form text input"
											/>
										</div>

										<div className={'flex items-center justify-center gap-x-8 px-3'}>
											<button
												onClick={async () => {
													setActionState(ActionState.none);
												}}
												className={
													'text-md my-3 cursor-pointer rounded-xl border border-red-600 px-4 py-1 text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-red-700 hover:bg-red-600'
												}
											>
												Cancel
											</button>
											<button
												className={
													'text-md my-3 cursor-pointer rounded-xl border border-indigo-600 px-4 py-1 text-gray-200 transition-all duration-150 ease-in-out hover:scale-105 hover:border-indigo-700 hover:bg-indigo-600'
												}
											>
												Validate
											</button>
										</div>
									</div>
								</div>
							)}
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
