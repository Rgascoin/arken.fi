import React from 'react';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

const SidePanel = () => {
	return (
		<>
			<aside className="bg-black/10 lg:fixed lg:bottom-0 lg:right-0 lg:top-16 lg:w-96 lg:overflow-y-auto lg:border-l lg:border-white/5">
				<header className="flex items-center justify-between border-b border-white/5 p-4 sm:p-6 lg:px-8">
					<div className={'text-gray-400'}>
						<h2 className="text-base font-semibold leading-7 text-white">Side Pannel</h2>
						<h3 className={''}>Specific information</h3>
					</div>
				</header>
			</aside>
		</>
	);
};

export default SidePanel;
