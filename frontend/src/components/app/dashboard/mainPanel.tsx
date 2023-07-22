import { ChevronRightIcon } from '@heroicons/react/20/solid';
import React from 'react';

import { useUserContext } from '../../../contexts/userContext';

const deployments = [
	{
		id: 1,
		depositName: 'Deposit #1',
		color: 'text-green-400 bg-green-400/10',
		description: 'on StakerZ',
		data: 'StakerZ',
		dataColor: 'text-indigo-400 bg-indigo-400/10 ring-indigo-400/30',
		stats: [
			{ name: 'Vault Balance', value: '23,533.00', unit: 'eth' },
			{ name: 'User Balance', value: '123.00', unit: 'eth' },
			{ name: 'Re-stake', value: '5.00', unit: 'eth' },
		],
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const MainPanel = () => {
	const userClient = useUserContext();

	const pickedDeposit = async (depositData: unknown) => {
		if (userClient.setPickedDeposit) userClient.setPickedDeposit(depositData);
	};

	return (
		<>
			<ul role="list" className="divide-y divide-white/5">
				{deployments.map((deposit) => (
					<li
						key={deposit.id}
						className="relative flex cursor-pointer items-center space-x-4 p-4 transition-all ease-in-out hover:bg-gray-700 sm:px-6 lg:px-8"
					>
						<div className="min-w-0 flex-auto">
							<div className="flex items-center gap-x-3">
								<div
									className={
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-ignore
										classNames(deposit.color, 'flex-none rounded-full p-1')
									}
								>
									<div className="h-2 w-2 rounded-full bg-current" />
								</div>
								<h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
									<button
										onClick={async () => {
											await pickedDeposit(deposit);
										}}
										className="flex gap-x-2"
									>
										<span className="truncate whitespace-nowrap">{deposit.depositName}</span>
										<span className="absolute inset-0" />
									</button>
								</h2>
							</div>
							<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
								<p className="whitespace-nowrap">{deposit.description}</p>
							</div>
						</div>
						<div className={'flex-row gap-2 md:flex'}>
							<div
								className={classNames(
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-ignore
									deposit.dataColor,
									'md:rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset truncate',
								)}
							>
								{deposit.data}
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
