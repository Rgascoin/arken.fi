/* eslint-disable @typescript-eslint/no-shadow */

import { useSignIn } from '@walletconnect/modal-auth-react';
import { JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { useRouter } from 'next/router';
import * as process from 'process';
import React from 'react';

import { useUserContext } from '../contexts/userContext';

const LoginForm = () => {
	const router = useRouter();
	const userClient = useUserContext();
	const { signIn, data, error } = useSignIn({
		statement: 'Connect to my dapp',
		aud: process.env.NEXT_PUBLIC_DOMAIN,
	});

	const onSignIn = async () => {
		if (!userClient.setProvider || !userClient.setAddress) return;
		const data = await signIn();
		console.log(data);

		if (!error) {
			const provider = new JsonRpcProvider(
				`https://rpc.walletconnect.com/v1/?chainId=eip155:1&projectId=${process.env.NEXT_PUBLIC_PROJECT_ID}`,
			);

			// const signer = new JsonRpcSigner(provider, data.address);

			await userClient.setProvider(provider);
			await userClient.setAddress(data.address);
			await router.push('/app/userDashboard');
		}
	};

	return (
		<>
			<div className="flex h-screen flex-1">
				<div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
					<div className="mx-auto w-full max-w-sm lg:w-96">
						<div>
							<img
								className="h-10 w-auto"
								src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
								alt="Your Company"
							/>
							<h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-100">
								Sign in to your account
							</h2>
							<p className="mt-2 text-sm leading-6 text-gray-400">
								Don&apos;t have a wallet?{' '}
								<a
									href="https://zerion.io/"
									className="font-semibold text-indigo-600 hover:text-indigo-500"
								>
									Start now with Zerion
								</a>
							</p>
						</div>

						<div className="mt-10">
							<div className="mt-10">
								<div className="relative">
									<div className="absolute inset-0 flex items-center" aria-hidden="true">
										<div className="w-full border-t border-gray-200" />
									</div>
									<div className="relative flex justify-center text-sm font-medium leading-6">
										<span className="bg-gray-900 px-6 text-gray-100">continue with you wallet</span>
									</div>
								</div>

								<div className="mt-6 grid grid-cols-1 gap-4">
									<button
										onClick={onSignIn}
										className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md bg-blue-600 px-3 py-1.5 text-white transition-all duration-150 ease-in-out hover:scale-105 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]"
									>
										<span className="text-sm font-semibold leading-6">Wallet Connect</span>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="relative hidden w-0 flex-1 lg:block">
					<img
						className="absolute inset-0 h-full w-full object-cover"
						src="https://images.unsplash.com/photo-1631603090989-93f9ef6f9d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format"
						alt="Unsplay display"
					/>
				</div>
			</div>
		</>
	);
};

export default LoginForm;
