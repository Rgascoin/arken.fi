import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, LockClosedIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';

import { useUserContext } from '../../contexts/userContext';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

interface INavigationLink {
	name: string;
	href: string;
	icon: any;
	current: boolean;
}

interface IProps {
	navigation: INavigationLink[];
	children: any;
}

const Layout = ({ navigation, children }: IProps) => {
	const router = useRouter();
	const userContext = useUserContext();
	const [sidebarOpen, setSidebarOpen] = useState(false);

	return (
		<div className={'h-screen bg-gray-800'}>
			<div>
				<Transition.Root show={sidebarOpen} as={Fragment}>
					<Dialog as="div" className="relative z-50 xl:hidden" onClose={setSidebarOpen}>
						<Transition.Child
							as={Fragment}
							enter="transition-opacity ease-linear duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="transition-opacity ease-linear duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="fixed inset-0 bg-gray-900/80" />
						</Transition.Child>

						<div className="fixed inset-0 flex">
							<Transition.Child
								as={Fragment}
								enter="transition ease-in-out duration-300 transform"
								enterFrom="-translate-x-full"
								enterTo="translate-x-0"
								leave="transition ease-in-out duration-300 transform"
								leaveFrom="translate-x-0"
								leaveTo="-translate-x-full"
							>
								<Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
									<Transition.Child
										as={Fragment}
										enter="ease-in-out duration-300"
										enterFrom="opacity-0"
										enterTo="opacity-100"
										leave="ease-in-out duration-300"
										leaveFrom="opacity-100"
										leaveTo="opacity-0"
									>
										<div className="absolute left-full top-0 flex w-16 justify-center pt-5">
											<button
												type="button"
												className="-m-2.5 p-2.5"
												onClick={() => setSidebarOpen(false)}
											>
												<span className="sr-only">Close sidebar</span>
												<XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
											</button>
										</div>
									</Transition.Child>
									{/* Sidebar component, swap this element with another sidebar if you like */}
									<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
										<div className="flex h-16 shrink-0 items-center">
											<img className="h-14 w-auto" src="/images/quartz.png" alt="Your Company" />
										</div>
										<nav className="flex flex-1 flex-col">
											<ul role="list" className="flex flex-1 flex-col gap-y-7">
												<li>
													<ul role="list" className="-mx-2 space-y-1">
														{navigation.map((item, index: number) => (
															<li key={index}>
																<Link href={item.href}>
																	<div
																		className={classNames(
																			item.current
																				? 'bg-gray-800 text-white'
																				: 'text-gray-400 hover:text-white hover:bg-gray-800',
																			'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
																		)}
																	>
																		<item.icon
																			className="h-6 w-6 shrink-0"
																			aria-hidden="true"
																		/>
																		{item.name}
																	</div>
																</Link>
															</li>
														))}
													</ul>
												</li>
											</ul>
										</nav>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</Dialog>
				</Transition.Root>

				{/* Static sidebar for desktop */}
				<div className="hidden bg-gray-800 xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
					{/* Sidebar component, swap this element with another sidebar if you like */}
					<div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
						<div className="flex h-16 shrink-0 items-center">
							<img className="h-8 w-auto" src="/logo.png" alt="Your Company" />
						</div>
						<nav className="flex flex-1 flex-col">
							<ul role="list" className="flex flex-1 flex-col gap-y-7">
								<li>
									<ul role="list" className="-mx-2 space-y-1">
										{navigation.map((item, index: number) => (
											<li key={index}>
												<Link href={item.href}>
													<div
														className={classNames(
															item.current
																? 'bg-gray-800 text-white'
																: 'text-gray-400 hover:text-white hover:bg-gray-800',
															'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
														)}
													>
														<item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
														{item.name}
													</div>
												</Link>
											</li>
										))}
									</ul>
								</li>
							</ul>
						</nav>
					</div>
				</div>

				<div className="bg-gray-800 xl:pl-72">
					{/* Sticky search header */}
					<div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-6 border-b border-white/5 bg-gray-900 px-4 shadow-sm sm:px-6 lg:px-8">
						<button
							type="button"
							className="-m-2.5 p-2.5 text-white xl:hidden"
							onClick={() => setSidebarOpen(true)}
						>
							<span className="sr-only">Open sidebar</span>
							<Bars3Icon className="h-5 w-5" aria-hidden="true" />
						</button>
						<div className="flex flex-1 justify-end gap-x-4 self-stretch lg:gap-x-6">
							<div className={'justify-end'}>
								<div className="flex items-center gap-x-4 px-6 py-5 text-sm font-semibold leading-6 text-white hover:bg-gray-800">
									<span className="sr-only">Your profile</span>
									<span aria-hidden="true">
										{userContext.address &&
											`0x${userContext.address.slice(2, 6)}...${userContext.address.slice(-4)}`}
									</span>
									<button
										className={'ml-auto'}
										onClick={async () => {
											await router.push('/');
										}}
									>
										<LockClosedIcon
											className="h-5 w-5 cursor-pointer transition-all ease-in-out hover:scale-105 hover:text-red-600"
											aria-hidden="true"
										/>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/* START */}
					{children}
					{/* END */}
				</div>
			</div>
		</div>
	);
};

export default Layout;
