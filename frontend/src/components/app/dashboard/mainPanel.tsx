import { ChevronRightIcon } from '@heroicons/react/20/solid';
import React from 'react';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const MainPanel = () => {
	return (
		<>
			<ul role="list" className="divide-y divide-white/5">
				<li className="relative flex cursor-pointer items-center space-x-4 p-4 transition-all ease-in-out hover:bg-gray-700 sm:px-6 lg:px-8">
					<div className="min-w-0 flex-auto">
						<div className="flex items-center gap-x-3">
							<div
								className={
									// eslint-disable-next-line @typescript-eslint/ban-ts-comment
									// @ts-ignore
									classNames('text-green-500', 'flex-none rounded-full p-1')
								}
							>
								<div className="h-2 w-2 rounded-full bg-current" />
							</div>
							<h2 className="min-w-0 text-sm font-semibold leading-6 text-white">
								<a href="#" className="flex gap-x-2">
									<span className="truncate whitespace-nowrap">ABCDE</span>
									<span className="absolute inset-0" />
								</a>
							</h2>
						</div>
						<div className="mt-3 flex items-center gap-x-2.5 text-xs leading-5 text-gray-400">
							<p className="whitespace-nowrap">aaa</p>
						</div>
					</div>
					<div className={'flex-row gap-2 md:flex'}>
						<div
							className={classNames(
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								'text-gray-400',
								'md:rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset truncate',
							)}
						>
							bbbbb
						</div>
						<div className={'invisible hidden text-center text-gray-400 md:visible md:flex'}>{'<>'}</div>
						<div
							className={classNames(
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-ignore
								'text-gray-400',
								'md:rounded-full flex-none py-1 px-2 text-xs font-medium ring-1 ring-inset truncate',
							)}
						>
							cccc
						</div>
					</div>
					<ChevronRightIcon className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
				</li>
			</ul>
		</>
	);
};

export default MainPanel;
