import { Menu, Transition } from '@headlessui/react';
import { ChevronRightIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useState } from 'react';

import MainPanel from './mainPanel';
import SidePanel from './sidePanel';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const Core = () => {
	return (
		<div>
			<main className="lg:pr-96">
				<header className="flex items-center justify-between border-b border-white/5 p-4 sm:p-6 lg:px-8">
					<div className={'text-gray-400'}>
						<h1 className="text-base font-semibold leading-7 text-white">Main Pannel</h1>
						<h2>Specific description</h2>
					</div>
				</header>

				{/* Service list */}
				<MainPanel />
			</main>

			{/* Activity feed */}
			<SidePanel />
		</div>
	);
};

export default Core;
